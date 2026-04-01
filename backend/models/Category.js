import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String }, // URL or path to category image
});

const Category = mongoose.model("Category", categorySchema);

export default Category;