import { create } from "zustand";
import type { BaseStore } from "@/core/interfaces/base-store";
import type { EquipmentItemId } from "@/core/types/equipment";
import { createBoundStore } from "@/core/utils/create-bound-store";
import {
	type ActionResult,
	createEquipmentInitialState,
	type EquipmentStatePatch,
	type EquipmentStoreState,
} from "./equipment-state";
import {
	EquipmentAddBorrowStockOutState,
	EquipmentAddStockInState,
	EquipmentResetState,
	EquipmentUpdateState,
	EquipmentUpdateTableFilterState,
} from "./states/get-state";

type EquipmentStoreActions = {
	updateState: (next: EquipmentStatePatch) => void;
	setStockInItemId: (value: EquipmentItemId) => void;
	setStockInQty: (value: string) => void;
	setStockInNote: (value: string) => void;
	setBorrowItemId: (value: EquipmentItemId) => void;
	setBorrowQty: (value: string) => void;
	setBorrowCustomer: (value: string) => void;
	setTableTypeFilter: (value: string) => void;
	setTableFieldFilter: (value: string) => void;
	setTableSearchValue: (value: string) => void;
	setTablePage: (value: number) => void;
	setTablePageSize: (value: number) => void;
	addStockInTransaction: () => ActionResult;
	addBorrowStockOutTransaction: () => ActionResult;
	reset: () => void;
};

export interface EquipmentStore extends BaseStore<EquipmentStoreState, EquipmentStoreActions> {
	state: EquipmentStoreState;
	actions: EquipmentStoreActions;
}

const createEquipmentStore = () =>
	create<EquipmentStore>((set, get) => ({
		state: createEquipmentInitialState(),
		actions: {
			updateState: (next) =>
				set({
					state: EquipmentUpdateState(get().state, next),
				}),
			setStockInItemId: (value) =>
				set({
					state: EquipmentUpdateState(get().state, { stockInItemId: value }),
				}),
			setStockInQty: (value) =>
				set({
					state: EquipmentUpdateState(get().state, { stockInQty: value }),
				}),
			setStockInNote: (value) =>
				set({
					state: EquipmentUpdateState(get().state, { stockInNote: value }),
				}),
			setBorrowItemId: (value) =>
				set({
					state: EquipmentUpdateState(get().state, { borrowItemId: value }),
				}),
			setBorrowQty: (value) =>
				set({
					state: EquipmentUpdateState(get().state, { borrowQty: value }),
				}),
			setBorrowCustomer: (value) =>
				set({
					state: EquipmentUpdateState(get().state, { borrowCustomer: value }),
				}),
			setTableTypeFilter: (value) =>
				set({
					state: EquipmentUpdateTableFilterState(get().state, { tableTypeFilter: value }),
				}),
			setTableFieldFilter: (value) =>
				set({
					state: EquipmentUpdateTableFilterState(get().state, { tableFieldFilter: value }),
				}),
			setTableSearchValue: (value) =>
				set({
					state: EquipmentUpdateTableFilterState(get().state, { tableSearchValue: value }),
				}),
			setTablePage: (value) =>
				set({
					state: EquipmentUpdateState(get().state, { tablePage: value }),
				}),
			setTablePageSize: (value) =>
				set({
					state: EquipmentUpdateState(get().state, { tablePageSize: value, tablePage: 1 }),
				}),
			addStockInTransaction: () => {
				const { nextState, result } = EquipmentAddStockInState(get().state);
				if (result.success) {
					set({ state: nextState });
				}
				return result;
			},
			addBorrowStockOutTransaction: () => {
				const { nextState, result } = EquipmentAddBorrowStockOutState(get().state);
				if (result.success) {
					set({ state: nextState });
				}
				return result;
			},
			reset: () => set({ state: EquipmentResetState() }),
		},
	}));

export const equipmentBoundStore = createBoundStore<EquipmentStore>({
	createStore: createEquipmentStore,
});

export const useEquipmentState = () => equipmentBoundStore.useState();
export const useEquipmentActions = () => equipmentBoundStore.useAction();
