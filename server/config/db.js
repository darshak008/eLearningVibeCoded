const mongoose = require('mongoose');
const Category = require('../models/Category');

const defaultCategories = [
  'Development', 'Design', 'Business', 'Marketing',
  'IT & Software', 'Photography', 'Music', 'Health & Fitness',
];

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${conn.connection.host}`);

  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(defaultCategories.map((name) => ({ name, slug: name.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-') })));
    console.log('Default categories seeded');
  }
};

module.exports = connectDB;
