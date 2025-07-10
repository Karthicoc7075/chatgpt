import { ObjectId } from 'mongodb';
import connectToDatabase from '../lib/mongodb';
import cloudinary from '../lib/cloundinary';

export async function createChat(userId, firstMessage, file) {
  const db = await connectToDatabase();
  const chats = db.collection('chats');

  const { url, isImage = false } = file;
  console.log('Creating chat with file:', file);

  const result = await chats.insertOne({
    userId,
    title: "New Chat",
    messages: [
      {
        _id: new ObjectId(),
        role: 'user',
        content: firstMessage,
        editCount: 0,
        createdAt: new Date(),
        file: url ? {
          url,
          isImage,
          updatedAt: new Date(),
        } : null,
      },

    ],
    createdAt: new Date(),
  });

  return result.insertedId.toString();
}

export async function getChatById(chatId) {
  const db = await connectToDatabase();
  const chats = db.collection('chats');

  console.log(`Fetching chat with ID: ${chatId}`);


  return await chats.findOne({ _id: new ObjectId(chatId) });
}

export async function addMessageToChat(chatId, role, content, file) {
  const db = await connectToDatabase();
  const chats = db.collection('chats');


  const { url, isImage } = file || {};


  await chats.updateOne(
    { _id: new ObjectId(chatId) },
    {
      $push: {
        messages: {
          _id: new ObjectId(),
          role,
          content,
          editCount: 0,
          createdAt: new Date(),
          file: url
            ? {
              url,
              isImage,
              uploadedAt: new Date(),
            }
            : null,

        },
      },
    }
  );
}

export async function updateChatWithReply(chatId, replyMessage) {
  return await addMessageToChat(chatId, 'assistant', replyMessage);
}

export async function getAllChatsMeta(userId) {
  const db = await connectToDatabase();
  const chats = db.collection('chats');

  return await chats
    .find({ userId })
    .project({ _id: 1, title: 1, createdAt: 1 })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function deleteChat(chatId, role, content, file) {
  const db = await connectToDatabase();
  const chats = db.collection('chats');

  const fileUrl = file?.url;
  if (fileUrl && fileUrl.includes('/upload/')) {
    const publicId = fileUrl
      .split('/upload/')[1]       // get part after '/upload/'
      .split('/')                 // split by '/'
      .slice(1)                   // remove version folder like 'v1751103502'
      .join('/')                  // join remaining parts (path + filename)
      .replace(/\.[^/.]+$/, '');  // remove file extension

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log('Deleted image:', publicId, result);
    } catch (error) {
      console.error('Cloudinary deletion error:', error);
    }
  } else {
    console.warn('Invalid Cloudinary URL, skipping:', fileUrl);
  }



  const result = chats.updateOne({ _id: new ObjectId(chatId) }, { $pull: { messages: { role, content } } });

  console.log('Deleting chat with ID:', chatId, 'Role:', role, 'Content:', content);

  return result.deletedCount > 0;
}


export async function getChat(role, content) {
  const db = await connectToDatabase();
  const chats = db.collection('chats');

  const match = await chats.updateOne({ _id: new ObjectId("685eabcda256b29439631254") }, { $pull: { messages: { role, content } } });

  if (match) {
    console.log("Found match:", match);
  } else {
    console.log("No matching document found.");
  }
  return match;

}

export async function updateChat(chatId, oldMessage, newMessage) {
  const db = await connectToDatabase();
  const chats = db.collection('chats');




const oldMessageId = oldMessage._id;
  const result = await chats.updateOne(
  {
    _id: new ObjectId(chatId),
    'messages._id': new ObjectId(oldMessageId)
  },
  {
    $set: {
      'messages.$.content': newMessage.content,
      'messages.$.updatedAt': new Date(),
      'messages.$.editCount': oldMessage.editCount + 1,
    }
  }
);

  console.log('Update result:', result);

  console.log(`Updating chat with ID: ${chatId}, old message:`, oldMessage, `new message:`, newMessage);

  return result.modifiedCount > 0;
}

export async function updateChatTitle(chatId, newTitle) {
  const db = await connectToDatabase();
  const chats = db.collection('chats');

  const result = await chats.updateOne(
    { _id: new ObjectId(chatId) },
    { $set: { title: newTitle } }
  );

  console.log(`Updating chat title with ID: ${chatId}, new title:`, newTitle);

  return result.modifiedCount > 0;
}


export async function deleteChatById(chatId) {
  const db = await connectToDatabase();
  const chats = db.collection('chats');

  const result = await chats.deleteOne({ _id: new ObjectId(chatId) });

  console.log(`Deleting chat with ID: ${chatId}`);

  return result.deletedCount > 0;
}