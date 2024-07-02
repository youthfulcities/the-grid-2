'use client';

import useTranslation from '@/app/i18n/client';
import {
  Alert,
  Button,
  CheckboxField,
  Flex,
  Heading,
  SelectField,
  Text,
  TextAreaField,
  TextField,
  View,
  useTheme,
} from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { FormEvent, useEffect, useState } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';
import styled from 'styled-components';
import { createContactSubmission } from '../../../graphql/mutations';
import Container from '../../components/Background';

const StyledForm = styled(Flex)`
  margin: 0 auto;
  flex-direction: column;
`;

const StyledInput = styled(TextField)`
  border: none;
  margin-bottom: var(--amplify-space-large);
  label {
    color: white;
  }
  input {
    background-color: white;
    border-color: transparent;
  }
`;

const StyledTextArea = styled(TextAreaField)`
  margin-bottom: var(--amplify-space-large);
  label {
    color: white;
  }
  textarea {
    background-color: white;
    border-color: transparent;
  }
`;

const StyledSelect = styled(SelectField)`
  margin-bottom: var(--amplify-space-large);
  label {
    color: white;
  }
  select {
    background-color: white;
    border-color: transparent;
  }

  option {
    background-color: white;
  }
`;

const SubHeading = styled(Text)`
  margin-bottom: var(--amplify-space-xl);
  color: white;
`;

const StyledButton = styled(Button)`
  border-color: transparent;
  margin-bottom: var(--amplify-space-small);
  width: 100%;
  background-color: var(--amplify-colors-red-60);
`;

const StyledCheckbox = styled(CheckboxField)`
  color: var(--amplify-colors-font-inverse);
  margin-bottom: var(--amplify-space-large);
  .amplify-flex {
    align-items: center;
  }
  .amplify-text {
    margin: 0;
  }
`;

const client = generateClient();

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    topic: '',
    message: '',
  });

  const [statusCodeSubscribe, setStatusCodeSubscribe] = useState<number>();
  const [statusSubscribe, setStatusSubscribe] = useState<
    'success' | 'error' | 'loading' | 'idle'
  >('idle');
  const [responseMsgSubscribe, setResponseMsgSubscribe] = useState<string>('');
  const [subscribe, setSubscribe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'contact');
  const { t: tsubscribe } = useTranslation(lng, 'newsletter');
  const { tokens } = useTheme();

  const { firstName, lastName, email, phoneNumber, topic, message } = formData;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubscribe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubscribe(e.target.checked);
  };

  useEffect(() => {
    // automatically clear alert
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
      setResponseMsgSubscribe('');
      setStatusSubscribe('idle');
    }, 6000);

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [error, success, responseMsgSubscribe]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await client.graphql({
        query: createContactSubmission,
        variables: {
          input: {
            firstName,
            lastName,
            email,
            phoneNumber,
            topic,
            message,
            subscribed: subscribe,
          },
        },
      });

      if (result) {
        console.log('Email sent successfully:', result);
        setSuccess(t('success'));
      } else {
        throw new Error('Failed to send email');
      }
    } catch (err) {
      console.error('Error sending email:', err);
      setError(t('error'));
    } finally {
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        topic: '',
        message: '',
      });

      setSubscribe(false);
      setLoading(false);
    }

    if (subscribe === true) {
      try {
        setStatusSubscribe('loading');
        const response = await axios.post('/api/newsletter', {
          fname: firstName,
          lname: lastName,
          phone: phoneNumber,
          email,
          lng,
        });
        setStatusSubscribe('success');
        setStatusCodeSubscribe(response.status);
        setResponseMsgSubscribe(response.data.message);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setStatusSubscribe('error');
          setStatusCodeSubscribe(err.response?.status);
          setResponseMsgSubscribe(err.response?.data.error);
        }
      }
    }
  };

  // Determine if all required fields are filled
  const isFormValid =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    email.trim() !== '' &&
    topic.trim() !== '' &&
    message.trim() !== '';

  return (
    <Container>
      <View as='section' className='container section-padding'>
        <StyledForm as='form' onSubmit={handleSubmit}>
          <Heading marginBottom={tokens.space.medium.value} level={2}>
            {t('title')}
          </Heading>
          <SubHeading>
            <Trans
              t={t}
              i18nKey='subtitle'
              components={{
                a: <a href='https://www.youthfulcities.com/about-us/' />,
              }}
            />
          </SubHeading>
          {error.length > 0 && statusSubscribe !== 'loading' && (
            <Alert marginBottom={tokens.space.medium.value} variation='error'>
              {error} {tsubscribe(responseMsgSubscribe)}
            </Alert>
          )}
          {success.length > 0 && statusSubscribe !== 'loading' && (
            <Alert marginBottom={tokens.space.medium.value} variation='success'>
              {success} {tsubscribe(responseMsgSubscribe)}
            </Alert>
          )}
          <Flex gap='24px'>
            <StyledInput
              flex={1}
              label={t('fname')}
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
              isRequired
            />
            <StyledInput
              flex={1}
              label={t('lname')}
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
              isRequired
            />
          </Flex>
          <StyledInput
            type='email'
            label={t('email')}
            name='email'
            value={formData.email}
            onChange={handleChange}
            isRequired
          />
          <StyledCheckbox
            label={t('subscribe')}
            name='subscribe'
            value='true'
            size='large'
            onChange={handleSubscribe}
            checked={subscribe}
          />
          <StyledInput
            label={t('phone')}
            name='phoneNumber'
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <StyledSelect
            label={t('reason')}
            name='topic'
            value={formData.topic}
            onChange={handleChange}
            required
          >
            <option value=''>{t('select')}</option>
            <option value='Report a technical issue'>{t('technical')}</option>
            <option value='Collaborate with us'>{t('collaborate')}</option>
            <option value='Other inquiry'>{t('other')}</option>
          </StyledSelect>
          <StyledTextArea
            label={t('message')}
            placeholder={t('type')}
            name='message'
            value={formData.message}
            onChange={handleChange}
            isRequired
          />
          <StyledButton
            type='submit'
            isLoading={loading}
            disabled={!isFormValid}
          >
            {t('submit')}
          </StyledButton>
        </StyledForm>
      </View>
    </Container>
  );
};

export default ContactForm;
