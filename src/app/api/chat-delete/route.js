import { deleteChatById } from "../../../db/chat";

export async function DELETE(request) {
    try {
        const { chatId, userId } = await request.json();

        if (!chatId || !userId) {
            return new Response(JSON.stringify({ error: 'Chat ID and user ID are required' }), { status: 400 });
        }

        const result = await deleteChatById(chatId);

        if (result) {
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: 'Failed to delete chat' }), { status: 500 });
        }
    } catch (error) {
        console.error('Error deleting chat:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}