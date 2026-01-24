import type React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormField } from "./form-field";

type FormControllerFieldProps = {
	name: string;
	label?: React.ReactNode;
	helperText?: React.ReactNode;
	requiredMark?: boolean;
	containerClassName?: string;
	labelClassName?: string;
	helperClassName?: string;
	errorClassName?: string;
	render: (params: {
		value: unknown;
		onChange: (value: unknown) => void;
		onBlur: () => void;
		error?: string;
		name: string;
	}) => React.ReactElement;
};

export function FormControllerField({
	name,
	label,
	helperText,
	requiredMark,
	containerClassName,
	labelClassName,
	helperClassName,
	errorClassName,
	render,
}: FormControllerFieldProps) {
	const { control } = useFormContext();

	return (
		<FormField
			name={name}
			label={label}
			helperText={helperText}
			requiredMark={requiredMark}
			containerClassName={containerClassName}
			labelClassName={labelClassName}
			helperClassName={helperClassName}
			errorClassName={errorClassName}
		>
			{({ error }) => (
				<Controller
					name={name}
					control={control}
					render={({ field }) =>
						render({
							value: field.value,
							onChange: field.onChange,
							onBlur: field.onBlur,
							error,
							name: field.name,
						})
					}
				/>
			)}
		</FormField>
	);
}
