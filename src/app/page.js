"use client";
import ChatInput from './components/chatInput';
 import { useUser } from '@clerk/nextjs';
 import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from './components/toast';


export default function HomePage() {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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


  const handleSubmit = async (e,fileUrl,imagePreview) => {
    
    e.preventDefault();
    if (!input.trim() || isLoading ) return;
  setIsLoading(true);
    const file ={
      url:fileUrl,
      isImage: imagePreview ? true:false
    }

    console.log('Creating chat with options:', file);
    


    if (!user.id) {
    setIsLoading(false);
      return {
        error: 'User not authenticated',
        message: 'Please log in to start a chat.'
  }
}

   const userData = {
    id: user.id ,
    email: user.emailAddresses[0]?.emailAddress,
    name: user.fullName || '',
    image: user.imageUrl
   };

   

    const res = await fetch('/api/create-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: userData,
        message: input.trim(),
        file
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error creating chat:', errorData);
      setErrorMessage(errorData.error || 'Failed to create chat');
      setInput("");
      triggerToast();
      setIsLoading(false);
      return;
    }
    const data = await res.json();
    if (data.chatId) {
      router.push(`/chat/${data.chatId}`);
    }

  
  };


const  handleInputChange = (e) => {
    setInput(e.target.value);
  };

  console.log(showToast, errorMessage);
  
  
  return (
    <div >
           <div className='flex justify-center items-center w-full '>
             <Toast show={showToast} message={errorMessage} type='error' />
          </div>
            <div className="flex flex-col items-center justify-center   h-[68vh]  ">
              <h1 className='text-3xl   pb-10' >Where should we begin?</h1>
              <ChatInput input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmit}  isMessageLoading={isLoading} setIsLoadingStop={setIsLoading} />
            </div>
    </div>
  );
}



// 'use client';
// import { useChat } from '@ai-sdk/react';

// export default function Chat() {
//   const { messages, input, handleInputChange, handleSubmit } = useChat();
//   return (
//     <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
//       {messages.map(message => (
//         <div key={message.id} className="whitespace-pre-wrap">
//           {message.role === 'user' ? 'User: ' : 'AI: '}
//           {message.parts.map((part, i) => {
//             switch (part.type) {
//               case 'text':
//                 return <div key={`${message.id}-${i}`}>{part.text}</div>;
//             }
//           })}
//         </div>
//       ))}

//       <form onSubmit={handleSubmit}>
//         <input
//           className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
//           value={input}
//           placeholder="Say something..."
//           onChange={handleInputChange}
//         />
//       </form>
//     </div>
//   );
// }