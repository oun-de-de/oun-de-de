import { accountingAccountList, accountingRows } from "@/_mock/data/dashboard";
import { SmartDataTable } from "@/core/components/common";
import Icon from "@/core/components/icon/icon";
import { useAccountingListActions } from "@/core/store/accountingListStore";
import type { SelectOption } from "@/core/types/common";
import { Button } from "@/core/ui/button";
import { Text } from "@/core/ui/typography";
import { getPaginationItems } from "@/core/utils/pagination";
import { columns } from "./accounting-columns";

const rows = accountingRows;

const FILTER_TYPE_OPTIONS: SelectOption[] = [
	{ value: "journal", label: "Journal Type" },
	{ value: "invoice", label: "Invoice" },
	{ value: "receipt", label: "Receipt" },
];

const FILTER_FIELD_OPTIONS: SelectOption[] = [
	{ value: "field-name", label: "Field name" },
	{ value: "ref-no", label: "Ref No" },
	{ value: "memo", label: "Memo" },
];

type AccountingContentProps = {
	activeAccountId: string | null;
	listState: any; // Using explicit type would be better
};

export function AccountingContent({ activeAccountId, listState }: AccountingContentProps) {
	const { updateState } = useAccountingListActions();
	const activeAccount = accountingAccountList.find((account) => account.id === activeAccountId);

	return (
		<>
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<Button size="sm" className="gap-1">
						<Icon icon="mdi:bank" />
						Chart of Account
					</Button>
					<Text variant="body2" className="text-muted-foreground">
						{activeAccount ? `${activeAccount.name} selected` : "No item selected"}
					</Text>
				</div>
				<Button size="sm" className="gap-2">
					<Icon icon="mdi:plus" />
					Create Journal
					<Icon icon="mdi:chevron-down" />
				</Button>
			</div>

			<SmartDataTable
				className="flex-1 min-h-0"
				maxBodyHeight="100%"
				data={rows}
				columns={columns}
				filterConfig={{
					typeOptions: FILTER_TYPE_OPTIONS,
					fieldOptions: FILTER_FIELD_OPTIONS,
					typeValue: listState.typeFilter,
					fieldValue: listState.fieldFilter,
					searchValue: listState.searchValue,
					onTypeChange: (value) => updateState({ typeFilter: value, page: 1 }),
					onFieldChange: (value) => updateState({ fieldFilter: value, page: 1 }),
					onSearchChange: (value) => updateState({ searchValue: value, page: 1 }),
				}}
				paginationConfig={{
					page: listState.page,
					pageSize: listState.pageSize,
					totalItems: 46166,
					totalPages: 2309,
					paginationItems: getPaginationItems(listState.page, 2309),
					onPageChange: (nextPage) => updateState({ page: nextPage }),
					onPageSizeChange: (nextSize) => updateState({ pageSize: nextSize, page: 1 }),
				}}
			/>
		</>
	);
}
