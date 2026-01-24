import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

/**
 * Apply server-side validation errors to form fields
 *
 * @example
 * ```tsx
 * const { setError } = useForm();
 *
 * try {
 *   await api.submit(data);
 * } catch (error) {
 *   if (error.fieldErrors) {
 *     applyServerErrors(setError, error.fieldErrors);
 *   }
 * }
 * ```
 */
export function applyServerErrors<T extends FieldValues>(
	setError: UseFormSetError<T>,
	fieldErrors?: Record<string, string>,
): void {
	if (!fieldErrors) return;

	for (const [fieldName, message] of Object.entries(fieldErrors)) {
		setError(fieldName as Path<T>, {
			type: "server",
			message,
		});
	}
}

/**
 * Type for API error response with field errors
 */
export type ServerValidationError = {
	message: string;
	fieldErrors?: Record<string, string>;
};

/**
 * Check if error is a server validation error
 */
export function isServerValidationError(error: unknown): error is ServerValidationError {
	return (
		typeof error === "object" &&
		error !== null &&
		"fieldErrors" in error &&
		typeof (error as ServerValidationError).fieldErrors === "object"
	);
}
