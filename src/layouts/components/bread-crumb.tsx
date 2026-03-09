import { ChevronDown } from "lucide-react";
import * as React from "react";
import { useMemo } from "react";
import { Link, useMatches } from "react-router";
import styled from "styled-components";
import type { NavItemDataProps } from "@/core/components/nav";
import useLocale from "@/core/locales/use-locale";
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/core/ui/breadcrumb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/core/ui/dropdown-menu";
import { useFilteredNavData } from "@/layouts/dashboard/nav";
import { getReportDefinition } from "@/pages/dashboard/reports/report-detail/report-registry";
import { getRouteTitle } from "./route-mappings";

interface BreadCrumbProps {
	maxItems?: number;
}

type NavItem = Pick<NavItemDataProps, "path" | "title"> & {
	children?: NavItem[];
};

interface BreadcrumbItemData {
	key: string;
	label: string;
	items: Array<{
		key: string;
		label: string;
	}>;
}

const DASHBOARD_KEY = "/";
const DASHBOARD_PATH_PREFIX = "dashboard";
const BORROW_MODULE = "borrow";
const LOAN_NAV_PATH = "/dashboard/loan";
const DEFAULT_LEAF_LABEL = "Detail";

function findPathInNavData(path: string, items: NavItem[]): NavItem[] {
	for (const item of items) {
		if (item.path === path) return [item];
		if (!item.children) continue;

		const found = findPathInNavData(path, item.children);
		if (found.length > 0) return [item, ...found];
	}

	return [];
}

