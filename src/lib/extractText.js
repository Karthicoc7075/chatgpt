// lib/extractText.js
import axios from 'axios';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import path from 'path';
import textract from 'textract';


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
    
console.log('fileExtractData', fileExtractData);

    return fileExtractData;
}