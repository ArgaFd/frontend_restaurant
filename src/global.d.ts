// Global type definitions for the application

// Add type support for CSS modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Add type support for image imports
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// Extend the Window interface to include any global variables
declare global {
  interface Window {
    // Add any global variables here if needed
  }
}

// This file is a module
{}
