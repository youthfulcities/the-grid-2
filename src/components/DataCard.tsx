import MyIcon from '@/ui-components/MyIcon';
import {
  Button,
  Card,
  Flex,
  Heading,
  Text,
  useTheme,
} from '@aws-amplify/ui-react';

interface AppProps {
  fetchUrl: (url: string) => void;
  url: string;
  title: string;
}

const DataCard = ({ fetchUrl, url, title }: AppProps) => {
  const { tokens } = useTheme();

  return (
    <Card minHeight={300} variation='elevated' style={{ position: 'relative' }}>
      <div
        className='card-img clip image-card-topics'
        style={{
          position: 'absolute',
          top: '-1px',
          transform: `translateX(-${tokens.space.large.value})`,
        }}
      />
      <Flex direction='column' paddingTop={150}>
        <Heading level={3} color='brand.secondary.60'>
          {title}
        </Heading>
        <Text fontWeight='bold' color='brand.secondary.60'>
          2023
        </Text>
        <Text>This is a description</Text>
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
          onClick={() => fetchUrl(url)}
        >
          <MyIcon type='table' />
        </Button>
      </Flex>
    </Card>
  );
};

export default DataCard;
