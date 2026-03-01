import styled from "styled-components";
import Icon from "@/core/components/icon/icon";
import type { SummaryStatCardData } from "@/core/types/common";
import { Text, Title } from "@/core/ui/typography";
import { formatNumber } from "@/core/utils/formatters";

const CardRoot = styled.div.attrs({
	className: "flex items-center justify-between rounded-lg border px-4 py-3",
})``;

const LabelText = styled(Text).attrs({
	variant: "caption",
	className: "text-slate-500",
})``;

const ValueTitle = styled(Title).attrs({
	as: "h6",
	className: "text-lg font-bold",
})``;

const IconWrap = styled.span.attrs<{ $color: string }>(({ $color }) => ({
	className: `flex h-10 w-10 items-center justify-center rounded-lg text-white ${$color}`,
}))``;

export function SummaryStatCard({ label, value, color, icon }: SummaryStatCardData) {
	const displayValue = typeof value === "number" ? formatNumber(value) : value;

	return (
		<CardRoot>
			<div>
				<LabelText>{label}</LabelText>
				<ValueTitle>{displayValue}</ValueTitle>
			</div>
			<IconWrap $color={color}>
				<Icon icon={icon} size={18} />
			</IconWrap>
		</CardRoot>
	);
}
