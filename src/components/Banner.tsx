import { Flex, View, Text } from '@aws-amplify/ui-react';
import cityCards from '../data/city-cards.json';

const Banner = () => (
  <View className="highlight-bar soft-shadow" as="section">
    <Flex
      className="short-container"
      justifyContent="space-between"
      alignItems="center"
      direction="row"
      wrap="nowrap"
      gap="1rem"
    >
      <View className="fact">
        <Text as="h4" className="light-heading">Datasets</Text>
        <Text as="h3" className="outline-text">11</Text>
      </View>
      <View className="fact">
        <Text as="h4" className="light-heading">Cities</Text>
        <Text as="h3" className="outline-text">{cityCards.cityCards.length}</Text>
      </View>
      <View className="fact">
        <Text as="h4" className="light-heading">Records</Text>
        <Text as="h3" className="outline-text">454k</Text>
      </View>
    </Flex>
  </View>
);

export default Banner;

