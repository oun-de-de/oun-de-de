import type { DailyIncomeAccounting, DailyIncomePos } from "@/core/domain/dashboard/entities/daily-income";
import { authClient } from "../index";
import type { CustomerSummaryItem } from "@/core/domain/dashboard/entities/customer-info";
import type { VendorSummaryItem } from "@/core/domain/dashboard/entities/vendor-info";
import type { PerformanceItem } from "@/core/domain/dashboard/entities/performance";
import type { FilterData } from "@/core/domain/dashboard/entities/filter";

enum DashboardApiPath {
	DailyIncomePos = "/dashboard/daily-income-pos",
	DailyIncomeAccounting = "/dashboard/daily-income-accounting",
	CustomerInfo = "/dashboard/customer-info",
	VendorInfo = "/dashboard/vendor-info",
	Performance = "/dashboard/performance",
	Filters = "/dashboard/filters",
}

export interface DailyIncomePosApi {
	getDailyIncomesPos(range: string): Promise<DailyIncomePos[]>;
}

export interface DailyIncomeAccountingApi {
	getDailyIncomesAccounting(range: string): Promise<DailyIncomeAccounting[]>;
}

export interface DashboardApi {
	getCustomerInfo(): Promise<CustomerSummaryItem[]>;
	getVendorInfo(): Promise<VendorSummaryItem[]>;
	getPerformance(): Promise<PerformanceItem[]>;
	getFiltersByType(type: string): Promise<FilterData[]>;
}

export class DashboardApiImpl implements DashboardApi {
	async getCustomerInfo(): Promise<CustomerSummaryItem[]> {
		const response = await authClient.get<CustomerSummaryItem[]>(DashboardApiPath.CustomerInfo);
		return response.body ?? [];
	}

	async getVendorInfo(): Promise<VendorSummaryItem[]> {
		const response = await authClient.get<VendorSummaryItem[]>(DashboardApiPath.VendorInfo);
		return response.body ?? [];
	}

	async getPerformance(): Promise<PerformanceItem[]> {
		const response = await authClient.get<PerformanceItem[]>(DashboardApiPath.Performance);
		return response.body ?? [];
	}

	async getFiltersByType(type: string): Promise<FilterData[]> {
		const response = await authClient.get<FilterData[]>(DashboardApiPath.Filters, {
			queryParameters: { type },
		});
		return response.body ?? [];
	}
}

export class DailyIncomePosApiImpl implements DailyIncomePosApi {
	async getDailyIncomesPos(range: string): Promise<DailyIncomePos[]> {
		const response = await authClient.get<DailyIncomePos[]>(DashboardApiPath.DailyIncomePos, {
			queryParameters: { range },
		});
		return response.body ?? [];
	}
}

export class DailyIncomeAccountingApiImpl implements DailyIncomeAccountingApi {
	async getDailyIncomesAccounting(range: string): Promise<DailyIncomeAccounting[]> {
		const response = await authClient.get<DailyIncomeAccounting[]>(DashboardApiPath.DailyIncomeAccounting, {
			queryParameters: { range },
		});
		return response.body ?? [];
	}
}
