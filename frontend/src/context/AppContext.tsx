// frontend/src/context/AppContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '../../../shared/types';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  notification: { message: string; type: 'success' | 'error' | 'info' | 'warning' } | null;
  showNotification: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  hideNotification: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('PUBLIC');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null>(null);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info'
  ) => {
    setNotification({ message, type });
  };

  const hideNotification = () => setNotification(null);

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        notification,
        showNotification,
        hideNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
