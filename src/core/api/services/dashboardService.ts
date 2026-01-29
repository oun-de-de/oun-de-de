import type { DailyIncomeAccounting, DailyIncomePos } from "@/core/domain/dashboard/entities/daily-income";
import type { CustomerSummaryItem } from "@/core/domain/dashboard/entities/customer-info";
import type { VendorSummaryItem } from "@/core/domain/dashboard/entities/vendor-info";
import type { PerformanceItem } from "@/core/domain/dashboard/entities/performance";
import type { FilterData } from "@/core/domain/dashboard/entities/filter";
import { apiClient } from "../apiClient";

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
		const response = await apiClient.get<CustomerSummaryItem[]>({
			url: DashboardApiPath.CustomerInfo,
		});
		return response;
	}

	async getVendorInfo(): Promise<VendorSummaryItem[]> {
		const response = await apiClient.get<VendorSummaryItem[]>({
			url: DashboardApiPath.VendorInfo,
		});
		return response;
	}

	async getPerformance(): Promise<PerformanceItem[]> {
		const response = await apiClient.get<PerformanceItem[]>({
			url: DashboardApiPath.Performance,
		});
		return response;
	}

	async getFiltersByType(type: string): Promise<FilterData[]> {
		const response = await apiClient.get<FilterData[]>({
			url: DashboardApiPath.Filters,
			params: { type },
		});
		return response;
	}
}

export class DailyIncomePosApiImpl implements DailyIncomePosApi {
	async getDailyIncomesPos(range: string): Promise<DailyIncomePos[]> {
		const response = await apiClient.get<DailyIncomePos[]>({
			url: DashboardApiPath.DailyIncomePos,
			params: { range },
		});
		return response;
	}
}

export class DailyIncomeAccountingApiImpl implements DailyIncomeAccountingApi {
	async getDailyIncomesAccounting(range: string): Promise<DailyIncomeAccounting[]> {
		const response = await apiClient.get<DailyIncomeAccounting[]>({
			url: DashboardApiPath.DailyIncomeAccounting,
			params: { range },
		});
		return response;
	}
}
