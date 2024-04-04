const jwt = require("jsonwebtoken");
const jwtConfig = require('../configs/jwt.config');

const verify = (req, res, next) => {
  let authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized!" });
  }

  let split = authHeader.split(' ');
  if (split.length != 2) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  if (split[0] !== 'Bearer') {
    return res.status(401).send({ message: "Unauthorized" });
  }

  jwt.verify(split[1], jwtConfig.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: err.message });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  });
};

module.exports = {
  verify
}