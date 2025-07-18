// app/LayoutWrapper.tsx
'use client';

import { useLayout } from './context/LayoutContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Model from './components/model';
export default function LayoutWrapper({ children }) {
  const { isSidebarClosed, deleteModelOpen, setDeleteModelOpen, deleteChatId ,setDeleteChatId} = useLayout();


  const handleDeleteChat = async (chatId) => {
    try {
      const response = await fetch('/api/delete-chat', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete chat');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    } finally {
      setDeleteModelOpen(false);
      setDeleteChatId(null);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh]  ">
  <main className="flex flex-1">
   {deleteModelOpen && <Model  onClose={() => setDeleteModelOpen(false)} onDelete={() => handleDeleteChat(deleteChatId)} />}
    <div
      className={`${
        isSidebarClosed ? '-translate-x-full' : 'translate-x-0'
      } bg-[#181818] h-screen md:w-[260px] fixed top-0 left-0 transform transition-transform duration-300 ease-in-out z-10`}
    >
      <Sidebar />
    </div>
    <div
      className={`flex-1 bg-[#212121] h-screen overflow-y-auto transition-all duration-300 ease-in-out ${
        isSidebarClosed ? 'ml-0' : 'md:ml-[260px]'
      }`}
    >
      <Header />
      {children}
    </div>
  </main>
</div>

  );
}
