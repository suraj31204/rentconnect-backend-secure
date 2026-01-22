const User = require('../model/userModel');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

 const user = await User.findOne({ email: email.trim() });
  if (!user) {
    return res.status(401).json({
      isLoggedIn: false,
      errors: ["User does not exist"],
      user: {}
    });
  }

  console.log("Entered password:", password);
console.log("Password hash in DB:", user.password);

const isMatch2 = await bcrypt.compare(password, user.password);
console.log("bcrypt.compare result:", isMatch2);


  const isMatch = await bcrypt.compare(password.trim(), user.password);
  if (!isMatch) {
    return res.status(401).json({
      isLoggedIn: false,
      errors: ["Invalid password"],
      user: {}
    });
  }

  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();

  return res.status(200).json({
    isLoggedIn: true,
    user: {
      _id: user._id,
      email: user.email,
      userType: user.userType,
      firstName: user.firstName,
      lastName: user.lastName
    }
  });
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
};

exports.postSignUp = [
  check('firstName').isLength({ min: 2 }),
  check('email').isEmail(),
  check('password').isLength({ min: 8 }),
  check('confirmPassword').custom((v, { req }) => v === req.body.password),
  check('userType')
    .isIn(['guest', 'Car Owner', 'Driver', 'Admin'])
    .withMessage("Invalid user type"),
  check('terms').equals('true').optional(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array().map(e => e.msg)
      });
    }

    const { firstName, lastName, email, password, userType } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({ success: false, errors: ["Email already exists"] });
    }

    const hashed = await bcrypt.hash(password, 12);

    await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
      userType
    });

    res.json({ success: true });
  }
];
