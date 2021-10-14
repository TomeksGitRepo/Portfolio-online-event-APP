import mongoose from 'mongoose'
import connection from '../connections'

const AdminSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true, 
      required: true
    },
  
    password: {
        type: String,
        required: true
    }
  });
  

  export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);