import { memo, useCallback } from "react";
import styled, { css } from "styled-components";
import Icon from "@/core/components/icon/icon";
import { Button } from "@/core/ui/button";

export type MenuItemProps = {
	label: string;
	isActive: boolean;
	onSelect: (item: string) => void;
	isCollapsed?: boolean;
};

const ICONS = {
	active: "mdi:checkbox-blank-circle",
	inactive: "mdi:checkbox-blank-circle-outline",
} as const;

const StyledButton = styled(Button)<{ $isActive: boolean }>`
	justify-content: flex-start;
	letter-spacing: 0.025em;

	${({ $isActive }) =>
		$isActive &&
		css`
			background-color: rgb(2 132 199);
			color: white;
			font-size: 1rem;

			&:hover {
				background-color: rgb(2 132 199 / 0.9);
			}
		`}
`;

export const MenuItem = memo(function MenuItem({ label, isActive, onSelect, isCollapsed }: MenuItemProps) {
	const handleClick = useCallback(() => onSelect(label), [label, onSelect]);

	if (isCollapsed) {
		return (
			<StyledButton
				variant="ghost"
				size="icon"
				onClick={handleClick}
				$isActive={isActive}
				className="w-8 h-8 mx-auto rounded-lg mb-1"
				title={label}
			>
				<span className="font-bold text-lg">{label.charAt(0)}</span>
			</StyledButton>
		);
	}

	return (
		<StyledButton variant="ghost" size="sm" onClick={handleClick} $isActive={isActive}>
			<Icon icon={isActive ? ICONS.active : ICONS.inactive} className="mr-2 text-xs" />
			{label}
		</StyledButton>
	);
});
