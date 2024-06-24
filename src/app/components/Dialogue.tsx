import { Button, Heading, Text, View } from '@aws-amplify/ui-react';
import Dialog from '@mui/material/Dialog';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Trans } from 'react-i18next/TransWithoutContext';
import styled from 'styled-components';
import useTranslation from '../i18n/client';

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
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'insights');

  return (
    <Dialog onClose={onClose} open={open}>
      <View padding='large'>
        <Heading level={3}>{t('note')}</Heading>
        <Text>{t('disclaimer')}</Text>
        <Text>{t('login')}</Text>
        <Text>
          <Trans t={t} i18nKey='email' components={{ strong: <strong /> }} />
        </Text>
        <Text marginBottom='large'>
          <Trans t={t} i18nKey='password' components={{ strong: <strong /> }} />
        </Text>
        <Link href='http://99.231.34.125:8551/' target='_blank'>
          <StyledButton variation='primary'>{t('goto')}</StyledButton>
        </Link>
      </View>
    </Dialog>
  );
};

export default Dialogue;
