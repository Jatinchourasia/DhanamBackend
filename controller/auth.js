const User = require("../modal/user");
require("dotenv").config();
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADDRESS,
    pass: process.env.HASH,
  },
});

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });
    // mail send

    // send response to front end
    const { _id, name, email } = user;

    const mailOptions = {
      from: `"Authentication" <${process.env.ADDRESS}>`,
      to: email,
      subject: "Welcome ",
      html: `<h1>Welcome ${name}</h1><p>you are successfuly Signed Up !</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
    return res.json({
      token,
      user: { _id, name, email },
      message: "email sent successfully",
    });
  });
};
