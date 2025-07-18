// app/context/LayoutContext.tsx
'use client';

import { createContext, useContext, useState } from 'react';


const LayoutContext = createContext(null);

export const LayoutProvider = ({ children }) => {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
   const [isSidebarClosed, setIsSidebarClosed] = useState(false); 
   const [deleteModelOpen, setDeleteModelOpen] = useState(false);
    const [deleteChatId, setDeleteChatId] = useState(null);
   
   
  return (
    <LayoutContext.Provider value={{ isSidebarOpen, isSidebarClosed, setIsSidebarOpen, setIsSidebarClosed, deleteModelOpen, setDeleteModelOpen, deleteChatId, setDeleteChatId }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error('useLayout must be used inside LayoutProvider');
  return context;
};
