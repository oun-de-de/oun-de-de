import { couponSummaryCards } from "@/_mock/data/dashboard";
import { SmartDataTable, SummaryStatCard } from "@/core/components/common";
import Icon from "@/core/components/icon/icon";
import type { Coupon } from "@/core/types/coupon";
import { Button } from "@/core/ui/button";
import { Text } from "@/core/ui/typography";
import type { CouponState } from "../stores/coupon-state";
import { columns } from "./coupon-columns";
import { useNavigate } from "react-router";

type CouponContentProps = {
	activeCustomerName: string | null | undefined;
	listState: CouponState;
	updateState: (state: Partial<CouponState>) => void;
	pagedCoupons: Coupon[];
	totalItems: number;
	totalPages: number;
	currentPage: number;
	paginationItems: Array<number | "...">;
	isLoading?: boolean;
};

const summaryCards = couponSummaryCards;

export function CouponContent({
	activeCustomerName,
	listState,
	updateState,
	pagedCoupons,
	totalItems,
	totalPages,
	currentPage,
	paginationItems,
}: CouponContentProps) {
	const navigate = useNavigate();
	// const activeCoupon = pagedCoupons.find((item) => item.id === activeCouponId);

	return (
		<>
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<Button size="sm" className="gap-1">
						<Icon icon="mdi:ticket-percent-outline" />
						Coupons
					</Button>
					<Text variant="body2" className="text-muted-foreground">
						{activeCustomerName ? `${activeCustomerName} selected` : "No customer selected"}
					</Text>
				</div>
				<div className="flex items-center gap-2">
					<Button size="sm" onClick={() => navigate("/dashboard/coupons/create")}>
						Create Coupons
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
				{summaryCards.map((card) => (
					<SummaryStatCard key={card.label} {...card} />
				))}
			</div>

			<SmartDataTable
				className="flex-1 min-h-0"
				maxBodyHeight="100%"
				data={pagedCoupons}
				columns={columns}
				enableFilterBar={false}
				paginationConfig={{
					page: currentPage,
					pageSize: listState.pageSize,
					totalItems: totalItems,
					totalPages: totalPages,
					paginationItems: paginationItems,
					onPageChange: (nextPage: number) => updateState({ page: nextPage }),
					onPageSizeChange: (nextSize: number) => updateState({ pageSize: nextSize, page: 1 }),
				}}
			/>
		</>
	);
}
