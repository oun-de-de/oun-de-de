import { Wallet } from "lucide-react";

export function BorrowPaymentHeader() {
	return (
		<div className="h-10 border-b flex items-center px-4 bg-white shrink-0 justify-between">
			<div className="flex gap-1">
				<div className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase rounded border border-blue-100 flex items-center gap-1.5 cursor-pointer">
					<Wallet className="w-3 h-3" /> Payment Details
				</div>
			</div>
		</div>
	);
}
