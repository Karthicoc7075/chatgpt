import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export const User = mongoose.models.users || mongoose.model('users', UserSchema);