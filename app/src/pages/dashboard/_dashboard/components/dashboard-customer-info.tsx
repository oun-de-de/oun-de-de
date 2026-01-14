import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import { Badge, badgeVariants } from "@/ui/badge";
import type { VariantProps } from "class-variance-authority";
import { styled } from "styled-components";

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

type CustomerSummaryItem = {
	id: string;
	label: string;
	value: string | number;
	variant: BadgeVariant;
	icon: string;
};

// TODO: replace with real API call
function useCustomerSummary(): CustomerSummaryItem[] {
	const [items, setItems] = useState<CustomerSummaryItem[]>([]);

	useEffect(() => {
		const mock: CustomerSummaryItem[] = [
			{ id: "deposit", label: "Deposit Balance", value: "0 ₺", variant: "info", icon: "solar:dollar-bold" },
			{ id: "sale-order", label: "Sale Order", value: "0 ₺", variant: "success", icon: "solar:users-group-rounded-bold" },
			{ id: "invoice", label: "Invoice", value: "398,631,700 ₺", variant: "warning", icon: "solar:bill-list-bold" },
			{ id: "overdue", label: "Overdue", value: "0 ₺", variant: "destructive", icon: "solar:bill-cross-bold" },
		];
		setItems(mock);
	}, []);

	return items;
}

export default function DashboardCustomerInfo() {
	const items = useCustomerSummary();

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
			{items.map((item) => (
				<Badge
					key={item.id}
					variant={item.variant}
                    shape="square"
					className="flex items-center justify-between w-full p-0 border-none"
				>
					<div className="flex items-center gap-3 h-full">
						<StyledBadgeIconWrapper className="flex h-full w-10 items-center justify-center bg-white/20">
							<Icon icon={item.icon} size={24} />
						</StyledBadgeIconWrapper>
						<div className="flex flex-col py-1">
							<span className="text-lg font-semibold">{item.label}</span>
							<span className="text-lg font-semibold">{item.value}</span>
						</div>
					</div>
				</Badge>
			))}
		</div>
	);
}

//#region Styled Components
const StyledBadgeIconWrapper = styled.div`
    border-left-radius: 6px;
`;
//#endregion