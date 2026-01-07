import { CollectionItem } from './collection';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // Note: Client-side only, plain text (as per original)
  createdAt: string;
  collection: CollectionItem[];
}

export interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}
