"use client";

import { Flex, Heading, View } from "@aws-amplify/ui-react";
import InsightCard from "../components/InsightCards";
import styled from "styled-components";


const StyledFlex = styled(Flex)`
  
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: small;
  gap: 60px;
`;

const Insights: React.FC = () => {
  return (
    <View
      as="section"
      className='container section-padding'
    >
      <Heading level={2} style={{color: "#F26B5F"}}>insights</Heading>

      <StyledFlex>
        <InsightCard
          title="A Day in the Life"
          dataset="Real Affordability Index"
          href="/"
          date={2022}
          description="Using data from our 2022 Real Affordability Index, we crafted a story of what it is like to live as youth, trying to thrive financially in Canada."
          color="#B8D98C"
        />
        <InsightCard
          title="Best Work City"
          dataset="Urban Work Index"
          href="/"
          date={2023}
          description="Curious where your best work city is based on your needs? Try out our Best Work City Quiz!"
          color="#F6D8D5"
        />
      </StyledFlex>
    </View>
  );
};

export default Insights;
