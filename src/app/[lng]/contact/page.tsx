'use client';

import {
  Alert,
  Button,
  Flex,
  Heading,
  SelectField,
  TextAreaField,
  TextField,
  View,
} from '@aws-amplify/ui-react';

import useTranslation from '@/app/i18n/client';
import { generateClient } from 'aws-amplify/api';
import { useParams } from 'next/navigation';
import React, { FormEvent, useState } from 'react';
import styled from 'styled-components';
import { createContactSubmission } from '../../../graphql/mutations';
import Container from '../../components/Background';

const StyledForm = styled(Flex)`
  margin: 0 auto;
  flex-direction: column;
`;

const StyledInput = styled(TextField)`
  border: none;
  margin-bottom: 24px;
  label {
    color: white;
  }
  input {
    background-color: white;
    border-color: transparent;
  }
`;

const StyledTextArea = styled(TextAreaField)`
  margin-bottom: 24px;
  label {
    color: white;
  }
  textarea {
    background-color: white;
    border-color: transparent;
  }
`;

const StyledSelect = styled(SelectField)`
  margin-bottom: 24px;
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

const SubHeading = styled(Heading)`
  font-size: 1.2em;
  margin-bottom: 24px;
  color: white;
`;

const StyledButton = styled(Button)`
  border-color: transparent;
  margin-bottom: 24px;
  width: 100%;
  background-color: var(--amplify-colors-red-60);
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'contact');

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

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
          },
        },
      });

      console.log(result);

      if (result) {
        console.log('Email sent successfully:', result);
        setSuccess(t('success'));

        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          topic: '',
          message: '',
        });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (err) {
      console.error('Error sending email:', err);
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <View as='section' className='container section-padding'>
        <StyledForm as='form' onSubmit={handleSubmit}>
          <Heading marginBottom='16px' level={2}>
            {t('title')}
          </Heading>
          <SubHeading>{t('subtitle')}</SubHeading>
          {error && <Alert variation='error'>{error}</Alert>}
          {success && <Alert variation='success'>{success}</Alert>}
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
          <StyledButton type='submit' isLoading={loading}>
            {t('submit')}
          </StyledButton>
        </StyledForm>
      </View>
    </Container>
  );
};

export default ContactForm;
