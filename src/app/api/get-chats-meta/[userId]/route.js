import { getAllChatsMeta } from "../../../../db/chat";
import { NextResponse } from 'next/server';

export async function GET(req, context) {
    const params = await context.params;
    
    const userId = params.userId;
    
    try {
        const chatsMeta = await getAllChatsMeta(userId);
        return NextResponse.json(chatsMeta);
    } catch (error) {
        console.error("Error fetching chats meta:", error);
        return NextResponse.json({ error: 'Failed to fetch chats meta' }, { status: 500 });
    }
    }