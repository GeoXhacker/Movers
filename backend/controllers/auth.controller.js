const Joi = require("@hapi/joi");
const context = require("../context");
const xtend = require("xtend");
const randomize = require("randomatic");
const Users = require("../models/user");
const MoveOrders = require("../models/orders");
const sendSms = require("../utils/softphone");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../constants");
const Utils = require("../utils");

exports.authenticate = function (req, res, next) {
  let Schema = Joi.object({
    phone: Joi.string()
      .required()
      .custom((value, helper) => {
        let isValid = Utils.validatePhoneNumber(req.body.phone);
        if (!isValid) {
          return helper.message("INVALID PHONE NUMBER");
        }
        return true;
      }),
    username: Joi.string().required(),
  });

  let validitions = Schema.validate(req.body);

  // console.log(Utils.validatePhoneNumber(req.body.phone));
  // return console.log(Users.findOne({ username: req.body.username }));

  if (validitions.error) {
    return next(new Error(validitions.error.details[0].message));
  }

  //if user already exists. but there is an issue if the user is not found; find away to solve it
  return Users.findOne({ phone: req.body.phone }, (err, user) => {
    if (err === null) {
      console.log(err, "user doesnt exist");

      let data = xtend(req.body, {
        code: randomize("0", 5),
      });

      console.log(data);

      if (process.env.NODE_ENV !== "production") {
        console.log(data);
      }

      context.pendingAuth.set(req.body.phone, data);

      sendSms(
        data.phone,
        `${data.username}, Your activation code is ${data.code}`,
        function (result) {}
      );

      res.json({ message: "success" });
    } else {
      var token = jwt.sign({ id: user._id }, SECRET_KEY);

      MoveOrders.find({ userId: user.id }, (err, moveOrders) => {
        // console.log(moveOrders, "here");

        res.json({
          message: "Authentication succeeded",
          token,
          moveOrders,
          userInfo: user,
          exist: true,
        });
      });
    }
  });

  let data = xtend(req.body, {
    code: randomize("0", 5),
  });

  if (process.env.NODE_ENV !== "production") {
    console.log(data);
  }

  context.pendingAuth.set(req.body.phone, data);

  // return console.log(context.pendingAuth.set(req.body.phone, data));

  sendSms(
    data.phone,
    `${data.username}, Your activation code is ${data.code}`,
    function (result) {}
  );

  res.json({ message: "success" });
};

exports.verify = async function (req, res, next) {
  let { phone, code } = req.params;
  let data = context.pendingAuth.get(phone);

  if (!data) {
    return next(new Error("Authentication failed"));
  }

  function response(user) {
    var token = jwt.sign({ id: user._id }, SECRET_KEY);
    res.json({
      message: "Authentication succeeded",
      token,
      userInfo: { ...data, id: user._id },
    });
  }

  if (Number(data.code) === Number(code)) {
    let found = await Users.findOne({ phone });
    if (found) {
      let update = await Users.findOneAndUpdate(
        { phone },
        {
          lastLogin: new Date(),
        }
      );
      return response(found);
    }

    let addUser = new Promise((resolve, reject) => {
      let user = new Users(data);
      user.save((err, record) => {
        if (err) return reject(err);
        resolve(record);
      });
    });

    addUser.then(response).catch((e) => {
      next(new Error(e.message));
    });
  } else {
    next(new Error("Invalid code"));
  }
};
