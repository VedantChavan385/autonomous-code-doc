export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    let parsedErrors;
    try {
      parsedErrors = error.errors || error.issues || JSON.parse(error.message);
    } catch {
      parsedErrors = error.message;
    }
    
    return res.status(400).json({
      message: 'Validation failed',
      errors: parsedErrors
    });
  }
};
