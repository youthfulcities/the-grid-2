import { Button } from '@aws-amplify/ui-react';

const DataCard = ({ fetchUrl, url, title }) => (
  <Button
    className='card soft-shadow hvr-float hvr-push'
    style={{
      paddingInlineStart: 0,
      paddingInlineEnd: 0,
      paddingBlockEnd: 0,
      paddingBlockStart: 0,
      position: 'relative',
    }}
    onClick={() => fetchUrl(url)}
  >
    <div
      className='card-img clip image-card-topics'
      style={{ position: 'absolute', top: 0 }}
    />
    <h4 className='card-text-bottom-corner'>{title}</h4>
  </Button>
);

export default DataCard;
