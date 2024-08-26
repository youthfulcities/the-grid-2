"use client";

import {
  useTheme,
  View,
  Text,
  Authenticator,
  useAuthenticator,
  Heading,
  Button,
} from "@aws-amplify/ui-react";
import Container from "../../components/Background";
import RedirectAfterAuth from "@/app/components/RedirectAfterAuth";

const authenticator = () => {


  

  return (
    <Authenticator.Provider>
      <Container>
        <View as="section" className="container section-padding">
          <Authenticator>
            {({ signOut }) => <button onClick={signOut}>Sign out</button>}
          </Authenticator>
          <RedirectAfterAuth />{" "}
          {/* This will handle the redirect after login */}
        </View>
      </Container>
    </Authenticator.Provider>
  );
};

export default authenticator;