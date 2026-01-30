import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/core/ui/button";

interface BorrowPaymentLayoutProps {
	header: ReactNode;
	children: ReactNode;
	rightPanel: ReactNode;
}

export function BorrowPaymentLayout({ header, children, rightPanel }: BorrowPaymentLayoutProps) {
	const navigate = useNavigate();

	return (
		<div className="h-full bg-gray-100 flex flex-col p-2 gap-2">
			{/* Top Navigation / Breadcrumb Area */}
			<div className="flex items-center justify-between px-2 pt-1 pb-4">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-white font-bold text-xs">
						POS
					</div>
					<div className="flex flex-col">
						<h1 className="text-sm font-bold text-gray-700 uppercase leading-none mb-1">Checkout Transaction</h1>
						<span className="text-[10px] text-gray-400 font-medium">Dashboard / Borrow / Checkout</span>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button
						size="sm"
						variant="outline"
						className="h-8 gap-2 border-gray-300 text-gray-600"
						onClick={() => navigate("../new")}
					>
						<ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
					</Button>
				</div>
			</div>

			{/* Main Window Card */}
			<div className="flex-1 bg-white rounded-t shadow-sm border border-gray-200 flex flex-col overflow-hidden">
				{/* Window Header */}
				{header}

				<div className="flex-1 flex min-h-0">
					{/* Main Content Area - Rabbit POS Style Form */}
					<div className="flex-1 flex flex-col h-full bg-white border-r border-gray-200 overflow-hidden">
						{children}
					</div>
					{/* Right Panel */}
					<div className="w-[320px] bg-white z-10 flex flex-col">{rightPanel}</div>
				</div>
			</div>
		</div>
	);
}
