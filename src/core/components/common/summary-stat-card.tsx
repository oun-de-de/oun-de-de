import styled from "styled-components";
import Icon from "@/core/components/icon/icon";
import type { SummaryStatCardData } from "@/core/types/common";
import { Text, Title } from "@/core/ui/typography";
import { formatNumber } from "@/core/utils/formatters";

const CardRoot = styled.div.attrs({
	className: "flex items-center justify-between rounded-lg border px-2.5 py-1.5",
})``;

const LabelText = styled(Text).attrs({
	variant: "caption",
	className: "text-[11px] text-slate-500 leading-4",
})``;

const ValueTitle = styled(Title).attrs({
	as: "h6",
	className: "text-sm font-bold leading-5",
})``;

const IconWrap = styled.span.attrs<{ $color: string }>(({ $color }) => ({
	className: `flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-md text-white ${$color}`,
}))``;

export function SummaryStatCard({ label, value, color, icon }: SummaryStatCardData) {
	const displayValue = typeof value === "number" ? formatNumber(value) : value;

	return (
		<CardRoot>
			<div className="min-w-0 pr-2">
				<LabelText>{label}</LabelText>
				<ValueTitle>{displayValue}</ValueTitle>
			</div>
			<IconWrap $color={color}>
				<Icon icon={icon} size={14} />
			</IconWrap>
		</CardRoot>
	);
}
