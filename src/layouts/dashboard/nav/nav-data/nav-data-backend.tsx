import { DB_MENU } from "@/_mock/assets_backup";
import { Icon } from "@/core/components/icon";
import type { NavItemDataProps, NavProps } from "@/core/components/nav";
import type { MenuTree } from "@/core/types/entity";
import { Badge } from "@/core/ui/badge";
import { convertFlatToTree } from "@/core/utils/tree";

const convertChildren = (children?: MenuTree[]): NavItemDataProps[] => {
	if (!children?.length) return [];

	return children.map((child) => ({
		title: child.name,
		path: child.path || "",
		icon: child.icon ? typeof child.icon === "string" ? <Icon icon={child.icon} size="24" /> : child.icon : null,
		caption: child.caption,
		info: child.info ? <Badge variant="default">{child.info}</Badge> : null,
		disabled: child.disabled,
		externalLink: child.externalLink,
		auth: child.auth,
		hidden: child.hidden,
		children: convertChildren(child.children),
	}));
};

const convert = (menuTree: MenuTree[]): NavProps["data"] => {
	return menuTree.map((item) => ({
		name: item.name,
		items: convertChildren(item.children),
	}));
};

export const backendNavData: NavProps["data"] = convert(convertFlatToTree(DB_MENU));

export const newActions = [
	{
		title: "Sales",
		items: [
			{ title: "Create Coupon", href: "/dashboard/coupons/create" },
			{ title: "Create Receipt", href: "/dashboard/customers/create-receipt" },
		],
	},
	{
		title: "Users",
		items: [
			{ title: "New Customer", href: "/dashboard/customers/create" },
			{ title: "New Employee", href: "/dashboard/employees/create" },
			{ title: "Loan Request", href: "/dashboard/loan/new" },
		],
	},
	{
		title: "Accounting",
		items: [
			{ title: "General Ledger", href: "/dashboard/reports/detail/general-ledger" },
			{ title: "Trial Balance", href: "/dashboard/reports/detail/trial-balance" },
			{ title: "Income & Expense", href: "/dashboard/reports/detail/balance-sheet" },
			{ title: "Daily Report", href: "/dashboard/reports/detail/daily-report" },
		],
	},
] as const;
