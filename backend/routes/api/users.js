// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a valid email.'),
  check('username')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a username with at least 4 characters.'),
  check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a firstName'),
  check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a lastName'),
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
