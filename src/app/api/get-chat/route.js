import { NextResponse } from 'next/server';
import { getChatById } from '../../../db/chat'; // adjust if your path differs

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const chatId = searchParams.get('id');
    const userId = searchParams.get('userId');
    if (!chatId) {
      return NextResponse.json({ error: 'Missing chat ID' }, { status: 400 });
    }

    const chat = await getChatById(chatId);

    console.log('userId', userId);
    

    if (chat.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    return NextResponse.json(chat, { status: 200 });
  } catch (err) {
    console.error('Failed to get chat:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
