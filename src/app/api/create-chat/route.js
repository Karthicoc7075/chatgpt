// app/api/save-chat/route.ts
import { NextResponse } from 'next/server';
import { createChat } from '../../../db/chat';
import { markFileAsUsed } from '../../../db/files';
import { getUserById,createUser } from '../../../db/user';
import { getUserToken } from '../../../db/user';

export async function POST(req) {
 

   const { user, message, file }  = await req.json();

   const findUser = await getUserById(user.id);

  if (!findUser) {
    
    await createUser(user.id, user.email, user.name, user.image);

  }

  const userToken = await getUserToken(user.id);
  if (userToken.tokenUsed >= 10) 
    return NextResponse.json({ error: 'Token limit exceeded' }, { status: 403 });
   console.log('Creating chat with file:', file);

  try {
    const newChatId =  await createChat(user.id, message, file);

    if(file?.url) await markFileAsUsed(file.url);

    return NextResponse.json({ chatId: newChatId });
  } catch (err) { 
    return NextResponse.json({ error: 'Failed to save chat' }, { status: 500 });
  }
}
