import { getAllChatsMeta } from "../../../../db/chat";



export async function GET(req, context) {
    const params = await context.params;
    
    const userId = params.userId;
    
    try {
        const chatsMeta = await getAllChatsMeta(userId);
    
        return new Response(JSON.stringify(chatsMeta), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        });
    } catch (error) {
        console.error('Error fetching chats meta:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch chats meta' }), {
        status: 500,
        headers: {
            'Content-Type': 'application/json',
        },
        });
    }
    }