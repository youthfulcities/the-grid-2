"use client";

import {
  View,
  Authenticator
} from "@aws-amplify/ui-react";

import Container from "../../components/Background";
import RedirectAfterAuth from "@/app/components/RedirectAfterAuth";
import "../global.css"

const authenticator = () => {
  return (
      <Container>
        <View as="section" className="container section-padding authenticator-container">
          <Authenticator>
            {({ signOut }) => <button onClick={signOut}>Sign out</button>}
          </Authenticator>
          <RedirectAfterAuth />{" "}
          {/* This will handle the redirect after login */}
        </View>
      </Container>
  );
};

export default authenticator;
