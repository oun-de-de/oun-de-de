
import { useEffect, useState } from "react";
import { Badge, badgeVariants } from "@/ui/badge";
import type { VariantProps } from "class-variance-authority";
import { styled } from "styled-components";
import { rgbAlpha } from "@/utils/theme";

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

type PerformanceItem = {
	id: string;
	label: string;
	value: string | number;
	variant: BadgeVariant;
};

// TODO: Replace with real API call for performance summary
function usePerformanceSummary(): PerformanceItem[] {
	const [items, setItems] = useState<PerformanceItem[]>([]);

	useEffect(() => {
		const mock: PerformanceItem[] = [
			{
				id: "income",
				label: "Income",
				value: "255,180,200 ₺",
				variant: "info",
			},
			{
				id: "expenses",
				label: "Expenses",
				value: "39,366,200 ₺",
				variant: "warning",
			},
			{
				id: "net-income",
				label: "Net Income",
				value: "215,814,000 ₺",
				variant: "success",
			},
		];
		setItems(mock);
	}, []);

	return items;
}

export default function DashboardPerformance() {
	const items = usePerformanceSummary();

	return (
		<StyledPerformanceWrapper>
			{items.map((item) => (
				<StyledPerformanceItem
					key={item.id}
					className="flex items-center justify-between bg-white"
				>
					<div className="flex items-center gap-3">
						<Badge
							variant={item.variant}
							shape="dot"
							className="h-6 w-1 p-0 border-none shadow-none"
							aria-hidden="true"
						/>
						<StyledPerformanceItemLabel>{item.label}</StyledPerformanceItemLabel>
					</div>
					<Badge variant={item.variant} className="rounded-md px-2">
                        <StyledPerformanceItemValue>{item.value}</StyledPerformanceItemValue>
					</Badge>
				</StyledPerformanceItem>
			))}
		</StyledPerformanceWrapper>
	);
}

//#region Styled Components
const StyledPerformanceWrapper = styled.div`
    border-top: 1px solid ${({ theme }) => rgbAlpha(theme.colors.palette.gray[400], 0.4)};
`;
const StyledPerformanceItem = styled.div`
    padding: 0.5rem 0;
    border-bottom: 1px solid ${({ theme }) => rgbAlpha(theme.colors.palette.gray[400], 0.4)};
`;
const StyledPerformanceItemLabel = styled.span`
    font-size: ${({ theme }) => `${theme.typography.fontSize.default}px`};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.palette.gray[600]};
`;
const StyledPerformanceItemValue = styled.span`
    font-size: ${({ theme }) => `${theme.typography.fontSize.default}px`};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.common.white};
`;
//#endregion