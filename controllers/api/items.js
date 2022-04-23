const Item = require('../../models/item');

module.exports = {
    index,
    show
};

async function index(req, res) {
    try {
      const items = await Item.find({}).sort('name').populate('category').exec(); // Finding all items in an object, sort them by name, then populate the category: in that spot where the objectId is in category, go ahead and find the objectId and match it to the specific category; .exec() tells mongoose to execute the function - you need to do that if you do .sort and .populate.
      // re-sort based upon the sortOrder of the categories
      items.sort((a, b) => a.category.sortOrder - b.category.sortOrder);
      res.status(200).json(items);
    }   catch(e) {
      res.status(400).json({ msg: e.message });
    }
};

async function show(req, res) {
    try {
      const item = await Item.findById(req.params.id);
      res.status(200).json(item);
    }   catch(e) {
      res.status(400).json({ msg: e.message });
    }  
};

