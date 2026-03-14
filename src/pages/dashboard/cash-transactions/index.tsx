import { useEffect, useMemo, useState } from "react";
import { DashboardSplitView } from "@/core/components/common/dashboard-split-view";
import { useSidebarCollapse } from "@/core/hooks/use-sidebar-collapse";
import type { CashTransactionSummary } from "@/core/types/cash-transaction";
import { buildPagination, normalizeToken } from "@/core/utils/dashboard-utils";
import { CashTransactionContent } from "./components/cash-transaction-content";
import { CashTransactionSidebar } from "./components/cash-transaction-sidebar";
import { useCashTransactions } from "./hooks/use-cash-transactions";
import { useCashTransactionList, useCashTransactionListActions } from "./stores/cash-transaction-list-store";

const DEFAULT_TYPE_OPTIONS = [{ value: "all", label: "All" }];
const DEFAULT_SUMMARY: CashTransactionSummary = { count: 0, debit: 0, credit: 0, balance: 0 };

export default function CashTransactionsPage() {
	const [activeCounterpartyId, setActiveCounterpartyId] = useState<string | null>(null);
	const listState = useCashTransactionList();
	const { updateState } = useCashTransactionListActions();
	const { isCollapsed, handleToggle } = useSidebarCollapse();
	const { data } = useCashTransactions();

	const transactions = data?.rows ?? [];
	const counterparties = data?.counterparties ?? [];
	const typeOptions = data?.typeOptions ?? DEFAULT_TYPE_OPTIONS;
	const summary = data?.summary ?? DEFAULT_SUMMARY;

	const { activeCounterpartyName, currentPage, pagedTransactions, paginationItems, totalItems, totalPages } =
		useMemo(() => {
			const normalizedQuery = listState.searchValue.trim().toLowerCase();
			const normalizedType = normalizeToken(listState.typeFilter);
			const filteredTransactions = transactions.filter((row) => {
				if (activeCounterpartyId && row.counterpartyId !== activeCounterpartyId) {
					return false;
				}

				if (normalizedType !== "all" && normalizeToken(row.type) !== normalizedType) {
					return false;
				}

				if (!normalizedQuery) {
					return true;
				}

				const values = {
					name: row.counterpartyName.toLowerCase(),
					"ref-no": row.refNo.toLowerCase(),
					memo: row.memo.toLowerCase(),
				};

				if (
					listState.fieldFilter === "name" ||
					listState.fieldFilter === "ref-no" ||
					listState.fieldFilter === "memo"
				) {
					return values[listState.fieldFilter].includes(normalizedQuery);
				}

				return (
					values.name.includes(normalizedQuery) ||
					values["ref-no"].includes(normalizedQuery) ||
					values.memo.includes(normalizedQuery) ||
					row.type.toLowerCase().includes(normalizedQuery)
				);
			});
			const totalItems = filteredTransactions.length;
			const totalPages = Math.max(1, Math.ceil(totalItems / listState.pageSize));
			const currentPage = Math.min(listState.page, totalPages);
			const startIndex = (currentPage - 1) * listState.pageSize;
			const activeCounterpartyName = counterparties.find((item) => item.id === activeCounterpartyId)?.name ?? null;

			return {
				activeCounterpartyName,
				currentPage,
				pagedTransactions: filteredTransactions.slice(startIndex, startIndex + listState.pageSize),
				paginationItems: buildPagination(currentPage, totalPages),
				totalItems,
				totalPages,
			};
		}, [
			activeCounterpartyId,
			counterparties,
			listState.fieldFilter,
			listState.page,
			listState.pageSize,
			listState.searchValue,
			listState.typeFilter,
			transactions,
		]);

	useEffect(() => {
		if (listState.page > totalPages) {
			updateState({ page: totalPages });
		}
	}, [listState.page, totalPages, updateState]);

	return (
		<DashboardSplitView
			sidebarClassName={isCollapsed ? "lg:w-20 xl:w-20" : "lg:w-[16rem] xl:w-1/5"}
			sidebar={
				<CashTransactionSidebar
					activeCounterpartyId={activeCounterpartyId}
					counterparties={counterparties}
					onSelect={setActiveCounterpartyId}
					onToggle={handleToggle}
					isCollapsed={isCollapsed}
				/>
			}
			content={
				<CashTransactionContent
					accountLabel={data?.accountLabel ?? "Cash on hand"}
					activeCounterpartyName={activeCounterpartyName}
					listState={listState}
					updateState={updateState}
					pagedTransactions={pagedTransactions}
					totalItems={totalItems}
					totalPages={totalPages}
					currentPage={currentPage}
					paginationItems={paginationItems}
					typeOptions={typeOptions}
					summary={summary}
				/>
			}
		/>
	);
}
