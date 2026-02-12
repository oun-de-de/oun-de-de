import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { DashboardSplitView } from "@/core/components/common/dashboard-split-view";
import { useSidebarCollapse } from "@/core/hooks/use-sidebar-collapse";
import type { Customer } from "@/core/types/customer";
import { InvoiceContent } from "./components/invoice-content";
import { InvoiceSidebar } from "./components/invoice-sidebar";
import { useInvoiceTable } from "./hooks/use-invoice-table";

export default function InvoicePage() {
	const [searchParams] = useSearchParams();
	const [activeCustomerId, setActiveCustomerId] = useState<string | null>(() => searchParams.get("customerId"));
	const [activeCustomerName, setActiveCustomerName] = useState<string | null>(() => searchParams.get("customerName"));
	const { isCollapsed, handleToggle } = useSidebarCollapse();

	useEffect(() => {
		const queryCustomerId = searchParams.get("customerId");
		const queryCustomerName = searchParams.get("customerName");
		setActiveCustomerId((prev) => (prev === queryCustomerId ? prev : queryCustomerId));
		setActiveCustomerName((prev) => (prev === queryCustomerName ? prev : queryCustomerName));
	}, [searchParams]);

	const handleSelectCustomer = useCallback((customer: Customer | null) => {
		setActiveCustomerId((prev) => (prev === (customer?.id ?? null) ? prev : (customer?.id ?? null)));
		setActiveCustomerName((prev) => (prev === (customer?.name ?? null) ? prev : (customer?.name ?? null)));
	}, []);

	const invoiceTable = useInvoiceTable({
		customerName: activeCustomerName ?? null,
		customerId: activeCustomerId ?? null,
	});

	return (
		<DashboardSplitView
			sidebarClassName={isCollapsed ? "lg:w-20" : "lg:w-1/4"}
			sidebar={
				<InvoiceSidebar
					activeCustomerId={activeCustomerId ?? null}
					onSelect={handleSelectCustomer}
					onToggle={handleToggle}
					isCollapsed={isCollapsed}
				/>
			}
			content={<InvoiceContent {...invoiceTable} activeInvoiceLabel={activeCustomerName ?? null} />}
		/>
	);
}
