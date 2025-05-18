import dotenv from "dotenv"
import path from 'path';
import mongoose from "mongoose";

const __dirname = import.meta.dirname;
const envPath = path.join(__dirname,'.env');

dotenv.config({path : `${envPath}`});
let User;

connectDB();

async function connectDB() {
  await mongoose.connect(`${process.env.DATABASE_CONNECTION}`);
  const userSchema = new mongoose.Schema({
    username: String,
    "last-name": String,
    "first-name": String,
    email: String,
    "phone-number": String,
    country: String,
    city: String,
    profilePic: String
});
  User = mongoose.model('User', userSchema,'users');
  
}

export {User};