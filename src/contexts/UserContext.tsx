import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UserContextType {
  userId: string | null;
  userName: string | null; 
  setUserId: (id: string | null) => void;
  setUserName: (name: string | null) => void; 
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    const storedUserName = localStorage.getItem('user_name');
    if (storedUserId) {
      setUserId(storedUserId);
    }
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleSetUserId = (id: string | null) => {
    if (id) {
      localStorage.setItem('user_id', id);
    } else {
      localStorage.removeItem('user_id');
    }
    setUserId(id);
  };

  const handleSetUserName = (name: string | null) => {
    if (name) {
      localStorage.setItem('user_name', name);
    } else {
      localStorage.removeItem('user_name');
    }
    setUserName(name);
  };

  return (
    <UserContext.Provider value={{ userId, userName, setUserId: handleSetUserId, setUserName: handleSetUserName }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
