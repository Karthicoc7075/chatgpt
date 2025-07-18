import {NextResponse} from 'next/server';
import { updateChatTitle } from '../../../db/chat'; 


export async function PUT(req) {
    const { chatId, newTitle } = await req.json();
    
    if (!chatId || !newTitle) {
        return NextResponse.json({ error: "Chat ID and new title are required" }, { status: 400 });
    }
    
    try {
        const updated = await updateChatTitle(chatId, newTitle);
        if (updated) {
        return NextResponse.json({ message: "Chat title updated successfully" }, { status: 200 });
        } else {
        return NextResponse.json({ error: "Chat not found or title not changed" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error updating chat title:", error);
        return NextResponse.json({ error: "Failed to update chat title" }, { status: 500 });
    }
    }