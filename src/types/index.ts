export type UserRole = 'owner' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  // Add other user properties as needed
}
