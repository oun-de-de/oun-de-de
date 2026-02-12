import type { EquipmentItem, EquipmentTransaction } from "@/core/types/equipment";

export const EQUIPMENT_ITEMS: EquipmentItem[] = [
	{ id: "inventory-bag", name: "Inventory Bag", category: "Inventory", openingStock: 120, alertThreshold: 20 },
	{ id: "ice-cabinet", name: "Ice Cabinet", category: "Storage", openingStock: 18, alertThreshold: 4 },
	{ id: "equipment-tools", name: "Equipment", category: "General", openingStock: 45, alertThreshold: 8 },
];

export const INITIAL_TRANSACTIONS: EquipmentTransaction[] = [
	{
		id: "tx-01",
		itemId: "inventory-bag",
		type: "stock-in",
		quantity: 30,
		createdAt: "2026-02-11T08:30:00.000Z",
		note: "Manual stock in",
	},
	{
		id: "tx-02",
		itemId: "ice-cabinet",
		type: "stock-out-borrow",
		quantity: 2,
		createdAt: "2026-02-11T09:15:00.000Z",
		customerName: "Nhật Minh",
		slipNo: "BR-20260211-001",
	},
	{
		id: "tx-03",
		itemId: "equipment-tools",
		type: "stock-in",
		quantity: 5,
		createdAt: "2026-02-11T10:00:00.000Z",
		note: "Manual stock in",
	},
];
