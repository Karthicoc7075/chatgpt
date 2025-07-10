// app/api/cleanup-unused-files/route.ts
import cloudinary from '../../../lib/cloundinary';
import connectToDatabase  from '../../../lib/mongodb'

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

  return new Response(JSON.stringify({
    deleted: oldFiles.length,
  }));
}
