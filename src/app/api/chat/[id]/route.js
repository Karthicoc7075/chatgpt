import { OpenAI } from 'openai';
import { getChatById, updateChatWithReply, addMessageToChat, deleteChat, updateChat } from '../../../../db/chat';
import { deleteFile, markFileAsUsed } from '../../../../db/files';
import {extractText} from '../../../../lib/extractText'
import { encoding_for_model } from "tiktoken";
import { updateUserToken,getUserToken } from '../../../../db/user';
import { NextResponse } from 'next/server';

const enc = encoding_for_model("gpt-4o");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store in .env.local
});


export async function POST(req, {params}) {
    try{

  const chatId = params?.id;


  const { messages, editMessage, removedMessages,isNewMessage,userId } = await req.json();

  const userMessage = messages[messages.length - 1];



 const user = await getUserToken(userId);
console.log("User token data:", user);

  if (user.tokenUsed >= user.tokenLimit) {
    return new NextResponse.json({ error: 'Token limit exceeded' }, { status: 403 });
  }


  if (userMessage.role === 'user') {
    if (removedMessages.length > 0) {
      await Promise.all(removedMessages.map(async (msg) => {
          await updateChat(chatId,editMessage,userMessage  )
          await deleteChat(chatId, msg.role, msg.content, msg.file);
      
        if (msg.file?.url) await deleteFile(msg.file.url);
      }));
    }
    
    
    if(isNewMessage){
    await addMessageToChat(chatId, 'user', userMessage.content, userMessage.file);
     if (userMessage.file?.url) await markFileAsUsed(userMessage.file.url);
    }
    
   
  }

  let fileExtractData = '';

  if( userMessage.file?.url && !userMessage.file.isImage){
    try {
      fileExtractData = await extractText(userMessage.file.url);
      console.log('fileExtractData', fileExtractData);
    } catch (error) {
      console.error('Error extracting text from file:', error);
      fileExtractData = 'Error extracting text from file';
    }
  }

  const chat = await getChatById(chatId);


  


  const toOpenAIMessage = (msg) => {
    const role = msg.role == 'user' ? 'user' : 'assistant';
    if (msg.file?.isImage && role == 'user') {
      return {
        role,
        content: [
          { type: "text", text: msg.content },
          {
            type: "image_url",
            image_url: {
              url: msg.file.url,
              detail: "auto",
            },
          },
        ],
      };
    } else if (!msg.file?.isImage && fileExtractData && role == 'user') {
      return {
        role,
        content: `${msg.content}\n\nFile content:\n${fileExtractData || ''}`,
      };
    }else{

    return {
      role,
      content: msg.content,
    };
  }
  };

  const history = chat.messages.map(toOpenAIMessage);


let totalTokens = 0;
for (const msg of history) {
  totalTokens += 4; // base per message
  totalTokens += enc.encode(msg.content).length;
}





  const completion = await openai.chat.completions.create({
    model: 'gpt-4o', // or 'gpt-4' if you have access
    messages: history,
  });

  const reply = completion.choices[0].message.content;

const replyTokens = enc.encode(reply).length;
console.log("Reply tokens:", replyTokens);

console.log("Total tokens:", totalTokens + replyTokens);
await updateUserToken(userId, totalTokens + replyTokens);

  await updateChatWithReply(chatId, reply);

  return  NextResponse.json({ content: reply, chatId }, {
    status: 200,
  });


    }
catch (error) {
        console.error("Error in chat route:", error);
        return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
    }

}


