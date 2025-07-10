import cloudinary from '../../../lib/cloundinary';
import {savePendingFile} from '../../../db/files'
export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');
console.log('file', file);

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const isImage = file.type?.startsWith('image/');
  const resourceType = isImage ? 'image' : 'raw';

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ 
            
        folder: 'chat_uploads',
        resource_type: resourceType,
        use_filename: true,
        type: 'upload',
        unique_filename: true,
        public_id: `${Date.now()}_${file.name}`, // Use timestamp + original name for uniqueness
        }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
          
        })
        .end(buffer);
    });


    await savePendingFile({
  url: result.secure_url,
  public_id: result.public_id,
  uploadedAt: new Date(),
  status: 'pending',
});
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Upload failed' }), { status: 500 });
  }
}
