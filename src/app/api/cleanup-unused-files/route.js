import cloudinary from '../../../lib/cloundinary';
import connectToDatabase  from '../../../lib/mongodb'
import { NextResponse } from 'next/server';

export async function GET() {
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
}
