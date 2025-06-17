import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String }
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
