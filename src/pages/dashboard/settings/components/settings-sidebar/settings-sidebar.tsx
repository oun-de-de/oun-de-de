import { settingsLeftMenu } from "@/_mock/data/dashboard";
import { SidebarList } from "@/core/components/common";
import { MenuItem } from "./menu-item";

export type SettingsSidebarProps = {
	activeItem: string;
	onSelect: (item: string) => void;
	onToggle?: () => void;
	isCollapsed?: boolean;
};

export function SettingsSidebar({ activeItem, onSelect, onToggle, isCollapsed }: SettingsSidebarProps) {
	return (
		<SidebarList>
			<SidebarList.Toggle onToggle={onToggle} isCollapsed={isCollapsed} />

			<nav className="flex flex-col gap-1 flex-1 overflow-y-auto min-h-0 p-1">
				{settingsLeftMenu.map((item) => (
					<MenuItem
						key={item}
						label={item}
						isActive={activeItem === item}
						onSelect={onSelect}
						isCollapsed={isCollapsed}
					/>
				))}
			</nav>
		</SidebarList>
	);
}
