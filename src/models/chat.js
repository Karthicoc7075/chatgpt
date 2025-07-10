// models/ChatSession.ts
import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const MessageSchema = new Schema({
  role: String, // user | assistant
  content: String,
  fileUrl: String,
  tokensUsed: Number,
  createdAt: { type: Date, default: Date.now },
});

const ChatSchema = new Schema({
  userId: String,
  messages: [MessageSchema],
  memorySummary: String,
  createdAt: Date,
  updatedAt: Date,
});


export const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);