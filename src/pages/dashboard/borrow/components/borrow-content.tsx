import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { SmartDataTable, SummaryStatCard } from "@/core/components/common";
import { SplitButton } from "@/core/components/common/split-button";
import Icon from "@/core/components/icon/icon";
import type { SummaryStatCardData } from "@/core/types/common";
import { Button } from "@/core/ui/button";
import { Text } from "@/core/ui/typography";

import type { BorrowState } from "@/pages/dashboard/borrow/stores/borrow-store";
import { MOCK_LOAN_RECORDS } from "../constants/loan-records";
import { mapLoanRecordToBorrowRow } from "../utils/loan-utils";
import { borrowColumns } from "./borrow-columns";

type Props = {
	activeBorrowId: string | null;
	listState: BorrowState;
	updateState: (updates: Partial<Omit<BorrowState, "type">>) => void;
};

export function BorrowContent({ activeBorrowId, listState, updateState }: Props) {
	const navigate = useNavigate();
	const loanRows = useMemo(() => MOCK_LOAN_RECORDS.map((record) => mapLoanRecordToBorrowRow(record)), []);

	const filteredData = useMemo(() => {
		let data = loanRows;
		if (listState.searchValue) {
			const q = listState.searchValue.toLowerCase();
			if (listState.fieldFilter === "borrower") {
				data = data.filter((row) => row.borrower.toLowerCase().includes(q));
			} else if (listState.fieldFilter === "borrowerType") {
				data = data.filter((row) => row.borrowerType.toLowerCase().includes(q));
			} else {
				data = data.filter((row) => row.refNo.toLowerCase().includes(q));
			}
		}
		if (listState.typeFilter !== "all") {
			data = data.filter((row) => row.status === listState.typeFilter);
		}
		return data;
	}, [listState.fieldFilter, listState.searchValue, listState.typeFilter, loanRows]);

	const summaryCards = useMemo<SummaryStatCardData[]>(() => {
		const activeCount = loanRows.filter((row) => row.status === "Active").length;
		const overdueCount = loanRows.filter((row) => row.status === "Overdue").length;
		const closedCount = loanRows.filter((row) => row.status === "Returned").length;
		return [
			{ label: "Active Loans", value: activeCount, color: "bg-blue-500", icon: "mdi:cash-multiple" },
			{ label: "Overdue Loans", value: overdueCount, color: "bg-red-500", icon: "mdi:alert-circle-outline" },
			{ label: "Closed Loans", value: closedCount, color: "bg-emerald-500", icon: "mdi:check-circle-outline" },
		];
	}, [loanRows]);

	const totalItems = filteredData.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / listState.pageSize));
	const paginatedData = filteredData.slice(
		(listState.page - 1) * listState.pageSize,
		listState.page * listState.pageSize,
	);

	useEffect(() => {
		if (listState.page > totalPages) {
			updateState({ page: totalPages });
		}
	}, [listState.page, totalPages, updateState]);

	const activeBorrow = loanRows.find((row) => row.id === activeBorrowId);

	const mainAction = {
		label: listState.activeView === "requests" ? "Requests" : "All Loans",
		onClick: () => {},
	};

	const options = [
		{ label: "All Loans", onClick: () => updateState({ activeView: "all" }) },
		{ label: "Requests", onClick: () => updateState({ activeView: "requests" }) },
	];

	const newBorrowMainAction = {
		label: (
			<span className="flex items-center gap-2">
				<Icon icon="mdi:plus" />
				New Loan
			</span>
		),
		onClick: () => navigate("/dashboard/borrow/new"),
	};

	const newBorrowOptions = [
		{ label: "Record Monthly Payment", onClick: () => {} },
		{ label: "Adjust Schedule", onClick: () => {} },
	];

	const filterConfig = {
		typeOptions: [
			{ label: "All Status", value: "all" },
			{ label: "Active", value: "Active" },
			{ label: "Returned", value: "Returned" },
			{ label: "Overdue", value: "Overdue" },
		],
		fieldOptions: [
			{ label: "Ref No", value: "refNo" },
			{ label: "Borrower", value: "borrower" },
			{ label: "Type", value: "borrowerType" },
		],
		typeValue: listState.typeFilter,
		fieldValue: listState.fieldFilter || "refNo",
		searchValue: listState.searchValue,
		onTypeChange: (v: string) => updateState({ typeFilter: v, page: 1 }),
		onFieldChange: (v: string) => updateState({ fieldFilter: v, page: 1 }),
		onSearchChange: (v: string) => updateState({ searchValue: v, page: 1 }),
	};

	const paginationConfig = {
		page: listState.page,
		pageSize: listState.pageSize,
		totalItems,
		totalPages,
		onPageChange: (p: number) => updateState({ page: p }),
		onPageSizeChange: (s: number) => updateState({ pageSize: s, page: 1 }),
		paginationItems: Array.from({ length: totalPages }, (_, i) => i + 1),
	};

	return (
		<>
			<div className="flex flex-wrap items-center justify-between gap-2 mb-4">
				<div className="flex items-center gap-2">
					<SplitButton variant="outline" size="sm" mainAction={mainAction} options={options} />
					<Text variant="body2" className="text-slate-400">
						{activeBorrow ? `${activeBorrow.refNo} selected` : "No Record Selected"}
					</Text>
				</div>

				<div className="flex gap-2">
					<Button size="sm" className="gap-2" variant="outline">
						<Icon icon="mdi:printer" />
						Print Report
					</Button>
					<SplitButton mainAction={newBorrowMainAction} options={newBorrowOptions} />
				</div>
			</div>

			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4 mb-4">
				{summaryCards.map((card) => (
					<SummaryStatCard key={card.label} {...card} />
				))}
			</div>

			<SmartDataTable
				className="flex-1 min-h-0"
				maxBodyHeight="100%"
				data={paginatedData}
				columns={borrowColumns}
				filterConfig={filterConfig}
				paginationConfig={paginationConfig}
			/>
		</>
	);
}
