import connectToDatabase from '../lib/mongodb';

export async function savePendingFile(file) {
  const db = await connectToDatabase();
  await db.collection('uploads').insertOne(file);
}


export async function markFileAsUsed(fileUrl) {
  const db = await connectToDatabase();
  await db.collection('uploads').updateOne(
    { url: fileUrl },
    { $set: { status: 'used' } }
  );
}


export async function deleteFile(fileUrl) {
  const db = await connectToDatabase();
  await db.collection('uploads').deleteOne({ url: fileUrl });
 
}