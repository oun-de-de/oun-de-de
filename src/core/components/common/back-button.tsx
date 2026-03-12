import { Icon } from "@/core/components/icon";
import { Button, type ButtonProps } from "@/core/ui/button";
import { cn } from "@/core/utils";

type BackButtonAppearance = "default" | "icon" | "link";

interface BackButtonProps extends Omit<ButtonProps, "children"> {
	label?: string;
	appearance?: BackButtonAppearance;
	icon?: string;
}

const APPEARANCE_STYLES: Record<
	BackButtonAppearance,
	{ variant: ButtonProps["variant"]; size: ButtonProps["size"]; className: string }
> = {
	default: {
		variant: "outline",
		size: "sm",
		className: "gap-2 text-gray-700",
	},
	icon: {
		variant: "outline",
		size: "sm",
		className: "text-gray-700",
	},
	link: {
		variant: "link",
		size: "none",
		className: "justify-start gap-2 px-0 text-accent-foreground",
	},
};

export function BackButton({
	label = "Back",
	appearance = "default",
	icon = "solar:alt-arrow-left-linear",
	className,
	type = "button",
	...props
}: BackButtonProps) {
	const style = APPEARANCE_STYLES[appearance];

	return (
		<Button type={type} variant={style.variant} size={style.size} className={cn(style.className, className)} {...props}>
			<Icon icon={icon} size={18} />
			{appearance !== "icon" && <span>{label}</span>}
		</Button>
	);
}
