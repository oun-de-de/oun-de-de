import { SidebarList } from "@/core/components/common";
import { Skeleton } from "@/core/ui/skeleton";

const SKELETON_ITEMS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"] as const;

function MenuItemSkeleton() {
	return (
		<div className="flex items-center gap-2 px-3 py-2">
			<Skeleton className="h-3 w-3 rounded-full" />
			<Skeleton className="h-4 w-24 rounded" />
		</div>
	);
}

export function SettingsSidebarSkeleton() {
	return (
		<SidebarList>
			<div className="flex flex-col gap-1 flex-1 p-1">
				{SKELETON_ITEMS.map((id) => (
					<MenuItemSkeleton key={id} />
				))}
			</div>
		</SidebarList>
	);
}
