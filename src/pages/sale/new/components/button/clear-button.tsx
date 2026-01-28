import styled from "styled-components";
import { XCircle } from "lucide-react";
import React from "react";

export const ClearButton = styled.span`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.palette.gray[400]};
  cursor: pointer;
  padding: 0;
  z-index: 2;
  &:hover {
    color: ${({ theme }) => theme.colors.palette.gray[600]};
  }
`;

export interface ClearIconButtonProps {
	onClick: (e: React.MouseEvent) => void;
	icon?: React.ReactNode;
	ariaLabel?: string;
	size?: number;
	style?: React.CSSProperties;
}

export function ClearIconButton({ onClick, icon, ariaLabel = "Clear", size = 18, style }: ClearIconButtonProps) {
	const handleKey = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onClick(e as any as React.MouseEvent);
		}
	};

	return (
		<ClearButton
			role="button"
			tabIndex={0}
			aria-label={ariaLabel}
			onClick={onClick}
			onKeyDown={handleKey}
			style={style}
		>
			{icon ?? <XCircle size={size} />}
		</ClearButton>
	);
}
