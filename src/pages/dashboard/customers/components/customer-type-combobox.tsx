import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/ui/select";
import { PAYMENT_TERM_FILTER_OPTIONS } from "../utils/customer-utils";

type PaymentTermSelectProps = {
	value: string;
	onChange: (value: string) => void;
};

export function CustomerTypeCombobox({ value, onChange }: PaymentTermSelectProps) {
	return (
		<Select value={value || undefined} onValueChange={onChange}>
			<SelectTrigger className="w-full" aria-label="Payment Term">
				<SelectValue placeholder="Payment Term" />
			</SelectTrigger>
			<SelectContent>
				{PAYMENT_TERM_FILTER_OPTIONS.map((item) => (
					<SelectItem key={item.value} value={item.value}>
						{item.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
