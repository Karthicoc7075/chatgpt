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
  
  if (ext === '.pdf') {
    
    const data = await pdfParse(buffer);
    console.log('PDF data', data);
    fileExtractData = data.text;
  } else if (ext === '.docx' || ext === '.doc' || ext === '.docm' || ext === '.dotx' || ext === '.dotm') {
    const result = await mammoth.extractRawText({ buffer });
    fileExtractData = result.value;
  } else if ( ext === '.txt' ) {
    fileExtractData = buffer.toString();
  }
  else if (ext === '.json') {
    
    fileExtractData = JSON.parse(buffer.toString());
  } else if (ext === '.csv') {
    const csv = buffer.toString();
    const rows = csv.split('\n').map(row => row.split(','));
    fileExtractData = rows.map(row => row.map(cell => cell.trim()));
  } else if (ext === '.xml') {
    const xml = buffer.toString();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const json = Array.from(xmlDoc.documentElement.children).reduce((acc, child) => {
      acc[child.nodeName] = child.textContent;
      return acc;
    }, {});
    fileExtractData = json;
  } else if (ext === '.html' || ext === '.htm') {
    const html = buffer.toString();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');


    fileExtractData = Array.from(doc.body.childNodes)
      .map(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim();
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          return `<${node.nodeName.toLowerCase()}>${node.textContent.trim()}</${node.nodeName.toLowerCase()}>`;
        }
        return '';
      })
      .filter(text => text)   
      .join('\n');
    }
  else {
    throw new Error('Unsupported file type: ' + ext);
  }

  return NextResponse.json({ fileExtractData }, { status: 200 });
}
