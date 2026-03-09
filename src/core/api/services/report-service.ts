import type { DailyReportResponse, InventoryStockReportLine } from "@/core/types/report";
import { apiClient } from "../apiClient";

enum REPORT_API {
	DAILY_REPORT = "/reports/daily-report",
	INVENTORY_STOCK_REPORT = "/reports/inventory-stock-report",
}

const getDailyReport = (date: string) =>
	apiClient.get<DailyReportResponse>({
		url: REPORT_API.DAILY_REPORT,
		params: { date },
	});

const getInventoryStockReport = (fromDate: string, toDate: string) =>
	apiClient.get<InventoryStockReportLine[]>({
		url: REPORT_API.INVENTORY_STOCK_REPORT,
		params: { fromDate, toDate },
	});

export default {
	getDailyReport,
	getInventoryStockReport,
};
