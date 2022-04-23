const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
  create,
  login,
  checkToken
};

function checkToken(req, res) {
  console.log('req.user', req.user);
  res.status(200).json(req.exp);
};

async function login(req, res) {
  try {
    // Find the user by their email address... with their credentials in req.body
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error(); // This means that no user with those credentials were ever created... throw error
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new Error(); // Using bcrypt, we're gonna compare passwords (hash) from the user input and the database. If those two are the same, then match is true. If false, throw error.
    res.status(200).json( createJWT(user) ); // Once credentials true, then json the user for the entirity of the session, exprires in 24h
  } catch {
    res.status(400).json('Bad Credentials');
  }
};

async function create(req, res) {
  try {
    // Add the user to the db
    const user = await User.create(req.body);
    // token will be a string
    const token = createJWT(user);
    // send back the token as a string
    // which we need to account for
    // in the client
    res.status(200).json(token);
  } catch (e) {
    res.status(400).json(e);
  }
};


/*-- Helper Functions --*/

function createJWT(user) {
  return jwt.sign(
    // data payload
    { user },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
};
// Sets the token for the user once logged in until 24h or log out. 