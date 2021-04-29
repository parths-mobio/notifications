var mongoose = require("mongoose");
const crypto = require("crypto");

const { isEmail }= require('validator');

//const uuid = require("uuid/package.json");

const { ObjectId } = mongoose.Schema;

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: [ isEmail, 'invalid email' ],
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    mobile: {
      type: Number,
      trim: true,
      required: true,
      unique: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: ObjectId,
      ref: "userRole",
      required: true,
    },
    // role: {
    //   type: String,
    //   default: "user",
    // },
   
    photo: {
      data: Buffer,
      contentType: String
    },
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = "123";
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  autheticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function (plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
