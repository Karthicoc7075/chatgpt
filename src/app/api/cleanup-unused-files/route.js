import cloudinary from '../../../lib/cloundinary';
import connectToDatabase  from '../../../lib/mongodb'
import { NextResponse } from 'next/server';

export async function GET() {
  try{
     const db = await connectToDatabase();
  const cutoff = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago

  const oldFiles = await db.collection('uploads').find({
    status: 'pending',
    uploadedAt: { $lt: cutoff },
  }).toArray();

  for (const file of oldFiles) {
    if (file.public_id) {
      await cloudinary.uploader.destroy(file.public_id);
    }
    await db.collection('uploads').deleteOne({ _id: file._id });
  }

  return NextResponse.json({
    deleted: oldFiles.length,
  },
  {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  }catch (error) {
      console.error("Error in cleanup route:", error);
      return NextResponse.json({ error: 'Failed to cleanup files' }, { status: 500 });
  }
}
