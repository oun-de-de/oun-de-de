import { useMemo, useState } from "react";
import { EntityListItem, SidebarList } from "@/core/components/common";
import { up, useMediaQuery } from "@/core/hooks/use-media-query";
import { useSidebarPagination } from "@/core/hooks/use-sidebar-pagination";
import type { EquipmentItem, EquipmentItemId } from "@/core/types/equipment";
import { useRouter } from "@/routes/hooks/use-router";
import { EQUIPMENT_ITEMS } from "../constants/constants";

type Props = {
	activeItemId: EquipmentItemId | null;
	onSelect: (id: EquipmentItemId | null) => void;
	onToggle?: () => void;
	isCollapsed?: boolean;
};

const normalizeText = (value: string) => value.trim().toLowerCase();

const matchSearch = (item: EquipmentItem, normalizedQuery: string) =>
	normalizedQuery === "" ||
	item.name.toLowerCase().includes(normalizedQuery) ||
	item.category.toLowerCase().includes(normalizedQuery);

export function EquipmentSidebar({ activeItemId, onSelect, onToggle, isCollapsed }: Props) {
	const [searchTerm, setSearchTerm] = useState("");
	const router = useRouter();
	const isLgUp = useMediaQuery(up("lg"));
	const normalizedQuery = normalizeText(searchTerm);

	const filteredList = useMemo(
		() => EQUIPMENT_ITEMS.filter((item) => matchSearch(item, normalizedQuery)),
		[normalizedQuery],
	);

	const pagination = useSidebarPagination({
		data: filteredList,
		enabled: !isLgUp,
	});

	const sidebarData = pagination.pagedData.map((item) => ({
		id: item.id,
		name: item.name,
		code: item.category,
	}));

	const handleSelect = (id: string | null) => {
		if (!id) return;
		const itemId = id as EquipmentItemId;
		router.push(`/dashboard/equipment/${itemId}`);
		onSelect(itemId);
	};

	return (
		<SidebarList>
			<SidebarList.Header
				showMainTypeFilter={false}
				searchPlaceholder="Search equipment..."
				searchValue={searchTerm}
				onSearchChange={setSearchTerm}
				onMenuClick={onToggle}
				isCollapsed={isCollapsed}
			/>

			<SidebarList.Body
				className="flex-1 min-h-0"
				data={sidebarData}
				estimateSize={40}
				gap={8}
				height="100%"
				renderItem={(item, style) => (
					<EntityListItem
						key={item.id}
						entity={item}
						isActive={item.id === activeItemId}
						onSelect={handleSelect}
						style={style}
						isCollapsed={isCollapsed}
					/>
				)}
			/>

			<SidebarList.Footer
				total={pagination.total}
				isCollapsed={isCollapsed}
				onPrev={pagination.handlePrev}
				onNext={pagination.handleNext}
				hasPrev={pagination.hasPrev}
				hasNext={pagination.hasNext}
				showControls={!isLgUp && pagination.totalPages > 1}
			/>
		</SidebarList>
	);
}