function toTitleCase(value: string) {
	return value
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function getFallbackModuleLabel(moduleName: string) {
	return toTitleCase(moduleName);
}

function buildBreadcrumbItem(item: NavItem, t: (key: string) => string): BreadcrumbItemData {
	return {
		key: item.path,
		label: t(item.title) || item.title,
		items: item.children?.map((child) => ({ key: child.path, label: t(child.title) || child.title })) ?? [],
	};
}

function resolveLeafLabel(pathname: string, moduleName: string, modulePath: string, segments: string[]) {
	const action = segments[2];
	const subAction = segments[3];

	if (moduleName === "reports" && action === "detail" && subAction) {
		try {
			return getReportDefinition(subAction).title;
		} catch {
			return toTitleCase(subAction);
		}
	}

	const matchedRouteTitle = getRouteTitle(pathname);
	if (matchedRouteTitle && pathname !== modulePath) return matchedRouteTitle;

	if (moduleName === "invoice" && action === "export-preview") return "Export Preview";
	if (action === "create" || action === "new") return "Create";
	if (action === "edit") return "Edit";
	if (action === "payment") return "Payment";

	return DEFAULT_LEAF_LABEL;
}

export default function BreadCrumb({ maxItems = 3 }: BreadCrumbProps) {
	const { t } = useLocale();
	const matches = useMatches();
	const navData = useFilteredNavData();

	const breadCrumbs = useMemo(() => {
		const dashboardItem: BreadcrumbItemData = {
			key: DASHBOARD_KEY,
			label: t("Dashboard") || "Dashboard",
			items: [],
		};

		const pathname = matches[matches.length - 1]?.pathname;
		if (!pathname || matches.length <= 1 || pathname === DASHBOARD_KEY) return [dashboardItem];

		const segments = pathname.split("/").filter(Boolean);
		if (segments.length < 2 || segments[0] !== DASHBOARD_PATH_PREFIX) return [dashboardItem];

		const moduleName = segments[1];
		const modulePath = `/${segments[0]}/${segments[1]}`;
		const navSearchPath = moduleName === BORROW_MODULE ? LOAN_NAV_PATH : modulePath;

		const navItems = navData.flatMap((section) => section.items);
		const pathInNav = findPathInNavData(navSearchPath, navItems);
		const result: BreadcrumbItemData[] = [dashboardItem];

		if (pathInNav.length > 0) {
			result.push(...pathInNav.map((item) => buildBreadcrumbItem(item, t)));
		} else {
			result.push({
				key: modulePath,
				label: t(getFallbackModuleLabel(moduleName)) || getFallbackModuleLabel(moduleName),
				items: [],
			});
		}

		if (pathname !== modulePath && pathname !== navSearchPath) {
			const leafLabel = resolveLeafLabel(pathname, moduleName, modulePath, segments);
			const translatedLeaf = t(leafLabel) || leafLabel;
			const lastItemLabel = result[result.length - 1]?.label;
			if (translatedLeaf !== lastItemLabel) {
				result.push({
					key: pathname,
					label: translatedLeaf,
					items: [],
				});
			}
		}

		return result;
	}, [matches, navData, t]);

	const renderBreadcrumbItem = (item: BreadcrumbItemData, isLast: boolean) => {
		const hasItems = item.items && item.items.length > 0;
		const isDashboard = item.key === "/";

		if (hasItems) {
			return (
				<BreadcrumbItem>
					<DropdownMenu>
						<DropdownMenuTrigger className="flex items-center gap-1">
							{item.label}
							<ChevronDown className="h-4 w-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							{item.items.map((subItem) => (
								<DropdownMenuItem key={subItem.key} asChild>
									<Link to={subItem.key}>{subItem.label}</Link>
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</BreadcrumbItem>
			);
		}

		return (
			<BreadcrumbItem>
				{isLast && !isDashboard ? (
					<StyledBreadcrumbPage>{item.label}</StyledBreadcrumbPage>
				) : (
					<StyledBreadcrumbLink asChild>
						<Link to={item.key}>{item.label}</Link>
					</StyledBreadcrumbLink>
				)}
			</BreadcrumbItem>
		);
	};

	const renderBreadcrumbs = () => {
		if (breadCrumbs.length <= maxItems) {
			return breadCrumbs.map((item, index) => (
				<React.Fragment key={item.key}>
					{renderBreadcrumbItem(item, index === breadCrumbs.length - 1)}
					{index < breadCrumbs.length - 1 && <BreadcrumbSeparator />}
				</React.Fragment>
			));
		}

		// Show first item, ellipsis, and last maxItems-1 items
		const firstItem = breadCrumbs[0];
		const lastItems = breadCrumbs.slice(-(maxItems - 1));
		const hiddenItems = breadCrumbs.slice(1, -(maxItems - 1));

		return (
			<>
				{renderBreadcrumbItem(firstItem, false)}
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<DropdownMenu>
						<DropdownMenuTrigger className="flex items-center gap-1">
							<BreadcrumbEllipsis />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							{hiddenItems.map((item) => (
								<DropdownMenuItem key={item.key} asChild>
									<Link to={item.key}>{item.label}</Link>
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				{lastItems.map((item, index) => (
					<React.Fragment key={item.key}>
						{renderBreadcrumbItem(item, index === lastItems.length - 1)}
						{index < lastItems.length - 1 && <BreadcrumbSeparator />}
					</React.Fragment>
				))}
			</>
		);
	};

	return (
		<StyledBreadcrumb>
			<BreadcrumbList>{renderBreadcrumbs()}</BreadcrumbList>
		</StyledBreadcrumb>
	);
}

//#region Styled Components
const StyledBreadcrumb = styled(Breadcrumb)`
	color: ${({ theme }) => theme.colors.common.black};
`;

const StyledBreadcrumbLink = styled(BreadcrumbLink)`
	color: ${({ theme }) => theme.colors.common.black} !important;
	text-decoration: none;

	&:hover {
		text-decoration: underline;
		color: ${({ theme }) => theme.colors.common.black} !important;
	}
`;

const StyledBreadcrumbPage = styled(BreadcrumbPage)`
	color: ${({ theme }) => theme.colors.palette.gray[500]} !important;
`;
//#endregion
