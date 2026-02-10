import { useEffect, useMemo, useState } from "react";
import { buildPagination } from "@/core/utils/dashboard-utils";
import { INVOICE_ROWS } from "../constants";

type UseInvoiceTableParams = {
	customerName?: string | null;
	customerCode?: string | null;
};

export function useInvoiceTable({ customerName, customerCode }: UseInvoiceTableParams = {}) {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [typeFilter, setTypeFilter] = useState("all");
	const [fieldFilter, setFieldFilter] = useState("all");
	const [searchValue, setSearchValue] = useState("");

	const filteredData = useMemo(() => {
		const query = searchValue.trim().toLowerCase();

		return INVOICE_ROWS.filter((row) => {
			if (customerName || customerCode) {
				const normalizedCustomer = row.customer.trim().toLowerCase();
				const normalizedName = customerName?.trim().toLowerCase();
				const normalizedCode = customerCode?.trim().toLowerCase();
				const matchesName = normalizedName ? normalizedCustomer.includes(normalizedName) : false;
				const matchesCode = normalizedCode ? normalizedCustomer.includes(`(${normalizedCode})`) : false;

				if (!matchesName && !matchesCode) {
					return false;
				}
			}

			if (typeFilter !== "all" && row.status !== typeFilter) {
				return false;
			}

			if (!query) {
				return true;
			}

			if (fieldFilter === "refNo") {
				return row.refNo.toLowerCase().includes(query);
			}

			if (fieldFilter === "customer") {
				return row.customer.toLowerCase().includes(query);
			}

			return row.refNo.toLowerCase().includes(query) || row.customer.toLowerCase().includes(query);
		});
	}, [customerCode, customerName, fieldFilter, searchValue, typeFilter]);

	const summaryCards = useMemo(() => {
		const total = filteredData.reduce((sum, row) => sum + row.total, 0);
		const outstanding = filteredData.reduce((sum, row) => sum + row.balance, 0);
		const paidCount = filteredData.filter((row) => row.status === "Paid").length;
		const overdueCount = filteredData.filter((row) => row.status === "Overdue").length;

		return [
			{ label: "Total Invoice", value: total, color: "bg-sky-500", icon: "mdi:file-document-outline" },
			{ label: "Outstanding", value: outstanding, color: "bg-amber-500", icon: "mdi:cash-remove" },
			{ label: "Paid", value: paidCount, color: "bg-emerald-500", icon: "mdi:check-circle-outline" },
			{ label: "Overdue", value: overdueCount, color: "bg-red-500", icon: "mdi:alert-circle-outline" },
		];
	}, [filteredData]);

	const totalItems = filteredData.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const currentPage = Math.min(page, totalPages);

	useEffect(() => {
		if (page > totalPages) {
			setPage(totalPages);
		}
	}, [page, totalPages]);

	const pagedData = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return filteredData.slice(start, start + pageSize);
	}, [currentPage, filteredData, pageSize]);

	return {
		pagedData,
		summaryCards,
		typeFilter,
		fieldFilter,
		searchValue,
		currentPage,
		pageSize,
		totalItems,
		totalPages,
		paginationItems: buildPagination(currentPage, totalPages),
		onTypeFilterChange: (value: string) => {
			setTypeFilter(value);
			setPage(1);
		},
		onFieldFilterChange: (value: string) => {
			setFieldFilter(value);
			setPage(1);
		},
		onSearchChange: (value: string) => {
			setSearchValue(value);
			setPage(1);
		},
		onPageChange: setPage,
		onPageSizeChange: (value: number) => {
			setPageSize(value);
			setPage(1);
		},
	};
}
