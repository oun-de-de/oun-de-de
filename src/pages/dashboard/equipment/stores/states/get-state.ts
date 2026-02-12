import type { EquipmentTransaction } from "@/core/types/equipment";
import { createSlipNo } from "../../utils/utils";
import {
	_EquipmentState,
	type ActionResult,
	createEquipmentInitialState,
	type EquipmentStatePatch,
	type EquipmentStoreState,
} from "../equipment-state";

const parseQuantity = (value: string): number => Number(value);

export const EquipmentUpdateState = (state: EquipmentStoreState, patch: EquipmentStatePatch): EquipmentStoreState =>
	_EquipmentState({
		state,
		type: "UpdateState",
		patch,
	});

export const EquipmentUpdateTableFilterState = (
	state: EquipmentStoreState,
	patch: Partial<Pick<EquipmentStoreState, "tableTypeFilter" | "tableFieldFilter" | "tableSearchValue">>,
): EquipmentStoreState =>
	_EquipmentState({
		state,
		type: "UpdateTableFilterState",
		patch: {
			...patch,
			tablePage: 1,
		},
	});

export const EquipmentAddStockInState = (
	state: EquipmentStoreState,
	now: Date = new Date(),
): { nextState: EquipmentStoreState; result: ActionResult } => {
	const quantity = parseQuantity(state.stockInQty);
	if (!Number.isFinite(quantity) || quantity <= 0) {
		return {
			nextState: state,
			result: { success: false, error: "Stock in quantity must be greater than 0" },
		};
	}

	const tx: EquipmentTransaction = {
		id: `tx-${now.getTime()}`,
		itemId: state.stockInItemId,
		type: "stock-in",
		quantity,
		createdAt: now.toISOString(),
		note: state.stockInNote.trim() || "Manual stock in",
	};

	return {
		nextState: _EquipmentState({
			state,
			type: "AddStockInState",
			patch: {
				transactions: [...state.transactions, tx],
				stockInQty: "1",
				stockInNote: "",
			},
		}),
		result: { success: true },
	};
};

export const EquipmentAddBorrowStockOutState = (
	state: EquipmentStoreState,
	now: Date = new Date(),
): { nextState: EquipmentStoreState; result: ActionResult } => {
	const quantity = parseQuantity(state.borrowQty);
	if (!Number.isFinite(quantity) || quantity <= 0) {
		return {
			nextState: state,
			result: { success: false, error: "Borrow quantity must be greater than 0" },
		};
	}

	const customerName = state.borrowCustomer.trim();
	if (!customerName) {
		return {
			nextState: state,
			result: { success: false, error: "Customer name is required" },
		};
	}

	const slipNo = createSlipNo(now);
	const tx: EquipmentTransaction = {
		id: `tx-${now.getTime()}`,
		itemId: state.borrowItemId,
		type: "stock-out-borrow",
		quantity,
		createdAt: now.toISOString(),
		customerName,
		slipNo,
	};

	return {
		nextState: _EquipmentState({
			state,
			type: "AddBorrowStockOutState",
			patch: {
				transactions: [...state.transactions, tx],
				borrowQty: "1",
				borrowCustomer: "",
			},
		}),
		result: { success: true, slipNo },
	};
};

export const EquipmentResetState = (): EquipmentStoreState =>
	_EquipmentState({
		state: createEquipmentInitialState(),
		type: "ResetState",
	});
