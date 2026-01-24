import { Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button, type ButtonProps } from "@/core/ui/button";
import { cn } from "@/core/utils";

type FormActionsProps = {
	submitLabel?: string;
	cancelLabel?: string;
	onCancel?: () => void;
	showCancel?: boolean;
	disableWhenClean?: boolean;
	className?: string;
	submitButtonProps?: Omit<ButtonProps, "type" | "disabled" | "children">;
	cancelButtonProps?: Omit<ButtonProps, "type" | "onClick" | "children">;
};

export function FormActions({
	submitLabel = "Save",
	cancelLabel = "Cancel",
	onCancel,
	showCancel = true,
	disableWhenClean = false,
	className,
	submitButtonProps,
	cancelButtonProps,
}: FormActionsProps) {
	const {
		formState: { isSubmitting, isDirty },
	} = useFormContext();

	const isSubmitDisabled = isSubmitting || (disableWhenClean && !isDirty);

	return (
		<div className={cn("flex justify-end gap-2 pt-4 border-t", className)}>
			{showCancel && (
				<Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} {...cancelButtonProps}>
					{cancelLabel}
				</Button>
			)}
			<Button type="submit" disabled={isSubmitDisabled} {...submitButtonProps}>
				{isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
				{submitLabel}
			</Button>
		</div>
	);
}
