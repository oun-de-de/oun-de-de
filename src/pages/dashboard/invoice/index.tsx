import { useState } from "react";
import { DashboardSplitView } from "@/core/components/common/dashboard-split-view";
import { useSidebarCollapse } from "@/core/hooks/use-sidebar-collapse";
import type { Customer } from "@/core/types/customer";
import { InvoiceContent } from "./components/invoice-content";
import { InvoiceSidebar } from "./components/invoice-sidebar";
import { useInvoiceTable } from "./hooks/use-invoice-table";

export default function InvoicePage() {
	const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
	const { isCollapsed, handleToggle } = useSidebarCollapse();
	const invoiceTable = useInvoiceTable({
		customerName: activeCustomer?.name ?? null,
		customerCode: activeCustomer?.code ?? null,
	});

	return (
		<DashboardSplitView
			sidebarClassName={isCollapsed ? "lg:w-20" : "lg:w-1/4"}
			sidebar={
				<InvoiceSidebar
					activeCustomerId={activeCustomer?.id ?? null}
					onSelect={setActiveCustomer}
					onToggle={handleToggle}
					isCollapsed={isCollapsed}
				/>
			}
			content={<InvoiceContent {...invoiceTable} activeInvoiceLabel={activeCustomer?.name ?? null} />}
		/>
	);
}
