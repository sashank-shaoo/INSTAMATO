const validate = (schema) => {
  return (req, res, next) => {
    const options = {
      abortEarly: false, // return all errors, not just first
      allowUnknown: false, // do not allow extra fields
      stripUnknown: true, // remove unknown fields
    };

    const { error, value } = schema.validate(req.body, options);

    if (error) {
      return res.status(400).json({
        type: "error",
        message: error.details[0].message, // show first error
      });
    }

    req.body = value; // sanitized & validated input
    next();
  };
};

module.exports = validate;
