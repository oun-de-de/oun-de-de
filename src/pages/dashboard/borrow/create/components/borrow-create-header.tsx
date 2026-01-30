import { PlusCircle } from "lucide-react";

export function BorrowCreateHeader() {
	return (
		<div className="h-10 border-b flex items-center px-4 bg-white shrink-0 justify-between">
			<div className="flex gap-1">
				<div className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase rounded border border-blue-100 flex items-center gap-1.5 cursor-pointer">
					<PlusCircle className="w-3 h-3" /> New Transaction
				</div>
			</div>
			<div className="flex gap-1">
				<div className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-bold uppercase rounded border border-gray-200 cursor-pointer hover:bg-gray-100">
					Borrowed List
				</div>
			</div>
		</div>
	);
}
