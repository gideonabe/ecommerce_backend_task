const validate = (schema, source = "body") => async (req, res, next) => {
  try {
    const data = await schema.parseAsync(req[source]);
    req[source === "params" ? "validatedParams" : source === "query" ? "validatedQuery" : "validatedData"] = data;
    next();
  } catch (error) {
    next(error);
  }
};

export const validateBody = (schema) => validate(schema, "body");
export const validateParams = (schema) => validate(schema, "params");
export const validateQuery = (schema) => validate(schema, "query");

export default validateBody;
