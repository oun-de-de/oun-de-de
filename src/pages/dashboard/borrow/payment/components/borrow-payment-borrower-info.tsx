import { User } from "lucide-react";
import { Input } from "@/core/ui/input";
import { FormRow } from "@/pages/dashboard/borrow/components/borrow-form-row";
import { SectionHeader } from "@/pages/dashboard/borrow/components/borrow-section-header";

interface BorrowPaymentBorrowerInfoProps {
	borrowerName: string;
	setBorrowerName: (value: string) => void;
	phone: string;
	setPhone: (value: string) => void;
	idCard: string;
	setIdCard: (value: string) => void;
}

export function BorrowPaymentBorrowerInfo({
	borrowerName,
	setBorrowerName,
	phone,
	setPhone,
	idCard,
	setIdCard,
}: BorrowPaymentBorrowerInfoProps) {
	return (
		<div className="p-6 pb-2">
			<SectionHeader icon={User} title="Borrower Information" />

			<div className="pl-2 space-y-1 max-w-2xl">
				<FormRow label="Borrower Name" required>
					<Input
						placeholder="Required..."
						value={borrowerName}
						onChange={(e) => setBorrowerName(e.target.value)}
						className="h-9 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
					/>
				</FormRow>

				<FormRow label="Contact / ID">
					<div className="flex gap-2 w-full">
						<Input
							placeholder="Phone..."
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							className="h-9 border-gray-200"
						/>
						<Input
							placeholder="ID Card..."
							value={idCard}
							onChange={(e) => setIdCard(e.target.value)}
							className="h-9 border-gray-200"
						/>
					</div>
				</FormRow>
			</div>
		</div>
	);
}
