'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { BiCircleQuarter, BiHelpCircle, BiStoreAlt, BiUserCircle, BiWorld } from 'react-icons/bi'
import { FiEdit, FiSettings } from 'react-icons/fi'
import { GoCircleSlash, GoKebabHorizontal, GoShare } from 'react-icons/go'
import {  HiMenuAlt2, HiSparkles } from 'react-icons/hi'
import { LuLogOut } from 'react-icons/lu'
import { MdOutlineDelete } from 'react-icons/md'
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useLayout } from '../context/LayoutContext';
import { set } from 'mongoose'

function Header() {
  const [moreDetailsOpen, setMoreDetailsOpen] = useState(false);
  const [profileModelOpen, setProfileModelOpen] = useState(false);
  const { signOut } = useClerk();
  const { user } = useUser();
  const moreButtonRef = useRef(null);
  const profileRef = useRef(null);
  const modalRef = useRef(null);
 const router = useRouter();
  const [modalMoreDetailsPosition, setModalMoreDetailsPosition] = useState({ top: 0, left: 0 });
  const [modalProfilePosition, setModalProfilePosition] = useState({ top: 0, left: 0 });
  const { isSidebarOpen, isSidebarClosed,setIsSidebarOpen,setIsSidebarClosed } = useLayout();



  

  const toggleModal = useCallback((event, setOpen, setPosition, offsetX) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX + offsetX,
    });
    setOpen((prev) => !prev);
  }, []);

  const handleMoreButtonClick = (event) => {
    setProfileModelOpen(false);
    toggleModal(event, setMoreDetailsOpen, setModalMoreDetailsPosition, -364);
  };

  const handleProfileButtonClick = (event) => {
    setMoreDetailsOpen(false);
    toggleModal(event, setProfileModelOpen, setModalProfilePosition, -496);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {

      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setMoreDetailsOpen(false);
        setProfileModelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const redirect =()=>{
    router.push('/')
    setProfileModelOpen(false);
  }


  

  return (
   <div
     className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}

   >
     <div className=" bg-[#212121]  text-white px-5 py-1   flex justify-between  items-center">
      <div className='md:hidden flex items-center' >
        <button
          onClick={()=> setIsSidebarOpen(!isSidebarOpen)}
          className="  text-white text-2xl"
        >
          <HiMenuAlt2 />
        </button>
      </div>
      <div className='flex gap-3' >
         {isSidebarClosed && 
          <div className="flex justify-center items-center hover:bg-[#2f2f2f] cursor-pointer p-2 rounded-lg text-sm text-gray-200 hover:bg-[#444444]" 
        onClick={()=> setIsSidebarClosed(!isSidebarClosed) }
        >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" data-rtl-flip="" className="icon max-md:hidden"><path d="M6.83496 3.99992C6.38353 4.00411 6.01421 4.0122 5.69824 4.03801C5.31232 4.06954 5.03904 4.12266 4.82227 4.20012L4.62207 4.28606C4.18264 4.50996 3.81498 4.85035 3.55859 5.26848L3.45605 5.45207C3.33013 5.69922 3.25006 6.01354 3.20801 6.52824C3.16533 7.05065 3.16504 7.71885 3.16504 8.66301V11.3271C3.16504 12.2712 3.16533 12.9394 3.20801 13.4618C3.25006 13.9766 3.33013 14.2909 3.45605 14.538L3.55859 14.7216C3.81498 15.1397 4.18266 15.4801 4.62207 15.704L4.82227 15.79C5.03904 15.8674 5.31234 15.9205 5.69824 15.9521C6.01398 15.9779 6.383 15.986 6.83398 15.9902L6.83496 3.99992ZM18.165 11.3271C18.165 12.2493 18.1653 12.9811 18.1172 13.5702C18.0745 14.0924 17.9916 14.5472 17.8125 14.9648L17.7295 15.1415C17.394 15.8 16.8834 16.3511 16.2568 16.7353L15.9814 16.8896C15.5157 17.1268 15.0069 17.2285 14.4102 17.2773C13.821 17.3254 13.0893 17.3251 12.167 17.3251H7.83301C6.91071 17.3251 6.17898 17.3254 5.58984 17.2773C5.06757 17.2346 4.61294 17.1508 4.19531 16.9716L4.01855 16.8896C3.36014 16.5541 2.80898 16.0434 2.4248 15.4169L2.27051 15.1415C2.03328 14.6758 1.93158 14.167 1.88281 13.5702C1.83468 12.9811 1.83496 12.2493 1.83496 11.3271V8.66301C1.83496 7.74072 1.83468 7.00898 1.88281 6.41985C1.93157 5.82309 2.03329 5.31432 2.27051 4.84856L2.4248 4.57317C2.80898 3.94666 3.36012 3.436 4.01855 3.10051L4.19531 3.0175C4.61285 2.83843 5.06771 2.75548 5.58984 2.71281C6.17898 2.66468 6.91071 2.66496 7.83301 2.66496H12.167C13.0893 2.66496 13.821 2.66468 14.4102 2.71281C15.0069 2.76157 15.5157 2.86329 15.9814 3.10051L16.2568 3.25481C16.8833 3.63898 17.394 4.19012 17.7295 4.84856L17.8125 5.02531C17.9916 5.44285 18.0745 5.89771 18.1172 6.41985C18.1653 7.00898 18.165 7.74072 18.165 8.66301V11.3271ZM8.16406 15.995H12.167C13.1112 15.995 13.7794 15.9947 14.3018 15.9521C14.8164 15.91 15.1308 15.8299 15.3779 15.704L15.5615 15.6015C15.9797 15.3451 16.32 14.9774 16.5439 14.538L16.6299 14.3378C16.7074 14.121 16.7605 13.8478 16.792 13.4618C16.8347 12.9394 16.835 12.2712 16.835 11.3271V8.66301C16.835 7.71885 16.8347 7.05065 16.792 6.52824C16.7605 6.14232 16.7073 5.86904 16.6299 5.65227L16.5439 5.45207C16.32 5.01264 15.9796 4.64498 15.5615 4.3886L15.3779 4.28606C15.1308 4.16013 14.8165 4.08006 14.3018 4.03801C13.7794 3.99533 13.1112 3.99504 12.167 3.99504H8.16406C8.16407 3.99667 8.16504 3.99829 8.16504 3.99992L8.16406 15.995Z"></path></svg>
          
        </div>}
        <a className='p-2 text-xl hover:bg-[#444444] rounded-lg cursor-pointer' >ChatGPT</a>
      </div>
      <div className="flex items-center space-x-4">
        <div onClick={() => redirect()}
          className=" md:hidden  p-2  text-sm text-gray-100 hover:bg-[#444444] rounded-lg cursor-pointer"
        >
          <FiEdit className=" w-6 h-5 " />
        </div>
        <div className=' hidden md:flex' >
          <a
            className=" m-2 p-2 text-sm text-gray-100 hover:bg-[#444444] rounded-lg cursor-pointer"
          >
            <GoShare className="inline w-6 h-5 mr-2" />
            Share
          </a>
          <a
            ref={moreButtonRef}
            onClick={(e) => handleMoreButtonClick(e)}
            className=" m-2 p-2 text-sm text-gray-100 hover:bg-[#444444] rounded-lg cursor-pointer"
          >
            <GoKebabHorizontal className="h-5 w-5" />
          </a>
          <div
            ref={profileRef}
            onClick={(e) => handleProfileButtonClick(e)}
            className="flex items-center space-x-2 p-1 rounded-3xl cursor-pointer hover:bg-[#444444]">
            {user?.imageUrl && <img
              src={user?.imageUrl }
              alt="Avatar"
              className="w-8 h-8 rounded-full" ccx
            />}
          </div>
        </div>
      </div>

      {moreDetailsOpen && (
        <div
          ref={modalRef}
          className="absolute bg-[#353535] rounded-2xl shadow-lg w-35 z-200"
          style={{ top: modalMoreDetailsPosition.top, left: modalMoreDetailsPosition.left }}
        >
          <ul className="py-1">


            <div className="mx-4 border-b border-gray-400 my-2"></div>
            <li
              className="mx-2.5 p-1.5 text-sm text-gray-100 hover:bg-[#444444] rounded-lg cursor-pointer"
            >
              <BiStoreAlt className="inline w-5 h-4 mr-1.5" />
              Archive
            </li>
            <li

              className="mx-2.5 p-1.5 text-sm text-red-400 hover:bg-[#444444] rounded-lg cursor-pointer"
            >
              <MdOutlineDelete className="inline w-5 h-5 mr-1.5 text-red-400 " />
              Delete
            </li>
          </ul>
        </div>
      )}
      {profileModelOpen &&
        <div
          ref={modalRef}
          className="absolute bg-[#353535] rounded-2xl shadow-lg w-68 z-[1000]"
          style={{ top: modalProfilePosition.top, left: modalProfilePosition.left }}
        >
          <ul className="py-2 z-100">


            <li
              className="mx-2.5 my-1.5 p-1.5 text-sm text-gray-400 hover:bg-[#444444] rounded-lg cursor-pointer"
            >
              <BiUserCircle className="inline w-5 h-4 mr-1.5" />
              {user?.primaryEmailAddress.emailAddress || 'User Name'}
            </li>
           
            <li

              className="mx-2.5 my-1.5 p-1.5 text-sm text-grey-400 hover:bg-[#444444] rounded-lg cursor-pointer"
            >
              <BiWorld className="inline w-5 h-5 mr-1.5  " />
              Personalize
            </li>
            <li

              className="mx-2.5 my-1.5 p-1.5 text-sm text-grey-400 hover:bg-[#444444] rounded-lg cursor-pointer"
            >
              <FiSettings className="inline w-5 h-5 mr-1.5  " />
              Settings
            </li>
            <div className="mx-4 border-b border-gray-400 my-2"></div>
            <li

              className="mx-2.5 my-1.5 p-1.5 text-sm text-grey-400 hover:bg-[#444444] rounded-lg cursor-pointer"
            >
              <BiHelpCircle className="inline w-5 h-5 mr-1.5  " />
              Help
            </li>
            <li
              onClick={() => {signOut(),setProfileModelOpen(false)}}
              className="mx-2.5 my-1.5 p-1.5 text-sm text-grey-400 hover:bg-[#444444] rounded-lg cursor-pointer"
            >
              <LuLogOut className="inline w-5 h-5 mr-1.5  " />
              Logout
            </li>
          </ul>
        </div>
      }
    </div>
   </div>
  )
}

export default Header