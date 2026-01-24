import { settingsLeftMenu } from "@/_mock/data/dashboard";
import { SidebarList } from "@/core/components/common";
import { MenuItem } from "./menu-item";

export type SettingsSidebarProps = {
	activeItem: string;
	onSelect: (item: string) => void;
};

export function SettingsSidebar({ activeItem, onSelect }: SettingsSidebarProps) {
	return (
		<SidebarList>
			<nav className="flex flex-col gap-1 flex-1 overflow-y-auto min-h-0 p-1">
				{settingsLeftMenu.map((item) => (
					<MenuItem key={item} label={item} isActive={activeItem === item} onSelect={onSelect} />
				))}
			</nav>
		</SidebarList>
	);
}
