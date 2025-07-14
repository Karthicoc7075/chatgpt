'use client';
import { useEffect, useState,useRef } from 'react';
import { useChat } from 'ai/react';
import ChatBox from '../../components/chatBox';

import ChatInput from '../../components/chatInput';
import Loader from '../../components/loader';
import { useParams } from 'next/navigation';
import {useUser } from '@clerk/nextjs';
import Toast from '../../components/toast';
import { useRouter } from 'next/navigation';

export default function Chat() {
    const { user } = useUser();
  const { chatId } = useParams(); // Get chatId from URL parameters
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [removedMessages, setRemovedMessages] = useState([]);
  const [editMessage, setEditMessage] = useState(null);
  const isLoadingRef = useRef(isLoading);
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

const triggerToast = () => {
  setShowToast(true);
  setTimeout(() => {
    setShowToast(false);
    setErrorMessage('');
  }, 3000);
};




  useEffect(() => {
    const fetchChat = async () => {
      console.log(user, 'user data');
      
         const userId = user?.id; 

         if(!userId) {
          console.error('User not authenticated');
          setErrorMessage('User not authenticated');
          setIsLoading(false);
          triggerToast();
         }

      try {
     
console.log('Fetching chat for userId:', userId, 'chatId:', chatId);

        const response = await fetch(`/api/get-chat?id=${chatId}&userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch chat');
        }
        const data = await response.json();
        setMessages(data.messages);
        console.log('Fetched messages:', data.messages.length);
        
      } catch (error) {
        console.error('Error fetching chat:', error);
        triggerToast()
        setErrorMessage('Unable to load conversation ' + chatId);
          router.push('/');
      } finally {
        // setLoading(false);
        setPageLoading(false);
      }
    };

    fetchChat();
  }, [chatId]);



  const fetchAiReply = async (newMessages,isNewMessage) => {
    setIsLoading(true);
    setIsThinking(true);
    try {

console.log('Fetching AI reply with messages:', newMessages, 'isNewMessage:', isNewMessage, 'editMessage:', editMessage, 'removedMessages:', removedMessages);


      const response = await fetch(`/api/chat/${chatId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages, editMessage, removedMessages, isNewMessage, userId: user?.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching AI reply:', errorData);
        setErrorMessage(errorData.error || 'Failed to fetch AI reply');
        triggerToast();
        setIsLoading(false);
        return;
      }



      const data = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: " " },
      ]);

      let currentIndex = 0;
const typingInterval = setInterval(() => {
     if (!isLoadingRef.current) {
    clearInterval(typingInterval);
    return;
  }

  console.log('loading', isLoading);
  
  currentIndex++;
  setMessages((prev) => {
    const newMessages = [...prev];
    newMessages[newMessages.length - 1] = {
      role: 'assistant',
      content: data.content.slice(0, currentIndex),
    };
    return newMessages;
  });

  if (currentIndex === data.content.length) {
    clearInterval(typingInterval);
    setIsLoading(false);
  }
}, 30);



    } catch (error) {
      console.error('Error fetching AI reply:', error);
      setErrorMessage("Unable to get AI reply");
      triggerToast();

    } finally {

      setIsThinking(false);
      setEditMessage(null);
      setRemovedMessages([]);

    }
  };

  useEffect(() => {
  isLoadingRef.current = isLoading;
}, [isLoading]);

  useEffect(() => {

    // if (initialMessages.length > 0) {
    //   setMessages(initialMessages);
    //   setInitialMessages([]);
    // }

    if (messages[messages.length - 1]?.role === 'user' && !isLoading) {
      fetchAiReply(messages);
    }

// console.log({ messages, editMessage, removedMessages,isNewMessage});


  }, [messages]);



  const handleSubmit = async (e,fileUrl,imagePreview) => {
    console.log(e,fileUrl,imagePreview);
    
    if(!isLoading){
      e.preventDefault();
    if (!input.trim()) return;
    const isImage = imagePreview ? true: false;
    const file = { url: fileUrl, isImage };
    const newMessage = { role: 'user', content: input, file };
    setInput('');
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    const isNewMessage = true; 
    await fetchAiReply([...messages, newMessage],isNewMessage);
    
    }
  };

  

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  console.log(pageLoading, 'pageLoading');
  

  return (
    <div className="flex flex-col">
          <div>
           {
            pageLoading ?  <div className='flex justify-center h-[94dvh]' >
              <Loader size='md' />
            </div>
           :
          
            <ChatBox messages={messages} setMessages={setMessages} isThinking={isThinking} setRemovedMessages={setRemovedMessages} setEditMessage={setEditMessage} />}
            <div className="fixed bottom-2 left-0 right-0  flex flex-col items-center  md:ml-64">
              <ChatInput
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isMessageLoading={isLoading}
                setIsLoadingStop={setIsLoading}
              />
            </div>
          </div>
          <div className='flex justify-center items-center w-full  '>
             <Toast show={showToast} message={errorMessage} type='error' />
          </div>
        </div>

  );
}
