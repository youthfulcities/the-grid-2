import json
import os
from datetime import datetime

import boto3
from bs4 import BeautifulSoup

# Initialize Bedrock Agent Runtime
bedrock_agent_runtime = boto3.client("bedrock-agent-runtime")

# Required environment variables:
# - BEDROCK_AGENT_ID
# - BEDROCK_AGENT_ALIAS_ID

def extract_source_id_map(text: str) -> dict:
    """Extracts {source_id: full_quote} from the <search_result> blocks inside a raw prompt XML string"""
    if "<search_results>" not in text:
        return {}

    try:
        start = text.find("<search_results>")
        end = text.find("</search_results>") + len("</search_results>")
        xml_snippet = text[start:end]

        soup = BeautifulSoup(f"<root>{xml_snippet}</root>", "xml")
        source_id_map = {}

        for result in soup.find_all("search_result"):
            source_tag = result.find("source")
            content_tag = result.find("content")
            if source_tag and content_tag:
                source_id = source_tag.text.strip()
                quote_text = content_tag.text.strip()
                source_id_map[source_id] = quote_text

        return source_id_map

    except Exception as e:
        print(f"Failed to parse source IDs: {e}")
        return {}

def handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        query = body.get("query")
        sessionId = body.get("sessionId", str(datetime.now().timestamp()))
        if not query:
            raise ValueError("No query provided.")

        response_stream = bedrock_agent_runtime.invoke_agent(
            agentId=os.environ["BEDROCK_AGENT_ID"],
            agentAliasId=os.environ["BEDROCK_AGENT_ALIAS_ID"],
            sessionId=sessionId,
            inputText=query,
            enableTrace=True
        )

        # Extract the streaming payload
        full_response = ""
        trace_data = []
        source_id_map = {}
        source_chunks = []
        follow_ups = []

        for event in response_stream["completion"]:
            if "chunk" in event:
                full_response += event["chunk"]["bytes"].decode("utf-8")
                print(full_response)
            if "trace" in event:
                trace = event["trace"]["trace"]
                trace_data.append(trace)
                # Extract source ID map from model input
                model_input = trace.get("orchestrationTrace", {}).get("modelInvocationInput", {})
                if model_input.get("type") == "KNOWLEDGE_BASE_RESPONSE_GENERATION":
                    prompt_text = model_input.get("text", "")
                    source_id_map.update(extract_source_id_map(prompt_text))

        #get the second last trace before the finish trace, which contains the final response with source tags
        finish_index = next(
            (i for i, trace in enumerate(trace_data)
             if trace.get("orchestrationTrace", {}).get("observation", {}).get("type") == "FINISH"),
            None
        )
        second_last_trace = trace_data[finish_index - 1] if finish_index and finish_index > 0 else None

        if second_last_trace:
            orchestration = second_last_trace.get("orchestrationTrace", {})
            model_input = orchestration.get("modelInvocationInput", {})
            model_output = orchestration.get("modelInvocationOutput", {})
            text = model_output.get("rawResponse", {}).get("content", {})
            if "<answer>" in text:
                soup = BeautifulSoup(f"<root>{text}</root>", "xml")
                # print(soup)
                for part in soup.find_all("answer_part"):
                    answer_text = part.find("text").text.strip() if part.find("text") else ""
                    sources_tag = part.find("sources")
                    if sources_tag:
                        raw_sources = sources_tag.get_text(separator="\n").splitlines()
                        source_ids = [s.strip() for s in raw_sources if s.strip()]
                    else:
                        source_ids = []
                    enriched_sources = [{
                        "source_id": sid,
                        "full_quote": source_id_map.get(sid, ""),
                    } for sid in source_ids]
                    source_chunks.append({
                        "text": answer_text,
                        "sources": enriched_sources
                    })

        # Extract followups from model output
        for trace in trace_data:
            model_output = trace.get("orchestrationTrace", {})
            if model_output:
                raw_xml = model_output.get("modelInvocationOutput", {}).get("rawResponse", {}).get("content", {})
                if "<answer>" in raw_xml:
                    soup = BeautifulSoup(f"<root>{raw_xml}</root>", "xml")
                    # Extract followups
                    followups_tag = soup.find("followups")
                    if followups_tag:
                      follow_ups = [f.text.strip() for f in followups_tag.find_all("followup")]

        print(json.dumps(trace_data, default=str, indent=2))

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            "body": json.dumps({
                "query": query,
                "response": full_response,
                "source_chunks": source_chunks,
                "follow_ups": follow_ups,
            }, default=str)
        }
    
  

    except Exception as e:
        print(f"Error: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({'error': str(e)})
        }
