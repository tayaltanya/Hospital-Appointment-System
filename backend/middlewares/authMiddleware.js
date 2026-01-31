const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token provided",
      });
    }

    JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Auth Failed",
        });
      } else {
        // ✅ FIX IS HERE
        req.user = { id: decoded.id };
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Auth Failed",
    });
  }
};
