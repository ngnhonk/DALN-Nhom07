import { z } from "zod";

export const commonValidations = {
  id: z
    .string({
      required_error: "ID cannot be empty",
      invalid_type_error: "ID must be a string",
    })
    .length(10, "ID must be exactly 10 characters"),

  text: z
    .string({
      required_error: "Text cannot be empty",
      invalid_type_error: "Text must be a string",
    })
    .refine((val) => val.trim().length > 0, {
      message: "Text cannot be empty",
    }),

  address: z
    .string({
      required_error: "Address cannot be empty",
      invalid_type_error: "Type error",
    })
    .refine((val) => val.trim().length > 0, {
      message: "Address cannot be empty",
    }),

  position: z.number({
    required_error: "Latitude cannot be empty",
    invalid_type_error: "Latitude must be a number",
  }),

  email: z
    .string({
      required_error: "Email cannot be empty",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email format"),

  name: z
    .string({
      required_error: "Name cannot be empty",
      invalid_type_error: "Name must be a string",
    })
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),

  phone: z
    .string({
      required_error: "Phone number cannot be empty",
      invalid_type_error: "Phone number must be a string",
    })
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),

  password: z
    .string({
      required_error: "Password cannot be empty",
      invalid_type_error: "Password must be a valid string",
    })
    .min(8, "Password must be at least 8 characters"),

  date_of_birth: z
    .date(),

  DataTransferItem: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    return arg;
  }, z.date({ required_error: "Date is required" })),
  role: z.enum(["admin", "user"], {
    errorMap: () => ({
      message: "Role must be either 'user' or 'admin'",
    }),
  }),

  link: z
    .string({
      required_error: "Link cannot be empty",
      invalid_type_error: "Link must be a valid string",
    })
    .url("Invalid URL format"),

  otp_code: z
    .string({
      required_error: "OTP code cannot be empty",
      invalid_type_error: "OTP code must be a string",
    })
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),

  number: z.number({
    required_error: "Number cannot be empty",
    invalid_type_error: "Value must be a number",
  }),
  positive_number: z.number({
    required_error: "Number cannot be empty",
    invalid_type_error: "Value must be a number",
  }).min(0, "Number must be positive"),

  remember_me: z.boolean({
    required_error: "Remember me is required",
    invalid_type_error: "Remember me must be true or false",
  }),

  PaymentMethodEnum: z.enum(["momo", "zalopay", "vnpay", "bank"]),
  PaymentStatusEnum: z.enum(["success", "failed", "pending"]),
  BusTypeEnum: z.enum(['giuong_nam', 'ghe_ngoi']),

  plate_number: z.string().min(1, "Plate number is required").max(20)
};
