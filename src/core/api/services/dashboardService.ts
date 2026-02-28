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

// Mock implementations (useful for local dev / storybook)
function formatDateDDMMYYYY(d: Date): string {
	const dd = String(d.getDate()).padStart(2, "0");
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	const yyyy = d.getFullYear();
	return `${dd}/${mm}/${yyyy}`;
}

function generateDailyIncomePos(days: number): DailyIncomePos[] {
	const data: DailyIncomePos[] = [];
	const today = new Date();
	for (let i = days - 1; i >= 0; i--) {
		const date = new Date(today);
		date.setDate(date.getDate() - i);
		const amount = Math.floor(Math.random() * (30_000_000 - 2_000_000 + 1)) + 2_000_000;
		data.push({ date: formatDateDDMMYYYY(date), amount });
	}
	return data;
}

function generateDailyIncomeAccounting(days: number): DailyIncomeAccounting[] {
	const data: DailyIncomeAccounting[] = [];
	const today = new Date();
	for (let i = days - 1; i >= 0; i--) {
		const date = new Date(today);
		date.setDate(date.getDate() - i);
		const income = Math.floor(Math.random() * (25_000_000 - 5_000_000 + 1)) + 5_000_000;
		const expense = Math.floor(Math.random() * (15_000_000 - 1_000_000 + 1)) + 1_000_000;
		data.push({ date: formatDateDDMMYYYY(date), income, expense });
	}
	return data;
}

export class DashboardApiMockupImpl implements DashboardApi {
	async getCustomerInfo(): Promise<CustomerSummaryItem[]> {
		const mock: CustomerSummaryItem[] = [
			{ id: "deposit", label: "Deposit Balance", value: "0 ₺", variant: "info", icon: "solar:dollar-bold" },
			{
				id: "sale-order",
				label: "Sale Order",
				value: "0 ₺",
				variant: "success",
				icon: "solar:users-group-rounded-bold",
			},
			{ id: "invoice", label: "Invoice", value: "398,631,700 ₺", variant: "warning", icon: "solar:bill-list-bold" },
			{ id: "overdue", label: "Overdue", value: "0 ₺", variant: "destructive", icon: "solar:bill-cross-bold" },
		];
		return Promise.resolve(mock);
	}

	async getVendorInfo(): Promise<VendorSummaryItem[]> {
		// Simple mock: empty vendor summary list
		return Promise.resolve([] as VendorSummaryItem[]);
	}

	async getPerformance(): Promise<PerformanceItem[]> {
		const mock: PerformanceItem[] = [
			{ id: "income", label: "Income", value: "255,180,200 ₺", variant: "info" },
			{ id: "expenses", label: "Expenses", value: "39,366,200 ₺", variant: "warning" },
			{ id: "net-income", label: "Net Income", value: "215,814,000 ₺", variant: "success" },
		];
		return Promise.resolve(mock);
	}

	async getFiltersByType(_type: string): Promise<FilterData[]> {
		const mock: FilterData[] = [
			{ id: "7", value: "Last 7 Days" },
			{ id: "15", value: "Last 15 Days" },
			{ id: "30", value: "Last 30 Days" },
		];
		return Promise.resolve(mock);
	}
}

export class DailyIncomePosMockupImpl implements DailyIncomePosApi {
	async getDailyIncomesPos(range: string): Promise<DailyIncomePos[]> {
		let days = 30;
		if (range === "7") days = 7;
		if (range === "15") days = 15;
		return Promise.resolve(generateDailyIncomePos(days));
	}
}

export class DailyIncomeAccountingMockupImpl implements DailyIncomeAccountingApi {
	async getDailyIncomesAccounting(range: string): Promise<DailyIncomeAccounting[]> {
		let days = 30;
		if (range === "7") days = 7;
		if (range === "15") days = 15;
		return Promise.resolve(generateDailyIncomeAccounting(days));
	}
}
