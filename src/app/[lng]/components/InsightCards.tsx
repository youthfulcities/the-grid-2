import { Button, Card, Heading, Text } from "@aws-amplify/ui-react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";



interface InsightCardProps {
  title: string;
  dataset: string;
  href: string;
  date: number;
  description: string;
  color: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, href, dataset, date, description, color }) => {
  return (

    
      
      <Card 
        variation="elevated"
        style={{ 
          backgroundColor: color,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '231px', 
          height: '255px',
          position: 'relative',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',          
        }}
      >



        <Heading level={6} style={{color: "#253E88"}}>{title}</Heading>
        <Text style={{color: "#253E88", fontSize: "12.82px", fontFamily: "Gotham Narrow Medium", fontStyle: "italic", fontWeight: "325", lineHeight: "16px"}}>{dataset}</Text>
        <Text style={{color: "#253E88", fontSize: "12.82px", fontFamily: "Gotham Narrow Medium", fontWeight: "325", lineHeight: "16px", paddingTop: "5px"}}>{date}</Text>
        <Text style={{color: "#201F1E", fontSize: "10.26px", fontFamily: "Gotham Narrow Medium", fontWeight: "325", lineHeight: "15px", paddingTop: "5px"}}>{description}</Text>
        <Link href={href} passHref>
        <Button 
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            backgroundColor: '#253E88',
            border: 'none',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
          }}
        >
          <FiArrowRight size={20} />
        </Button>
      </Link>
        
      </Card>
    
  );
};


export default InsightCard;
