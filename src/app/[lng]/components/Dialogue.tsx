import { Button, Heading, Text, View } from '@aws-amplify/ui-react';
import Dialog from '@mui/material/Dialog';
import Link from 'next/link';
import styled from 'styled-components';

interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
}

const StyledButton = styled(Button)`
  width: 100%;
  border-radius: 0;
  background-color: var(--amplify-colors-red-60);
  &:hover {
    background-color: var(--amplify-colors-red-80);
  }
  &:focus {
    background-color: var(--amplify-colors-red-80);
  }
`;

const Dialogue = (props: SimpleDialogProps) => {
  const { onClose, open } = props;

  return (
    <Dialog onClose={onClose} open={open}>
      <View padding='large'>
        <Heading level={3}>Note</Heading>
        <Text>
          You can log into the chatbot with the following credentials:
        </Text>
        <Text>
          <strong>Email:</strong> chatbot@youthfulcities.com
        </Text>
        <Text marginBottom='large'>
          <strong>Password:</strong> demo
        </Text>
        <Link href='http://99.231.34.125:8551/' target='_blank'>
          <StyledButton variation='primary'>Go to Chatbot</StyledButton>
        </Link>
      </View>
    </Dialog>
  );
};

export default Dialogue;
