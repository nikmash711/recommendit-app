'use strict';

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: String,
  notes: String,
  rating: Number,
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
});

// Add `createdAt` and `updatedAt` fields
itemSchema.set('timestamps', true);

//// Customize output for `res.json(data)`, `console.log(data)` etc.
itemSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.__v; //delete _v
  }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
