"use client";

import {
  Alert,
  Button,
  Flex,
  Heading,
  SelectField,
  TextAreaField,
  TextField,
  useTheme
} from "@aws-amplify/ui-react";
import React, { FormEvent, useState } from "react";
import styled from "styled-components";
import Container from "../components/Container";

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

const StyledHeading = styled(Heading)`
  margin-bottom: 16px;
`;

const SubHeading = styled(Heading)`
  font-size: 1.2em;
  margin-bottom: 24px;
  color: white;
`;

const NameFields = styled(Flex)`

  gap: 24px; 
`;

const HalfWidthInput = styled(StyledInput)`
  flex: 1;
`;

const StyledButton = styled(Button)`
    margin-bottom: 24px; 
    width: 100%; 
    background-color: var(--amplify-colors-red-60); 
  `;

const ContactForm = () => {
  

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    topic: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Email sent successfully:", result);
        setSuccess("Your message has been sent successfully!");

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          topic: "",
          message: "",
        });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (err) {
      console.error("Error sending email:", err);
      setError(
        "An error occurred while sending your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <StyledForm as="form" onSubmit={handleSubmit}>
        <StyledHeading level={2}>Contact us</StyledHeading>
        <SubHeading>
          Have any questions? Or are you interested in our work? Feel free to
          reach out to us!
        </SubHeading>
        {error && <Alert variation="error">{error}</Alert>}
        {success && <Alert variation="success">{success}</Alert>}
        <NameFields>
          <HalfWidthInput
            label="First Name *"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            isRequired
          />
          <HalfWidthInput
            label="Last Name *"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            isRequired
          />
        </NameFields>
        <StyledInput
          type="email"
          label="Email *"
          name="email"
          value={formData.email}
          onChange={handleChange}
          isRequired
        />
        <StyledInput
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <StyledSelect
          label="Reason for Contacting"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          required
        >
          <option value="">Select a topic</option>
          <option value="Report a technical issue">
            Report a technical issue
          </option>
          <option value="Collaborate with us">Collaborate with us</option>
          <option value="Other inquiry">Other inquiry</option>
        </StyledSelect>
        <StyledTextArea
          label="Message *"
          name="message"
          value={formData.message}
          onChange={handleChange}
          isRequired
        />
        <StyledButton type="submit" isLoading={loading}>
          Submit
        </StyledButton>
      </StyledForm>
    </Container>
  );
};

export default ContactForm;
