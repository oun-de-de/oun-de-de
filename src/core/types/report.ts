export interface DailyReportProductRevenue {
	productName?: string | null;
	unit?: string | null;
	totalQuantity?: number | null;
	totalAmount?: number | null;
}

export interface InventoryStockReportLine {
	itemName?: string | null;
	itemCode?: string | null;
	quantity?: number | null;
	type?: "IN" | "OUT" | null;
	reason?: "PURCHASE" | "CONSUME" | "BORROW" | "RETURN" | null;
	createdAt?: string | null;
}

export interface DailyReportBoughtItem {
	itemName?: string | null;
	expense?: number | null;
}

export interface DailyReportResponse {
	soldProducts?: DailyReportProductRevenue[] | null;
	boughtItems?: DailyReportBoughtItem[] | null;
	iceCubeSaleCash?: number | null;
	premiumIceSaleCash?: number | null;
	customerSaleInvoicePremiumIce?: number | null;
	customerSaleInvoiceIceCube?: number | null;
	totalRevenue?: number | null;
	totalCashReceive?: number | null;
	totalExpense?: number | null;
}
