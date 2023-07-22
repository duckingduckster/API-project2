// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { Spot, Booking, User, Review, ReviewImage, SpotImage } = require('../../db/models')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email')
      .exists({ checkFalsy: true })
      .withMessage("Invalid email"),
  check('username')
      .exists({ checkFalsy: true })
      .withMessage("Username is required"),
  check('firstName')
      .exists({ checkFalsy: true })
      .withMessage("First Name is required"),
  check('lastName')
      .exists({ checkFalsy: true })
      .withMessage("Last Name is required"),
  check('password')
      .exists({ checkFalsy: true })
      .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

  router.post(
    '',
    validateSignup,
    async (req, res) => {
      const { email, firstName, lastName, password, username } = req.body;
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ email, username, firstName, lastName, hashedPassword });

      const emailCheck = await User.findOne({ where : { email: email }})

      const userNameCheck = await User.findOne({ where: { username: username}})

      if(emailCheck){
        const err = new Error("User already exists")
        return res.json({
          message: err.message,
          statusCode: 500,
          errors: {email: "User with that email already exists"}
        })
      }

      if(userNameCheck){
        const err = new Error("User already exists")
        return res.json({
          message: err.message,
          statusCode: 500,
          errors: {username: "User with that username already exists"}
        })
      }

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
  );

  module.exports = router;
