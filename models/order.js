const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const itemSchema = require('./itemSchema');


const lineItemSchema = new Schema({
    qty: { type: Number, default: 1 },
    item: itemSchema
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});
// When creating schemas, you need to know if a new schema need to exist outside of the original schema. If yes, then make the schema.

lineItemSchema.virtual('extPrice').get(function() {
    // 'this' is bound to the lineItem subdoc
    return this.qty * this.item.price;
});
// Line Item itself has its own virtual to calculate the price for each line item (burgers line, hot dogs line)

const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    lineItems: [lineItemSchema],
    isPaid: { type: Boolean, default: false }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});
// When creating schemas, you need to know if a new schema need to exist outside of the original schema. If yes, then make the schema.
// This is to breakdown models for more feature. You don't need to do this, but sometimes your features need it to work properly.

orderSchema.virtual('orderTotal').get(function() {
    return this.lineItems.reduce((total, item) => total + item.extPrice, 0);
});
// Virtuals to calculate the order total, adding all line items together

orderSchema.virtual('totalQty').get(function() {
    return this.lineItems.reduce((total, item) => total + item.qty, 0);
});
// Virtuals to calculate the total quantity

orderSchema.virtual('orderId').get(function() {
    return this.id.slice(-6).toUpperCase();
});
// This is saying I only want to grab last 6 characters and return them


orderSchema.statics.getCart = function(userId) {
    // 'this' is the Order model
    return this.findOneAndUpdate(
      // query
      { user: userId, isPaid: false },
      // update
      { user: userId },
      // upsert option will create the doc if
      // it doesn't exist
      { upsert: true, new: true }
    );
};
// Static method. We usually do this once. A static belongs to the model itself. This is like doing orderfindbyid. But now it's order.getCard. We look up order by user ID, whether it's paid, update the user ID, etc. We're essentially getting a cart for the user. When you move to different pages, you cart persists, it doesn't disappear. If it's already paid though, it wouldn't be there but in Order History.

orderSchema.methods.addItemToCart = async function(itemId) {
    const cart = this;
    // Check if item already in cart
    const lineItem = cart.lineItems.find(lineItem => lineItem.item._id.equals(itemId));
    if (lineItem) {
      lineItem.qty += 1;
    } else {
      const item = await mongoose.model('Item').findById(itemId);
      cart.lineItems.push({ item });
    }
    return cart.save();
};
// View this as foundFruit.addItemToCart

// Instance method to set an item's qty in the cart (will add item if does not exist)
orderSchema.methods.setItemQty = function(itemId, newQty) {
    // this keyword is bound to the cart (order doc)
    const cart = this;
    // Find the line item in the cart for the menu item
    const lineItem = cart.lineItems.find(lineItem => lineItem.item._id.equals(itemId));
    if (lineItem && newQty <= 0) {
      // Calling remove, removes itself from the cart.lineItems array
      lineItem.remove();
    } else if (lineItem) {
      // Set the new qty - positive value is assured thanks to prev if
      lineItem.qty = newQty;
    }
    // return the save() method's promise
    return cart.save();
};

module.exports = mongoose.model('Order', orderSchema);


// Virtuals is a advance feature in MongoDB. They are document properties that do not persist or get stored in MongoDB database. Think of it as a computed property. It's for things where you wouldn't store key and value pair normally. First name and last name will have their own key and value pair. But you can call FullName so that you can output First and Last name together. We want to do this if we need the information on the backend... we need to be able to retrieve it. On the Frontend, you can create code to do the same thing, but the backend won't have that data later. We're making a fetch request on the backend to calculate the quantity and price. This is to avoid putting the math in the MongoDB. 




/* A reminder on classes
class Animal {
    constructor(name) {
        this.name = name
    }
    speak() {
        return 'hi'
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed
    }
}

Animal.prototype.yell = function(){
    return `${this.name} what up`
} //Later on, you can add new functions to the existing class that then you can use

const fido = new Dog('Fido', 'dauschand')

fido() // Fido, dauschand
fido.speak() // hi
fido.yell() // Fido what up
*/

/*
// Reduce method - go through a list of something that is an array, and accumlate the data type. Reduce method takes 2 arguements. The first arguement is the accumalator, you can name it anything descriptive. The second is calling the item of what is in the array. Item will be each number in the array. 0 is what number we start at. We will keep pushing the currentTotal everytime the accumalator goes through array.
const prices = [3.95, 2.64, 7.36, 2.88, 1.95]

const totalPrice = prices.reduce((currentTotal, item, idx) => {
    return currentTotal + item
}, 0)

totalPrice()
// 0 + 3.95
// 3.95 + 2.64
//.... until the end of the array. 18.77
*/