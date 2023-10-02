/// <reference types="react-scripts" />

declare namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
      // Add more environment variables if needed
    }
  }
  