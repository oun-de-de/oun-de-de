import { createListStore, type ListState } from "@/core/store/createListStore";

const createInitialState = (): ListState => ({
	typeFilter: "all",
	fieldFilter: "all",
	searchValue: "",
	page: 1,
	pageSize: 10,
});

const useCashTransactionListStore = createListStore(createInitialState());

export const useCashTransactionList = () => useCashTransactionListStore((store) => store.state);

export const useCashTransactionListActions = () => useCashTransactionListStore((store) => store.actions);
