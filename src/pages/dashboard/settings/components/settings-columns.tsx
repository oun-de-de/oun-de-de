import type { ColumnDef } from "@tanstack/react-table";
import Icon from "@/core/components/icon/icon";
import type { SettingsRow } from "@/core/types/common";
import { Button } from "@/core/ui/button";
import { settingsSidebarBoundStore } from "../stores/settings-sidebar";

export const columns: ColumnDef<SettingsRow>[] = [
	{
		header: "Name",
		accessorKey: "name",
		meta: { className: "text-sky-600" },
	},
	{
		header: "Type",
		accessorKey: "type",
		accessorFn: (row) => row.type || "System",
		meta: { className: "text-gray-600" },
	},
	{
		id: "actions",
		header: "",
		cell: ({ row }) => (
			<Button
				variant="ghost"
				size="sm"
				onClick={() => settingsSidebarBoundStore.useAction().openEditForm(row.original)}
			>
				<Icon icon="mdi:pencil" className="h-4 w-4" />
			</Button>
		),
		meta: { className: "w-12" },
	},
];
