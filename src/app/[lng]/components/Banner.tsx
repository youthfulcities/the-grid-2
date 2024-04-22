import cityCards from '@/data/city-cards.json';
import { Flex } from '@aws-amplify/ui-react';

const Banner = () => (
  <section className='highlight-bar soft-shadow'>
    <Flex className='short-container' justifyContent='space-between'>
      <div className='fact'>
        <div>
          <h4 className='light-heading'>Datasets</h4>
          <h3 className='outline-text'>11</h3>
        </div>
      </div>
      <div className='fact'>
        <div>
          <h4 className='light-heading'>Cities</h4>
          <h3 className='outline-text'>{cityCards.cityCards.length}</h3>
        </div>
      </div>
      <div className='fact'>
        <div>
          <h4 className='light-heading'>Records</h4>
          <h3 className='outline-text'>454k</h3>
        </div>
      </div>
    </Flex>
  </section>
);

export default Banner;
