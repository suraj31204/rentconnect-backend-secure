const express = require('express');

const authRouter = express.Router();

const handleAuthController = require('../controller/authController');

// POST /api/auth/login
authRouter.post('/login', handleAuthController.postLogin);

// POST /api/auth/signup
authRouter.post('/signup', handleAuthController.postSignUp);

authRouter.post('/logout', handleAuthController.postLogout);


// Check if user is still logged in
authRouter.get("/user", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

authRouter.put("/user/:id", handleAuthController.updateUser);


module.exports = authRouter;