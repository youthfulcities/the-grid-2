'use client';

import {
  Alert,
  Button,
  Flex,
  Heading,
  SelectField,
  TextAreaField,
  TextField,
} from '@aws-amplify/ui-react';

import { generateClient } from 'aws-amplify/api';
import React, { FormEvent, useState } from 'react';
import styled from 'styled-components';
import { createContactSubmission } from '../../../graphql/mutations';
import Container from '../components/Background';

const StyledForm = styled(Flex)`
  max-width: 80%;
  margin: 0 auto;
  padding: 150px;
  flex-direction: column;
`;

const StyledInput = styled(TextField)`
  margin-bottom: 24px;
  label {
    color: white;
  }
  input {
    background-color: white;
  }
`;

const StyledTextArea = styled(TextAreaField)`
  margin-bottom: 24px;
  label {
    color: white;
  }
  textarea {
    background-color: white;
  }
`;

const StyledSelect = styled(SelectField)`
  margin-bottom: 24px;
  label {
    color: white;
  }
  select {
    background-color: white;
  }
`;

const SubHeading = styled(Heading)`
  font-size: 1.2em;
  margin-bottom: 24px;
  color: white;
`;

const StyledButton = styled(Button)`
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
        setSuccess('Your message has been sent successfully!');

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
      setError(
        'An error occurred while sending your message. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <StyledForm as='form' onSubmit={handleSubmit}>
        <Heading marginBottom='16px' level={2}>
          Contact us
        </Heading>
        <SubHeading>
          Have any questions? Or are you interested in our work? Feel free to
          reach out to us!
        </SubHeading>
        {error && <Alert variation='error'>{error}</Alert>}
        {success && <Alert variation='success'>{success}</Alert>}
        <Flex gap='24px'>
          <StyledInput
            flex={1}
            label='First Name *'
            name='firstName'
            value={formData.firstName}
            onChange={handleChange}
            isRequired
          />
          <StyledInput
            flex={1}
            label='Last Name *'
            name='lastName'
            value={formData.lastName}
            onChange={handleChange}
            isRequired
          />
        </Flex>
        <StyledInput
          type='email'
          label='Email *'
          name='email'
          value={formData.email}
          onChange={handleChange}
          isRequired
        />
        <StyledInput
          label='Phone Number'
          name='phoneNumber'
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <StyledSelect
          label='Reason for Contacting'
          name='topic'
          value={formData.topic}
          onChange={handleChange}
          required
        >
          <option value=''>Select a topic</option>
          <option value='Report a technical issue'>
            Report a technical issue
          </option>
          <option value='Collaborate with us'>Collaborate with us</option>
          <option value='Other inquiry'>Other inquiry</option>
        </StyledSelect>
        <StyledTextArea
          label='Message *'
          name='message'
          value={formData.message}
          onChange={handleChange}
          isRequired
        />
        <StyledButton type='submit' isLoading={loading}>
          Submit
        </StyledButton>
      </StyledForm>
    </Container>
  );
};

export default ContactForm;
