// app/LayoutWrapper.tsx
'use client';

import { useLayout } from './context/LayoutContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
export default function LayoutWrapper({ children }) {
  const { isSidebarClosed } = useLayout();

  return (
    <div className="flex flex-col h-[100dvh]  ">
  <main className="flex flex-1">
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
