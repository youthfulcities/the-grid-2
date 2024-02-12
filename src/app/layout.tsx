import { Amplify } from 'aws-amplify';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from 'react';
import config from '../amplifyconfiguration.json';
import "./globals.css";


Amplify.configure(config, {
  Storage: {
    S3: {
      prefixResolver: async ({ accessLevel, targetIdentityId }) => {
        if (accessLevel === 'guest') {
          return 'public/';
        } else if (accessLevel === 'protected') {
          return `protected/${targetIdentityId}/`;
        } else {
          return `private/${targetIdentityId}/`;
        }
      }
    }
  }
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "THE GRID",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
