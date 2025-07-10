import connectToDatabase from '../lib/mongodb';


export async function createUser(clerk_user_id,email, name, image) {
  const db = await connectToDatabase();
  const users = db.collection('users');

  const existingUser = await users.findOne({ email });
  if (existingUser) {
    return existingUser;
  }

  const result = await users.insertOne({ 
    _id: clerk_user_id,
    email,
    name,
    image,
    tokenLimit: 1000,
    tokenUsed: 0,
    createdAt: new Date(),
    updatedAt: new Date(),

  });

  return result;
}


export async function getUserById(clerk_user_id) {
  const db = await connectToDatabase();
  const users = db.collection('users');

  const user = await users.findOne({ _id: clerk_user_id });
  return user;
}


export async function updateUserToken(clerk_user_id, tokens) {
  const db = await connectToDatabase();
  const users = db.collection('users');

  const result = await users.updateOne(
    { _id: clerk_user_id },
    { $inc: { tokenUsed: tokens, },
      $set: { updatedAt: new Date() } }
  );

  return result.modifiedCount > 0;
}


export async function getUserToken(clerk_user_id) {
  const db = await connectToDatabase();
  const users = db.collection('users');

  const user = await users.findOne({ _id: clerk_user_id }, { projection: { tokenUsed: 1, tokenLimit: 1 } });
  
  if (!user) {
    throw new Error('User not found');
  }

  return {
    tokenUsed: user.tokenUsed || 0,
    tokenLimit: user.tokenLimit || 1000,
  };
}