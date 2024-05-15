import { createContext } from 'react';

interface UserContextType {
  userId: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default UserContext;