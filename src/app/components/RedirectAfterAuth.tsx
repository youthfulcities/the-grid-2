"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthenticator } from "@aws-amplify/ui-react";

const RedirectAfterAuth = () => {
  const router = useRouter();
  const { user } = useAuthenticator();

  useEffect(() => {
    // Check if there is a user object, which indicates a successful login
    if (user) {
      // Retrieve the redirect URL from session storage or set a default
      const redirectUrl = sessionStorage.getItem("postLoginRedirect") || "/";
      sessionStorage.removeItem("postLoginRedirect"); // Clear the stored URL
      router.push(redirectUrl); // Redirect to the intended URL or home
    }
  }, [user, router]);

  return null;
};

export default RedirectAfterAuth;