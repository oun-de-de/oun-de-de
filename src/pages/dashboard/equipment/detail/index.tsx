import { SmartDataTable } from "@/core/components/common";
import Icon from "@/core/components/icon/icon";
import { Button } from "@/core/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/ui/tabs";
import { Text } from "@/core/ui/typography";
import { buildPagination } from "@/core/utils/dashboard-utils";
import { useRouter } from "@/routes/hooks/use-router";
import { StockInForm } from "../components/stock-in-form";
import { StockOutBorrowForm } from "../components/stock-out-borrow-form";
import { EQUIPMENT_ITEMS } from "../constants/constants";
import { EquipmentInfoCard } from "./components/equipment-info-card";
import { EquipmentQuickActions } from "./components/equipment-quick-actions";
import { EquipmentSettings } from "./components/equipment-settings";
import { useEquipmentDetail } from "./hooks/use-equipment-detail";

export default function EquipmentDetailPage() {
	const router = useRouter();
	const {
		activeItem,
		filteredSummary,
		stockInQty,
		stockInNote,
		borrowQty,
		borrowCustomer,
		setStockInItemId,
		setStockInQty,
		setStockInNote,
		setBorrowItemId,
		setBorrowQty,
		setBorrowCustomer,
		addStockIn,
		addBorrowStockOut,
		columns,
		pagedRows,
		currentPage,
		totalItems,
		totalPages,
		tableTypeFilter,
		tableFieldFilter,
		tableSearchValue,
		tablePageSize,
		setTableTypeFilter,
		setTableFieldFilter,
		setTableSearchValue,
		setTablePage,
		setTablePageSize,
	} = useEquipmentDetail();

	if (!activeItem) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-center">
					<Text variant="body1" className="mb-4 text-lg font-semibold">
						Equipment not found
					</Text>
					<Button onClick={() => router.push("/dashboard/equipment")}>
						<Icon icon="mdi:arrow-left" className="mr-2" />
						Back to Equipment
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col gap-6 p-6">
			{/* Header */}
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<Button size="sm" variant="outline" onClick={() => router.push("/dashboard/equipment")}>
						<Icon icon="mdi:arrow-left" />
					</Button>
					<Button size="sm" className="gap-1">
						<Icon icon="mdi:toolbox-outline" />
						{activeItem.name}
					</Button>
					<Text variant="body2" className="text-slate-400">
						{activeItem.category}
					</Text>
				</div>
				<div className="flex gap-2">
					<EquipmentQuickActions
						onPrintReport={() => {}}
						onExport={() => {}}
						onDuplicate={() => {}}
						onArchive={() => {}}
					/>
				</div>
			</div>

			{/* Tabbed Content */}
			<Tabs defaultValue="overview" className="flex-1 min-h-0 flex flex-col">
				<TabsList>
					<TabsTrigger value="overview" className="data-[state=active]:font-bold">
						<Icon icon="mdi:view-dashboard" className="data-[state=active]:text-blue-600" />
						Overview
					</TabsTrigger>
					<TabsTrigger value="transactions" className="data-[state=active]:font-bold">
						<Icon icon="mdi:swap-horizontal" className="data-[state=active]:text-blue-600" />
						Transactions
					</TabsTrigger>
					<TabsTrigger value="settings" className="data-[state=active]:font-bold">
						<Icon icon="mdi:cog" className="data-[state=active]:text-blue-600" />
						Settings
					</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="flex-1 min-h-0 overflow-auto">
					<div className="space-y-6">
						<EquipmentInfoCard
							item={activeItem}
							remaining={filteredSummary[0]?.remaining ?? 0}
							isLowStock={filteredSummary[0]?.isLowStock ?? false}
							onUpdate={(_updates) => {}}
						/>

						{/* Recent Transactions Preview */}
						<div className="rounded-lg border bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between mb-4">
								<Text variant="body1" className="font-semibold">
									Recent Transactions
								</Text>
								<Button size="sm" variant="outline">
									View All
								</Button>
							</div>
							<SmartDataTable className="flex-1" maxBodyHeight="300px" data={pagedRows.slice(0, 5)} columns={columns} />
						</div>
					</div>
				</TabsContent>

				{/* Transactions Tab */}
				<TabsContent value="transactions" className="flex-1 min-h-0 flex flex-col gap-6">
					{/* Stock In/Out Forms */}
					<div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
						<StockInForm
							items={EQUIPMENT_ITEMS}
							itemId={activeItem.id}
							quantity={stockInQty}
							note={stockInNote}
							onItemChange={setStockInItemId}
							onQuantityChange={setStockInQty}
							onNoteChange={setStockInNote}
							onSubmit={addStockIn}
							hideItemSelector={true}
						/>

						<StockOutBorrowForm
							items={EQUIPMENT_ITEMS}
							itemId={activeItem.id}
							quantity={borrowQty}
							customerName={borrowCustomer}
							onItemChange={setBorrowItemId}
							onQuantityChange={setBorrowQty}
							onCustomerNameChange={setBorrowCustomer}
							onSubmit={addBorrowStockOut}
							hideItemSelector={true}
						/>
					</div>

					{/* Transaction Table */}
					<SmartDataTable
						className="flex-1 min-h-0"
						maxBodyHeight="100%"
						data={pagedRows}
						columns={columns}
						filterConfig={{
							typeOptions: [
								{ value: "all", label: "All Type" },
								{ value: "stock-in", label: "Stock In" },
								{ value: "stock-out-borrow", label: "Stock Out (Borrow)" },
							],
							fieldOptions: [
								{ value: "item", label: "Item" },
								{ value: "customer", label: "Customer" },
								{ value: "slipNo", label: "Slip No" },
								{ value: "note", label: "Note" },
							],
							typeValue: tableTypeFilter,
							fieldValue: tableFieldFilter,
							searchValue: tableSearchValue,
							onTypeChange: setTableTypeFilter,
							onFieldChange: setTableFieldFilter,
							onSearchChange: setTableSearchValue,
							searchPlaceholder: "Search transaction",
						}}
						paginationConfig={{
							page: currentPage,
							pageSize: tablePageSize,
							totalItems,
							totalPages,
							paginationItems: buildPagination(currentPage, totalPages),
							onPageChange: setTablePage,
							onPageSizeChange: setTablePageSize,
						}}
					/>
				</TabsContent>

				{/* Settings Tab */}
				<TabsContent value="settings" className="flex-1 min-h-0 overflow-auto">
					<EquipmentSettings item={activeItem} onUpdate={(_updates) => {}} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
