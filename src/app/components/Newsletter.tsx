'use client';

import { Alert, Button, Flex, Loader, TextField } from '@aws-amplify/ui-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useTranslation from '../i18n/client';

interface NewsletterProps {
  lng: string;
}

const StyledAlert = styled(Alert)`
  max-width: 351.56px;
`;

const StyledTextField = styled(TextField)`
  z-index: 1;
  min-width: 200px;
  max-width: 100%;
  flex-grow: 2;
  background-color: white;
  input {
    border-color: transparent;
  }
`;

const Newsletter: React.FC<NewsletterProps> = ({ lng }) => {
  const [formEmail, setEmail] = useState('');
  const [status, setStatus] = useState<
    'success' | 'error' | 'loading' | 'idle'
  >('idle');
  const [responseMsg, setResponseMsg] = useState<string>('');

  const { t } = useTranslation(lng, 'newsletter');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async () => {
    setStatus('loading');
    try {
      const response = await axios.post('/api/newsletter', {
        email: formEmail,
        lng,
      });
      setStatus('success');
      setEmail('');
      setResponseMsg(response.data.message);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setStatus('error');
        setResponseMsg(err.response?.data.error);
      }
    }
  };

  useEffect(() => {
    if (status !== 'idle' && status !== 'loading') {
      setTimeout(() => setStatus('idle'), 8000);
    }
  }, [status]);

  return (
    <Flex direction='column' wrap='wrap' gap='xs'>
      <Flex direction='row' alignContent='stretch' gap='xs'>
        <StyledTextField
          label={t('newsletter-email')}
          labelHidden
          value={formEmail}
          onChange={(e) => handleEmailChange(e)}
          placeholder={t('email')}
          disabled={status === 'loading'}
        />
        <Button
          colorTheme='error'
          variation='primary'
          onClick={handleSubmit}
          disabled={status === 'loading'}
        >
          {t('subscribe')}
        </Button>
      </Flex>
      {status === 'loading' && <Loader />}
      {status !== 'idle' && status !== 'loading' && (
        <StyledAlert
          isDismissible
          variation={status === 'success' ? 'success' : 'error'}
        >
          {t(responseMsg)}
        </StyledAlert>
      )}
    </Flex>
  );
};

export default Newsletter;
