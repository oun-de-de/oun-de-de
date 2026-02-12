export type EquipmentItemId = "inventory-bag" | "ice-cabinet" | "equipment-tools";
export type TransactionType = "stock-in" | "stock-out-borrow";

export type EquipmentItem = {
	id: EquipmentItemId;
	name: string;
	category: string;
	openingStock: number;
	alertThreshold: number;
};

export type EquipmentTransaction = {
	id: string;
	itemId: EquipmentItemId;
	type: TransactionType;
	quantity: number;
	createdAt: string;
	note?: string;
	customerName?: string;
	slipNo?: string;
};

export type EquipmentSummaryRow = {
	item: EquipmentItem;
	stockIn: number;
	stockOut: number;
	remaining: number;
	isLowStock: boolean;
};
