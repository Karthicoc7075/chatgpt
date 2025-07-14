import { NextResponse } from 'next/server';
import path from 'path'; // Make sure this is imported
import axios from 'axios';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import textract from 'textract';
import cloudinary from '../../../lib/cloundinary';

export async function GET() {
  let fileExtractData = '';

  const userMessage = {
    file: {
      url:"https://res.cloudinary.com/ddet3afir/raw/upload/v1751276545/chat_uploads/1751276544483_Basic%20English%20Vocabulary%20List.pdf",
      isImage: false,
    },
  };


  const ext = path.extname(userMessage.file.url).toLowerCase();
 
console.log('file extension', ext);

  const response = await axios.get(userMessage.file.url, {
    responseType: 'arraybuffer',
  });
console.log('response', response.data);

  const buffer = Buffer.from(response.data);

  console.log('buffer', buffer);
  
 
  return NextResponse.json({ fileExtractData }, { status: 200 });
}
