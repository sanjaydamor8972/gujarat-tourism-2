import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  name: String,
  location: String,
  description: String,
  image: String,
  category: String
});

export default mongoose.model("Place", placeSchema);