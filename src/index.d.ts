// This file contains type declarations for modules that don't have their own type definitions
declare module '*.js';
declare module '*.jsx';

// Add type declarations for CSS modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Declare types for environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    VITE_API_BASE_URL: string;
  }
}

// Global type declarations
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
