const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    User.findUserByEmail(email, async (err, result) => {
      if (result.length > 0) {
        return res.status(400).json({
          message: "Email already exists"
        });
      }

      const hashedPassword =
        await bcrypt.hash(password, 10);

      User.createUser(
        {
          full_name,
          email,
          password: hashedPassword,
          role
        },
        (err) => {
          if (err) {
            return res.status(500).json(err);
          }

          res.status(201).json({
            message: "User Registered Successfully"
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByEmail(email, async (err, result) => {
    if (result.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const user = result[0];

    const isMatch =
      await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      token,
      user
    });
  });
};