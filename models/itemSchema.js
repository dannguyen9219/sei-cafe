const item = require('./item');

const Schema = require('mongoose').Schema;

const itemSchema = new Schema({
    name: { type: String, required: true },
    emoji: String,
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    price: { type: Number, required: true, default: 0}
}, {
    timestamps: true
});

module.exports = itemSchema;

// Schema.Types.ObjectId with ref to Category - every single item will have a single Category; Category will be a child of item; it is going to list the category to the corresponding ID; It will list the ID of Meat instead of saying Meat