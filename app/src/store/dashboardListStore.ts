import { create } from "zustand";

export type DashboardListKey = "customers" | "vendors" | "products" | "accounting";

export type DashboardListState = {
	typeFilter: string;
	fieldFilter: string;
	searchValue: string;
	page: number;
	pageSize: number;
};

type DashboardListStore = {
	lists: Record<DashboardListKey, DashboardListState>;
	actions: {
		updateList: (key: DashboardListKey, partial: Partial<DashboardListState>) => void;
		resetList: (key: DashboardListKey) => void;
	};
};

const defaultListState: DashboardListState = {
	typeFilter: "all",
	fieldFilter: "field-name",
	searchValue: "",
	page: 1,
	pageSize: 20,
};

const initialListState: Record<DashboardListKey, DashboardListState> = {
	customers: { ...defaultListState },
	vendors: { ...defaultListState },
	products: { ...defaultListState },
	accounting: { ...defaultListState, typeFilter: "journal" },
};

const useDashboardListStore = create<DashboardListStore>((set) => ({
	lists: initialListState,
	actions: {
		updateList: (key, partial) =>
			set((state) => ({
				lists: {
					...state.lists,
					[key]: {
						...state.lists[key],
						...partial,
					},
				},
			})),
		resetList: (key) =>
			set((state) => ({
				lists: {
					...state.lists,
					[key]: { ...initialListState[key] },
				},
			})),
	},
}));

export const useDashboardList = (key: DashboardListKey) =>
	useDashboardListStore((state) => state.lists[key]);

export const useDashboardListActions = () =>
	useDashboardListStore((state) => state.actions);
