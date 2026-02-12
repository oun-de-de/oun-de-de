import type { ListState } from "@/core/store/createListStore";
import type { BaseState } from "@/core/types/state";

type BorrowType = "InitialState" | "UpdateState" | "ResetState";

export type BorrowState = BaseState<BorrowType> &
	ListState & {
		activeView: "all" | "requests";
	};

export const createBorrowInitialState = (): BorrowState => ({
	type: "InitialState",
	typeFilter: "all",
	fieldFilter: "refNo",
	searchValue: "",
	page: 1,
	pageSize: 10,
	activeView: "all",
});

export const _BorrowState = ({
	state,
	type,
	patch,
}: {
	state: BorrowState;
	type: BorrowType;
	patch?: Partial<Omit<BorrowState, "type">>;
}): BorrowState => ({
	type,
	typeFilter: patch?.typeFilter ?? state.typeFilter,
	fieldFilter: patch?.fieldFilter ?? state.fieldFilter,
	searchValue: patch?.searchValue ?? state.searchValue,
	page: patch?.page ?? state.page,
	pageSize: patch?.pageSize ?? state.pageSize,
	activeView: patch?.activeView ?? state.activeView,
});
