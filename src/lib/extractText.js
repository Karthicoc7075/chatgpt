// lib/extractText.js
import axios from 'axios';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import path from 'path';

export async function extractText(fileUrl) {
    let fileExtractData = '';
   const ext = path.extname(fileUrl).toLowerCase();
  console.log('file extension', ext);

    const response = await axios.get(fileUrl, {
      responseType: 'arraybuffer',
    });
  
    console.log('response', response.data);
    
    const buffer = Buffer.from(response.data);
  
    if (ext === '.pdf') {
        console.log('Processing PDF file');
        
      const data = await pdfParse(buffer);
      fileExtractData = data.text;
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ buffer });
      fileExtractData = result.value;
    } else if (ext === '.doc' || ext === '.txt') {
      fileExtractData = await new Promise((resolve, reject) => {
        textract.fromBufferWithName('file' + ext, buffer, (err, text) => {
          if (err) reject(err);
          else resolve(text);
        });
      });
    } else {
      throw new Error('Unsupported file type: ' + ext);
    };
console.log('fileExtractData', fileExtractData);

    return fileExtractData;
}