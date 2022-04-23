const mongoose = require('mongoose');

require('./category'); // We're adding this here because of the crud-helper that we may or may not use. We want to make sure the category folder is loaded; ensure that code doesn't break, but don't really need it. 

const itemSchema = require('./itemSchema');

module.exports = mongoose.model("Item", itemSchema);

// We want to have the itemSchema by itself because of the way we use it. We can essentially have all models in one file but good practice to separate. 