### 🤖 ChatGPT Clone – Full-Stack AI Chat Application

A full-stack ChatGPT-like AI chat application built using Next.js, OpenAI API, MongoDB, Clerk Authentication, and Cloudinary.
The app allows users to sign in securely, create chat conversations, and interact with an AI assistant in real time.

All features are built from scratch with a focus on scalability, clean architecture, and performance.

### ✨ Features

🔐 Secure authentication using Clerk

💬 Real-time AI chat powered by OpenAI API

🧠 Persistent chat history stored in MongoDB

🗂 Chat creation and conversation management

☁️ Cloudinary integration for media/file storage

📱 Fully responsive UI

🚀 Optimized with Next.js App Router

### 🛠 Tech Stack

Frontend & Backend: Next.js (App Router)

AI Integration: OpenAI API

Authentication: Clerk

Database: MongoDB

Cloud Storage: Cloudinary

Styling: Tailwind CSS

Version Control: Git & GitHub

### 🧩 Application Flow

User signs up / logs in using Clerk

User creates a new chat

Messages are sent to OpenAI API

AI responses are streamed back to the UI

All conversations are saved in MongoDB

Media files (if any) are stored using Cloudinary

### 📂 Project Structure
/app
  /api
  /chat
/lib
/models
/db

### 🔑 Environment Variables

Create a .env.local file and add:

OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

### 🚀 Getting Started
# Install dependencies
npm install

# Run the development server
npm run dev


Open http://localhost:3000 in your browser.
