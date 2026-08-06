import { body, validationResult } from "express-validator";
// to make sure password has at least one lowercase, uppercase, number and special character
const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@$%&*])/;
const allowedRoles = ["receptionist", "nurse", "doctor", "admin"];
export const validateNewUser = [
  body("firstname")
    .trim()
    .isAlpha()
    .isLength({ min: 1 })
    .withMessage("Please provide your firstname"),
  body("lastname").trim().isAlpha().withMessage("Please provide your lastname"),
  body("email").trim().isEmail().withMessage("Please provide a valid email"),
  body("phone")
    .trim()
    .isMobilePhone()
    .isLength({ min: 11, max: 20 })
    .withMessage("Please provide a valid phone number"),
  body("role")
    .isIn(allowedRoles)
    .withMessage(`Role must be one of: ${allowedRoles.join(", ")}`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "failed", error: errors.array() });
    }
    next();
  },
];

export const validateChangePassword = [
  body("email").trim().isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .matches(regex)
    .withMessage("Please enter your current password"),
  body("password_confirm")
    .isLength({ min: 8 })
    .matches(regex)
    .withMessage(
      "Password must have at least one lowercase, uppercase, number and special character!",
    ),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("changePassword", {
        errors: [errors.array()],
        previous: req.body,
      });
    }
    next();
  },
];

export const validateCurrentUser = [
  body("email").trim().isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .matches(regex)
    .withMessage(
      "Password must have at least one lowercase, uppercase, number and special character!",
    ),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "failed", error: errors.array() });
    }
    next();
  },
];

export const validateUpdatePassword = [
  body("oldPassword")
    .isLength({ min: 8 })
    .matches(regex)
    .withMessage("Please enter your current password"),
  body("newPassword")
    .isLength({ min: 8 })
    .matches(regex)
    .withMessage(
      "Password must have at least one lowercase, uppercase, number and special character!",
    ),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: "failed", message: "Error", error: errors.array() });
    }
    next();
  },
];

export const validatePassword = [
  body("password")
    .isLength({ min: 8 })
    .matches(regex)
    .withMessage(
      "Password must have at least one lowercase, uppercase, number and special character!",
    ),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "failed", error: errors.array() });
    }
    next();
  },
];

export const validateUpdateUser = [
  body("password").custom((value) => {
    if (value !== undefined) {
      throw new Error("Admins are not allowed to change user passwords");
    }
    return true;
  }),
  body("firstname")
    .optional()
    .trim()
    .isAlpha()
    .isLength({ min: 1 })
    .withMessage("Please provide your firstname"),
  body("lastname")
    .optional()
    .trim()
    .isAlpha()
    .notEmpty()
    .withMessage("Please provide your lastname"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("phone")
    .optional()
    .trim()
    .isMobilePhone()
    .isLength({ min: 11, max: 20 })
    .withMessage("Please provide a valid phone number"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "failed", error: errors.array() });
    }
    next();
  },
];
