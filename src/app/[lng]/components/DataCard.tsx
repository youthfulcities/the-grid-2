import {
  Button,
  Card,
  Flex,
  Heading,
  Text,
  useTheme,
} from '@aws-amplify/ui-react';
import { FaFileArrowDown } from 'react-icons/fa6';

import datasetCards from '@/data/dataset-cards.json';
import { v4 as uuidv4 } from 'uuid';

interface AppProps {
  fetchUrl: (url: string) => Promise<{ url: URL; expiresAt: Date } | null>;
}

const DataCard = ({ fetchUrl }: AppProps) => {
  const { tokens } = useTheme();

  const download = async (file: string) => {
    try {
      const getUrlResult: { url: URL; expiresAt: Date } | null =
        await fetchUrl(file);
      window.open(getUrlResult?.url.href);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return datasetCards.datasetCards.map((card) => (
    <Card
      key={uuidv4()}
      minHeight={300}
      variation='elevated'
      style={{ position: 'relative' }}
      display='flex'
    >
      <div
        className={`card-img clip ${card.className}`}
        style={{
          position: 'absolute',
          top: '-1px',
          transform: `translateX(-${tokens.space.large.value})`,
        }}
      />
      <Flex direction='column' paddingTop={150}>
        <Heading level={3} fontSize='xl' color='brand.secondary.60'>
          {card.title}
        </Heading>
        <Text
          fontWeight='bold'
          color='brand.secondary.60'
          fontSize='medium'
          marginTop='auto'
        >
          {card.date}
        </Text>
        <Text fontSize='small' marginTop='auto'>
          {card.description}
        </Text>
        <Flex grow={1}>
          <Button
            variation='primary'
            width='57px'
            height='57px'
            justifyContent='center'
            alignItems='center'
            position='relative'
            boxShadow='0px 2px 2px rgba(0, 0, 0, 0.10000000149011612)'
            borderRadius='35px'
            padding='8px 16px 8px 16px'
            backgroundColor='brand.secondary.60'
            marginTop='auto'
            onClick={() => download(card.file)}
            color='brand.primary.60'
          >
            <FaFileArrowDown size='1.5em' />
          </Button>
        </Flex>
      </Flex>
    </Card>
  ));
};

export default DataCard;
