import type { ReactNode } from "react";

interface BorrowCreateLayoutProps {
	header: ReactNode;
	children: ReactNode;
	rightPanel: ReactNode;
}

export function BorrowCreateLayout({ header, children, rightPanel }: BorrowCreateLayoutProps) {
	return (
		// Wrapper to mimic the full page background and spacing of Rabbit POS
		<div className="h-full bg-gray-100 flex flex-col p-2 gap-2">
			{/* Main Window Card */}
			<div className="flex-1 bg-white rounded-t shadow-sm border border-gray-200 flex flex-col overflow-hidden">
				{/* Window Header */}
				{header}

				{/* Split Content */}
				<div className="flex-1 flex min-h-0">
					{/* LEFT PANEL: Filters (Form Style) and Table */}
					<div className="flex-1 flex flex-col border-r border-gray-200 overflow-hidden">{children}</div>

					{/* RIGHT PANEL: Cart (Tabs) */}
					<div className="w-[320px] bg-white z-10 flex flex-col">{rightPanel}</div>
				</div>
			</div>
		</div>
	);
}
