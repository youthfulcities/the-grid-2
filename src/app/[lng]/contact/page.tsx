"use client"

import { TextField, TextAreaField, Flex, Button, SelectField, Heading } from '@aws-amplify/ui-react';
import React, { useRef, FormEvent } from 'react';
import styled from 'styled-components';

const ContactForm = () => {


    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneNumberRef = useRef<HTMLInputElement>(null); 
    const topicRef = useRef<HTMLSelectElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();


        const formData = {
            firstName: firstNameRef.current?.value,
            lastName: lastNameRef.current?.value,
            email: emailRef.current?.value,
            phoneNumber: phoneNumberRef.current ? phoneNumberRef.current.value : '',
            topic: topicRef.current?.value,
            message: messageRef.current?.value
        };

        try {
            const response = await fetch('/api/sendEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Email sent successfully:', result);


                // Handle successful email sending (e.g., showing a success message)
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            // Handle errors (e.g., showing an error message)
        }

        (e.target as HTMLFormElement).reset();
    };


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

`;

    const StyledSelect = styled(SelectField)`
    margin-bottom: 16px; 
`;

    const StyledButton = styled(Button)`
    
    
  

`;

    const StyledHeading = styled(Heading)`
    margin-bottom: 24px;
 
`;


    return (
        <StyledForm as='form' onSubmit={handleSubmit}>
            <StyledHeading level={2}>
                Contact us
            </StyledHeading>
            <StyledInput label="First Name *" name="firstName" ref={firstNameRef} isRequired />
            <StyledInput label="Last Name *" name="lastName" ref={lastNameRef} isRequired />
            <StyledInput type="email" label="Email *" name="email" ref={emailRef} isRequired />
            <StyledInput label="Phone Number" name="phoneNumber" ref={phoneNumberRef} />

            <StyledSelect label="Reason for Contacting" name='topic' ref={topicRef} required>
                <option value="">Select a topic</option>
                <option value="Report a technical issue">Report a technical issue</option>
                <option value="Collaborate with us">Collaborate with us</option>
                <option value="Other inquiry">Other inquiry</option>
            </StyledSelect>

            <StyledTextArea label="Message *" name="message" ref={messageRef} isRequired />
            <StyledButton type="submit">Submit</StyledButton>
        </StyledForm>
    );
};

export default ContactForm;
