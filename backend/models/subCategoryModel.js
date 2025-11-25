import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "",
    },
    image : {
        type: String,
        default: ""
    },
    category: [{
        type: mongoose.Schema.ObjectId,
        ref: 'category',
    }],
}, { timestamps: true})
const subCategoryModel = mongoose.model('subCategory', addressSchema);
export default subCategoryModel;