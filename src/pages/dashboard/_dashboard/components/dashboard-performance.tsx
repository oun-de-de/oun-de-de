import { useEffect } from "react";
import { styled } from "styled-components";
import { rgbAlpha } from "@/core/utils/theme";
import PerformanceCard, { PerformanceLoadingCard } from "./card/performance-card";
import { ErrorState, isErrorState, isLoadingState } from "@/core/types/state";
import { useStore } from "@/core/ui/multi-store-provider";
import { PerformanceStore } from "../stores/performance/performance-store";

export default function DashboardPerformance() {
	const { useState, useAction } = useStore<PerformanceStore>("performance");
	const state = useState();

	const { fetch } = useAction();

	useEffect(() => {
		void fetch();
	}, [fetch]);

	if (isLoadingState(state) && state.list.length === 0) {
		return <PerformanceLoadingCard />;
	}

	if (isErrorState(state)) {
		const errorState = state as ErrorState;
		return (
			<div className="flex h-[120px] items-center justify-center text-sm text-red-500">{errorState.error.message}</div>
		);
	}

	return (
		<StyledPerformanceWrapper>
			{state.list.map((item) => (
				<PerformanceCard key={item.id} item={item} />
			))}
		</StyledPerformanceWrapper>
	);
}

//#region Styled Components
const StyledPerformanceWrapper = styled.div`
    border-top: 1px solid ${({ theme }) => rgbAlpha(theme.colors.palette.gray[400], 0.4)};
`;
//#endregion
