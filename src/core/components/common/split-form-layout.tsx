import type { ReactNode } from "react";
import { cn } from "@/core/utils";

interface SplitFormLayoutProps {
	/** Title displayed in the header */
	title?: ReactNode;
	/** Optional content in the header (actions, etc) */
	headerActions?: ReactNode;
	/** Content for the left (main) column */
	children: ReactNode;
	/** Content for the right (side) column */
	rightPanel: ReactNode;
	/** Width of the right panel, defaults to 350px */
	rightPanelWidth?: string;
	/** Custom class for the root container */
	className?: string;
	/** Whether to show the top border on the right panel (for consistency) */
	showRightPanelBorder?: boolean;
}

export function SplitFormLayout({
	title,
	headerActions,
	children,
	rightPanel,
	rightPanelWidth = "350px",
	className,
	showRightPanelBorder = false,
}: SplitFormLayoutProps) {
	return (
		<div className={cn("h-full flex flex-col bg-white overflow-hidden", className)}>
			{/* Top Bar / Header */}
			<div className="h-14 border-b flex items-center justify-between px-4 bg-white shrink-0">
				<div className="flex items-center gap-2">
					{typeof title === "string" ? (
						<h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">{title}</h1>
					) : (
						title
					)}
				</div>
				<div className="flex items-center gap-2">{headerActions}</div>
			</div>

			{/* Main Content: Split View */}
			<div className="flex-1 flex min-h-0">
				{/* LEFT COLUMN: Main Form & Items */}
				<div className="flex-1 flex flex-col border-r h-full overflow-hidden">{children}</div>

				{/* RIGHT COLUMN: Side Panel */}
				<div
					className={cn(
						"flex flex-col h-full bg-white z-10",
						// Using a shadow to separate if needed, or just the border-l from the left col (which is border-r)
						"shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]",
						showRightPanelBorder && "border-t",
					)}
					style={{ width: rightPanelWidth }}
				>
					{rightPanel}
				</div>
			</div>
		</div>
	);
}
