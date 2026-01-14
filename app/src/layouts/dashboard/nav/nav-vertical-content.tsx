import { NavMini, NavVertical } from "@/components/nav";
import { NavNewButton } from "@/components/nav/components";
import type { NavProps } from "@/components/nav/types";
import { GLOBAL_CONFIG } from "@/global-config";
import { useSettings } from "@/store/settingStore";
import { ThemeLayout } from "@/types/enum";
import { ScrollArea } from "@/ui/scroll-area";
import { newActions as backendNewActions } from "./nav-data/nav-data-backend";
import { newActions as frontendNewActions } from "./nav-data/nav-data-frontend";
import styled from "styled-components";

type Props = {
	data: NavProps["data"];
};

export function NavVerticalContent({ data }: Props) {
	const { themeLayout } = useSettings();
	const isMini = themeLayout === ThemeLayout.Mini;

	const actions = GLOBAL_CONFIG.routerMode === "frontend" ? frontendNewActions : backendNewActions;

	return (
		<StyledScrollArea>
			<NavNewButton actions={actions} />
			{isMini ? <NavMini data={data} /> : <NavVertical data={data} />}
		</StyledScrollArea>
	);
}

//#region Styled Components
const StyledScrollArea = styled(ScrollArea)`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.background.default};
	padding: 0 0.5rem;
	padding-top: 8px;
`;
//#endregion