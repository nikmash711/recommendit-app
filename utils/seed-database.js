'use strict';
const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');
const Item = require('../models/item');

const { items } = require('../db/seed/data');

mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
  .then(() => mongoose.connection.db.dropDatabase())
  .then(()=> {
    return Item.insertMany(items);
  })
  .then(items => {
    console.info(`Inserted ${items.length} items`);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(err);
  });

// this drops whatever is currently in the database and repopulates it when we run it with node ./utils/seed-database.js