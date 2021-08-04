const { SECRET_KEY } = require("../constants");
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  let token = req.header("x-mover-token");
  jwt.verify(token, SECRET_KEY, function (err, decoded) {
    if (err) {
      return next(new Error("Please log in"));
    }
    req.user = decoded;
    next();
  });
};
