import { z } from "zod";

// Re-export zodResolver for convenience
export { zodResolver } from "@hookform/resolvers/zod";

// Common string schemas
export const requiredString = (fieldName = "This field") => z.string().min(1, { message: `${fieldName} is required` });

export const optionalString = z.string().optional();

export const emailString = (fieldName = "Email") =>
	z
		.string()
		.min(1, { message: `${fieldName} is required` })
		.email({ message: "Invalid email format" });

// Common number schemas
export const requiredNumber = (fieldName = "This field") =>
	z.number({ required_error: `${fieldName} is required` }).positive({ message: `${fieldName} must be positive` });

export const optionalNumber = z.number().optional();

// Common boolean schema
export const optionalBoolean = z.boolean().optional().default(false);

// Utility to create settings item schema
export const createSettingsSchema = () =>
	z.object({
		name: requiredString("Name"),
		code: optionalString,
		type: optionalString,
		description: optionalString,
		isActive: optionalBoolean,
	});

// Type inference helper
export type InferSchema<T extends z.ZodType> = z.infer<T>;
