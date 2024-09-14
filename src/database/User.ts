import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 2,
    max: 100,
    required: true
  },
  email: {
    type: String,
    max: 50,
    required: true,
    unique: true
  },
  password: {
    type: String,
    min: 6,
    required: true
  },
  city: String,
  state: String,
  country: String,
  occupation: String,
  phoneNumber: String,
  transactions: Array,
  role: {
    type: String,
    enum: ['admin', 'user', 'superadmin'],
    default: 'admin'
  }
},
  {timestamps: true}
)

const User = mongoose.model("User", UserSchema)
export default User;

