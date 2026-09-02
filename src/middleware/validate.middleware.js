const validate = (schema) => async (req, res, next) => {
  try {
    req.validatedData = await schema.parseAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export default validate;
