"use client";

import {
  TextField,
  TextAreaField,
  Flex,
  Button,
  SelectField,
  Heading,
  Alert,
} from "@aws-amplify/ui-react";
import React, { useState, FormEvent } from "react";
import styled from "styled-components";

const StyledForm = styled(Flex)`
  max-width: 40%;
  margin: 0 auto;
  padding: 20px;
  flex-direction: column;
`;

const StyledInput = styled(TextField)`
  margin-bottom: 16px;
`;

const StyledTextArea = styled(TextAreaField)`
  margin-bottom: 16px;
`;

const StyledSelect = styled(SelectField)`
  margin-bottom: 16px;
`;

const StyledButton = styled(Button)`
  margin-bottom: 16px;
`;

const StyledHeading = styled(Heading)`
  margin-bottom: 24px;
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
      setError("An error occurred while sending your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledForm as="form" onSubmit={handleSubmit}>
      <StyledHeading level={2}>Contact us</StyledHeading>
      {error && <Alert variation="error">{error}</Alert>}
      {success && <Alert variation="success">{success}</Alert>}
      <StyledInput
        label="First Name *"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        isRequired
      />
      <StyledInput
        label="Last Name *"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        isRequired
      />
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
  );
};

export default ContactForm;
