import { Icon } from "@/core/components/icon";
import Logo from "@/core/components/logo";
import { NavVertical } from "@/core/components/nav";
import type { NavProps } from "@/core/components/nav/types";
import { GLOBAL_CONFIG } from "@/global-config";
import { Button } from "@/core/ui/button";
import { ScrollArea } from "@/core/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/core/ui/sheet";

export function NavMobileLayout({ data }: NavProps) {
	return (
		<Sheet modal={false}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon">
					<Icon icon="local:ic-menu" size={24} />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="[&>button]:hidden px-2 w-[280px]">
				<div className="flex gap-2 px-2 h-[var(--layout-header-height)] items-center">
					<Logo />
					<span className="text-xl font-bold">{GLOBAL_CONFIG.appName}</span>
				</div>
				<ScrollArea className="h-full">
					<NavVertical data={data} />
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
