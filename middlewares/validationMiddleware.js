
const validate = (schema, property = "body") => (req, res, next) => {
  const { error } = schema.validate(req[property], {
    abortEarly: false, 
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.context.key,
      message: detail.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

export default validate;
