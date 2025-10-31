const Joi = require("joi");

// Validación para leads
const leadSchema = Joi.object({
  full_name: Joi.string().max(200).required().messages({
    "string.empty": "Full name is required",
    "string.max": "Full name must not exceed 200 characters",
    "any.required": "Full name is required",
  }),
  email: Joi.string().email().max(200).required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
    "string.max": "Email must not exceed 200 characters",
    "any.required": "Email is required",
  }),
  subject: Joi.string().max(200).required().messages({
    "string.empty": "Subject is required",
    "string.max": "Subject must not exceed 200 characters",
    "any.required": "Subject is required",
  }),
  message: Joi.string().max(200).required().messages({
    "string.empty": "Message is required",
    "string.max": "Message must not exceed 200 characters",
    "any.required": "Message is required",
  }),
});

// Validación para newsletter subscribers
const newsletterSchema = Joi.object({
  email: Joi.string().email().max(200).required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
    "string.max": "Email must not exceed 200 characters",
    "any.required": "Email is required",
  }),
});

// Validación para businesses
const businessSchema = Joi.object({
  name: Joi.string().max(200).required().messages({
    "string.empty": "Business name is required",
    "string.max": "Business name must not exceed 200 characters",
    "any.required": "Business name is required",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),
  address: Joi.string().allow("", null).optional(),
  phone: Joi.string().max(20).allow("", null).optional(),
  email: Joi.string().email().max(100).allow("", null).optional(),
  website: Joi.string().uri().max(200).allow("", null).optional(),
  category_id: Joi.number().integer().optional(),
  opening_hours: Joi.string().allow("", null).optional(),
  latitude: Joi.number().min(-90).max(90).allow(null).optional(),
  longitude: Joi.number().min(-180).max(180).allow(null).optional(),
});

// Validación para categories
const categorySchema = Joi.object({
  name: Joi.string().max(100).required().messages({
    "string.empty": "Category name is required",
    "string.max": "Category name must not exceed 100 characters",
    "any.required": "Category name is required",
  }),
  description: Joi.string().allow("", null).optional(),
});

// Middleware genérico de validación
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    req.validatedData = value;
    next();
  };
};

module.exports = {
  validate,
  leadSchema,
  newsletterSchema,
  businessSchema,
  categorySchema,
};
