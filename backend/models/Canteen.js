// models/Canteen.js
import mongoose from "mongoose";

const canteenSchema = new mongoose.Schema({
  name: String,
  image: String,
  location: String,
  isOpen: Boolean
});

export default mongoose.model("Canteen", canteenSchema);