import { z } from "zod";

export const patientFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),

  // Date of Birth: Use refine to validate date is not in the future
  dateOfBirth: z.string().refine((date) => new Date(date) <= new Date(), {
    message: "Date of birth cannot be in the future",
  }),

  gender: z.enum(["male", "female", "other"] as const, {
    message: "Please select a gender",
  }),

  // Phone: Use regex to validate phone number (supports 10 digits)
  phoneNumber: z.string().regex(/^\d{9,10}$/, "Invalid phone number format"),

  email: z.string().email("Invalid email address"),

  address: z.string().min(5, "Address must be at least 5 characters"),

  preferredLanguage: z.string().min(1, "Preferred language is required"),

  nationality: z.string().min(1, "Nationality is required"),

  // Optional Fields
  religion: z.string().optional(),

  // Emergency Contact (Optional but if filled, name is preferred)
  emergencyContactName: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
});

// Create type from schema to use in TypeScript (no need to write interface again)
export type PatientFormData = z.infer<typeof patientFormSchema>;
