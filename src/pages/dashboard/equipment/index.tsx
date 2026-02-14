import { useState } from "react";
import { DashboardSplitView } from "@/core/components/common/dashboard-split-view";
import { useSidebarCollapse } from "@/core/hooks/use-sidebar-collapse";
import type { EquipmentItemId } from "@/core/types/equipment";
import { EquipmentContent } from "./components/equipment-content";
import { EquipmentSidebar } from "./components/equipment-sidebar";

export default function EquipmentCenterPage() {
	const [activeItemId, setActiveItemId] = useState<EquipmentItemId | null>(null);
	const { isCollapsed, handleToggle } = useSidebarCollapse();

	return (
		<DashboardSplitView
			sidebarClassName={isCollapsed ? "lg:w-20" : "lg:w-1/4"}
			sidebar={
				<EquipmentSidebar
					activeItemId={activeItemId}
					onSelect={setActiveItemId}
					onToggle={handleToggle}
					isCollapsed={isCollapsed}
				/>
			}
			content={<EquipmentContent activeItemId={activeItemId} />}
		/>
	);
}
