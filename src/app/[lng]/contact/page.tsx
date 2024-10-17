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
import { z } from 'zod';
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

  &:disabled {
    background-color: var(--amplify-colors-neutral-60);
    color: var(--amplify-colors-neutral-90);
    cursor: not-allowed;
  }
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

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  topic: string;
  message: string;
}

const client = generateClient();

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    topic: '',
    message: '',
  });

  const [statusSubscribe, setStatusSubscribe] = useState<
    'success' | 'error' | 'loading' | 'idle'
  >('idle');
  const [responseMsgSubscribe, setResponseMsgSubscribe] = useState<string>('');
  const [subscribe, setSubscribe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    topic: '',
    message: '',
  });

  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'contact');
  const { t: tsubscribe } = useTranslation(lng, 'newsletter');
  const { tokens } = useTheme();

  const { firstName, lastName, email, phoneNumber, topic, message } = formData;
  const phoneRegex =
    /^(|([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])*)$/;

  const schema = z.object({
    firstName: z.string().min(1, t('fname_required')),
    lastName: z.string().min(1, t('lname_required')),
    email: z.string().email({ message: t('email_invalid') }),
    phoneNumber: z
      .string()
      .max(10, t('phone_long'))
      .regex(phoneRegex, t('phone_invalid'))
      .optional(),
    topic: z.string().min(1, t('topic_required')),
    message: z.string().min(1, t('message_required')),
  });

  const validate = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    // Validate the field using zod.safeParse for that specific field
    const fieldSchema = schema.pick({ [name]: true } as any);
    const validation = fieldSchema.safeParse({ [name]: value });

    // Update form errors for the specific field
    if (!validation.success) {
      const fieldErrors = validation.error.errors.reduce<
        Record<string, string>
      >(
        (acc, curr) => ({
          ...acc,
          [curr.path[0]]: curr.message,
        }),
        {}
      );

      // Update form errors state
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        ...fieldErrors,
      }));
    } else {
      // Clear errors for this field
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    validate(e);

    // Update form data
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
        setResponseMsgSubscribe(response.data.message);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setStatusSubscribe('error');
          setResponseMsgSubscribe(err.response?.data.error);
        }
      }
    }
  };
  const validation = schema.safeParse(formData);
  const isFormValid = validation.success;

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
              onFocus={(e) => validate(e)}
              isRequired
              hasError={!!formErrors.firstName}
              errorMessage={formErrors.firstName}
            />
            <StyledInput
              flex={1}
              label={t('lname')}
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
              onFocus={(e) => validate(e)}
              isRequired
              hasError={!!formErrors.lastName}
              errorMessage={formErrors.lastName}
            />
          </Flex>
          <StyledInput
            type='email'
            label={t('email')}
            name='email'
            value={formData.email}
            onChange={handleChange}
            onFocus={(e) => validate(e)}
            isRequired
            hasError={!!formErrors.email}
            errorMessage={formErrors.email}
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
            onFocus={(e) => validate(e)}
            hasError={!!formErrors.phoneNumber}
            errorMessage={formErrors.phoneNumber}
          />
          <StyledSelect
            label={t('reason')}
            name='topic'
            value={formData.topic}
            onChange={handleChange}
            onFocus={(e) => validate(e)}
            required
            hasError={!!formErrors.topic}
            errorMessage={formErrors.topic}
          >
            <option value=''>{t('select')}</option>
            <option value='Report a technical issue'>{t('technical')}</option>
            <option value='Collaborate with us'>{t('collaborate')}</option>
            <option value='Request more data'>{t('data')}</option>
            <option value='Other inquiry'>{t('other')}</option>
          </StyledSelect>
          <StyledTextArea
            label={t('message')}
            placeholder={t('type')}
            name='message'
            value={formData.message}
            onChange={handleChange}
            onFocus={(e) => validate(e)}
            isRequired
            hasError={!!formErrors.message}
            errorMessage={formErrors.message}
          />
          <StyledButton
            type='submit'
            isLoading={loading}
            disabled={!isFormValid || loading}
          >
            {t('submit')}
          </StyledButton>
        </StyledForm>
      </View>
    </Container>
  );
};

export default ContactForm;
