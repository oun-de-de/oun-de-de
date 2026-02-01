import type React from "react";
import { Label } from "@/core/ui/label";
import { Switch } from "@/core/ui/switch";
import { cn } from "@/core/utils";
import { FormControllerField } from "./form-controller-field";

type FormSwitchProps = {
	name: string;
	label?: React.ReactNode;
	helperText?: React.ReactNode;
	containerClassName?: string;
	switchClassName?: string;
	disabled?: boolean;
};

export function FormSwitch({
	name,
	label,
	helperText,
	containerClassName,
	switchClassName,
	disabled,
}: FormSwitchProps) {
	return (
		<FormControllerField
			name={name}
			helperText={helperText}
			containerClassName={containerClassName}
			render={({ value, onChange }) => (
				<div className="flex items-center gap-2">
					<Switch
						id={name}
						checked={value as boolean}
						onCheckedChange={onChange}
						disabled={disabled}
						className={cn(switchClassName)}
					/>
					{label && (
						<Label htmlFor={name} className="text-sm font-medium cursor-pointer">
							{label}
						</Label>
					)}
				</div>
			)}
		/>
	);
}
