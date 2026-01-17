import { ReactNode } from 'react';

declare const ProtectedRoute: (props: {
  children: ReactNode;
  roles?: string | string[];
}) => JSX.Element;

export default ProtectedRoute;
