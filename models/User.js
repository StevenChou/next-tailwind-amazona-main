import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
)

// 如果已經建立過 mode，就不需要再呼叫 model function
const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
