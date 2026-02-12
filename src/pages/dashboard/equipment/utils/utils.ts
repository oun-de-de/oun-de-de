import { format, parseISO } from "date-fns";
import type {
	EquipmentItem,
	EquipmentItemId,
	EquipmentSummaryRow,
	EquipmentTransaction,
	TransactionType,
} from "@/core/types/equipment";

export function getTxDirection(type: TransactionType) {
	return type === "stock-in" ? 1 : -1;
}

export function formatDateTime(value: string) {
	return format(parseISO(value), "dd/MM/yyyy HH:mm");
}

export function createSlipNo(now: Date = new Date()) {
	return `BR-${format(now, "yyyyMMdd-HHmmss")}`;
}

export function createItemMap(items: EquipmentItem[]) {
	return new Map(items.map((item) => [item.id, item] as const));
}

export function getRemainingAfterByTxId(items: EquipmentItem[], transactions: EquipmentTransaction[]) {
	const running = new Map<EquipmentItemId, number>();
	for (const item of items) running.set(item.id, item.openingStock);

	const result = new Map<string, number>();
	const ascTransactions = [...transactions].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));

	for (const tx of ascTransactions) {
		const currentRemaining = running.get(tx.itemId) ?? 0;
		const nextRemaining = currentRemaining + getTxDirection(tx.type) * tx.quantity;
		running.set(tx.itemId, nextRemaining);
		result.set(tx.id, nextRemaining);
	}

	return result;
}

export function getSummaryRows(items: EquipmentItem[], transactions: EquipmentTransaction[]): EquipmentSummaryRow[] {
	return items.map((item) => {
		let stockIn = 0;
		let stockOut = 0;
		let alertOut = 0;

		for (const tx of transactions) {
			if (tx.itemId !== item.id) continue;

			if (tx.type === "stock-in") {
				stockIn += tx.quantity;
				continue;
			}

			stockOut += tx.quantity;

			if (tx.type !== "stock-out-borrow") {
				alertOut += tx.quantity;
			}
		}

		const remaining = item.openingStock + stockIn - stockOut;
		const alertRemaining = item.openingStock + stockIn - alertOut;

		return {
			item,
			stockIn,
			stockOut,
			remaining,
			isLowStock: alertRemaining <= item.alertThreshold,
		};
	});
}

export function getSortedTransactionsDesc(transactions: EquipmentTransaction[]) {
	return [...transactions].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}
