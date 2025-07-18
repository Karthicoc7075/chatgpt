import { NextResponse } from "next/server";
import { deleteChatById } from '../../../db/chat'; // adjust if your path differs

export async function DELETE(req) {
  const { chatId } = await req.json();

  if (!chatId) {
    return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
  }

  try {
   
    await deleteChatById(chatId);
    return NextResponse.json({ message: "Chat deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete chat" }, { status: 500 });
  }
}