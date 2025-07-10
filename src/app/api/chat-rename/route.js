import {updateChatTitle,getChatById} from '../../../db/chat'


export async function PUT(request) {
    try {
        const { chatId, newTitle, userId } = await request.json();

        if (!chatId || !newTitle || !userId) {
            return new Response(JSON.stringify({ error: 'Chat ID, new title, and user ID are required' }), { status: 400 });
        }
    
        const chat = await getChatById(chatId);
        if (!chat) {
            return new Response(JSON.stringify({ error: 'Chat not found' }), { status: 404 });
        }
        const result = await updateChatTitle(chatId, newTitle);
    
        if (result) {
        return new Response(JSON.stringify({ success: true }), { status: 200 });
        } else {
        return new Response(JSON.stringify({ error: 'Failed to update chat title' }), { status: 500 });
        }
    } catch (error) {
        console.error('Error updating chat title:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
    }