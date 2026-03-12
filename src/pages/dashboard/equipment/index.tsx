import { useState } from "react";
import { DashboardSplitView } from "@/core/components/common/dashboard-split-view";
import { useSidebarCollapse } from "@/core/hooks/use-sidebar-collapse";
import { EquipmentContent } from "./components/equipment-content";
import { EquipmentSidebar } from "./components/equipment-sidebar";

export default function EquipmentCenterPage() {
	const [activeItemId, setActiveItemId] = useState<string | null>(null);
	const { isCollapsed, handleToggle } = useSidebarCollapse();

	return (
		<DashboardSplitView
			sidebarClassName={isCollapsed ? "lg:w-20 xl:w-20" : "lg:w-[16rem] xl:w-1/5"}
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
