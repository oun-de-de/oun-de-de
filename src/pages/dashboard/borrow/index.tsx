import { useState } from "react";
import { DashboardSplitView } from "@/core/components/common/dashboard-split-view";
import { useBorrowList, useBorrowListActions } from "@/pages/dashboard/borrow/stores/borrowStore";
import { BorrowContent } from "./components/borrow-content";
import { BorrowSidebar } from "./components/borrow-sidebar";

export default function BorrowPage() {
	const [activeBorrowId, setActiveBorrowId] = useState<string | null>(null);
	const listState = useBorrowList();
	const { updateState } = useBorrowListActions();
	const [isCollapsed, setIsCollapsed] = useState(false);

	return (
		<DashboardSplitView
			sidebarClassName={isCollapsed ? "lg:w-20" : "lg:w-1/4"}
			sidebar={
				<BorrowSidebar
					activeBorrowId={activeBorrowId}
					onSelect={setActiveBorrowId}
					onToggle={() => setIsCollapsed((prev) => !prev)}
					isCollapsed={isCollapsed}
				/>
			}
			content={<BorrowContent activeBorrowId={activeBorrowId} listState={listState} updateState={updateState} />}
		/>
	);
}
