import { ReactNode } from "react";
import { MultiStoreProvider, StoreConfig } from "@/core/ui/store/multi-store-provider";
import { customerInfoBoundStore } from "./stores/customer-info/customer-info-store";
import { performanceBoundStore } from "./stores/performance/performance-store";
import { dailyIncomeAccountingBoundStore } from "./stores/income-accounting/daily-income-accounting-store";
import { dailyIncomePosStore } from "./stores/income-pos/daily-income-pos-store";

// Store configuration for MultiStoreProvider
const dashboardStores: StoreConfig[] = [
	{
		name: "customerInfo",
		store: customerInfoBoundStore,
	},
	{
		name: "performance",
		store: performanceBoundStore,
	},
	{
		name: "dailyIncomeAccounting",
		store: dailyIncomeAccountingBoundStore,
	},
	{
		name: "dailyIncomePos",
		store: dailyIncomePosStore,
	},
];

interface DashboardProvidersProps {
	children: ReactNode;
}

/**
 * DashboardProviders - Wraps all dashboard stores with MultiStoreProvider
 * Provides centralized store management for Dashboard page
 */
export function DashboardProviders({ children }: DashboardProvidersProps) {
	return <MultiStoreProvider stores={dashboardStores}>{children}</MultiStoreProvider>;
}
