import type { EquipmentItemId, EquipmentTransaction } from "@/core/types/equipment";
import type { BaseState } from "@/core/types/state";
import { EQUIPMENT_ITEMS, INITIAL_TRANSACTIONS } from "../constants/constants";

type EquipmentStateType =
	| "InitialState"
	| "UpdateState"
	| "UpdateTableFilterState"
	| "AddStockInState"
	| "AddBorrowStockOutState"
	| "ResetState";

export type EquipmentStoreState = BaseState<EquipmentStateType> & {
	transactions: EquipmentTransaction[];
	stockInItemId: EquipmentItemId;
	stockInQty: string;
	stockInNote: string;
	borrowItemId: EquipmentItemId;
	borrowQty: string;
	borrowCustomer: string;
	tableTypeFilter: string;
	tableFieldFilter: string;
	tableSearchValue: string;
	tablePage: number;
	tablePageSize: number;
};

export type EquipmentStatePatch = Partial<Omit<EquipmentStoreState, "type">>;

export type ActionResult = {
	success: boolean;
	error?: string;
	slipNo?: string;
};

export const createEquipmentInitialState = (): EquipmentStoreState => ({
	type: "InitialState",
	transactions: [...INITIAL_TRANSACTIONS],
	stockInItemId: EQUIPMENT_ITEMS[0].id,
	stockInQty: "1",
	stockInNote: "",
	borrowItemId: EQUIPMENT_ITEMS[0].id,
	borrowQty: "1",
	borrowCustomer: "",
	tableTypeFilter: "all",
	tableFieldFilter: "item",
	tableSearchValue: "",
	tablePage: 1,
	tablePageSize: 10,
});

export const _EquipmentState = ({
	state,
	type,
	patch,
}: {
	state: EquipmentStoreState;
	type: EquipmentStateType;
	patch?: EquipmentStatePatch;
}): EquipmentStoreState => ({
	type,
	transactions: patch?.transactions ?? state.transactions,
	stockInItemId: patch?.stockInItemId ?? state.stockInItemId,
	stockInQty: patch?.stockInQty ?? state.stockInQty,
	stockInNote: patch?.stockInNote ?? state.stockInNote,
	borrowItemId: patch?.borrowItemId ?? state.borrowItemId,
	borrowQty: patch?.borrowQty ?? state.borrowQty,
	borrowCustomer: patch?.borrowCustomer ?? state.borrowCustomer,
	tableTypeFilter: patch?.tableTypeFilter ?? state.tableTypeFilter,
	tableFieldFilter: patch?.tableFieldFilter ?? state.tableFieldFilter,
	tableSearchValue: patch?.tableSearchValue ?? state.tableSearchValue,
	tablePage: patch?.tablePage ?? state.tablePage,
	tablePageSize: patch?.tablePageSize ?? state.tablePageSize,
});
