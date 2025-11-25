import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    image: {
        type: String,
        default: []
    },
    category: [{
        type: mongoose.Schema.ObjectId,
        ref: 'category',
    }],
    subCategory: [{
        type: mongoose.Schema.ObjectId,
        ref: 'category',
    }],
    unit : {
        type: String,
        default: ""
    },
    stock: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: null
    },
    discount: {
        type: Number,
        default: null
    },
    description: {
        type: String,
        default: ""
    },
    more_details: {
        type: Object,
        default: ""
    },
    public : {
        type: Boolean,
        default: true
    },
    
}, { timestamps: true });

const productModel = mongoose.model('product', ProductSchema);
export default productModel;                