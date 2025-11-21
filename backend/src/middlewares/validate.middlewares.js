const validate = (schema) => {
  return (req, res, next) => {
    // 🔍 Debug: print the schema being used
    console.log("\n========== VALIDATION DEBUG ==========");
    console.log("USING SCHEMA:", schema.describe().keys);
    console.log("REQ BODY BEFORE VALIDATION:", req.body);
    console.log("=======================================\n");

    const options = {
      abortEarly: false, // return all errors
      allowUnknown: false, // do not allow extra fields
      stripUnknown: true, // remove fields not in schema
    };

    const { error, value } = schema.validate(req.body, options);

    if (error) {
      return res.status(422).json({
        type: "error",
        message: error.details[0].message,
      });
    }

    req.body = value;
    next();
  };
};

module.exports = validate;
