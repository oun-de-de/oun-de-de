import { Button } from "@/core/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/core/ui/tooltip";
import { Icon } from "@/core/components/icon";
import { Input } from "@/core/ui/input";
import styled from "styled-components";

export function CartActions() {
	return (
		<ActionsContainer>
			<ActionsGrid>
				<LeftCol>
					<LeftAction />
				</LeftCol>
				<RightCol>
					<RightAction />
				</RightCol>
			</ActionsGrid>
		</ActionsContainer>
	);
}

function LeftAction() {
	return (
		<>
			<ShortcutLabel>
				Shortcut key
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<StyledIcon icon="mdi:help-circle-outline" size={18} tabIndex={0} />
						</TooltipTrigger>
						<TooltipContent side="top" align="start">
							Use keyboard shortcuts for faster actions
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</ShortcutLabel>
			<ButtonRow>
				<StyledButton variant="default" size="lg">
					Save
				</StyledButton>
				<StyledButton variant="default" size="lg">
					Pay
				</StyledButton>
			</ButtonRow>
			<ButtonRow>
				<StyledButton variant="contrast" size="lg">
					Hold
				</StyledButton>
				<StyledButton variant="outline" size="lg">
					Cancel
				</StyledButton>
			</ButtonRow>
		</>
	);
}

function RightAction() {
	return (
		<CartAmountBox>
			<AmountRow>
				<AmountLabel>SubTotal:</AmountLabel>
				<Amount>៛</Amount>
			</AmountRow>
			<DiscountInputRow>
				<div className="w-[160px] justify-end flex">
					<DiscountTypeGroup>
						<DiscountTypeBtn active>%</DiscountTypeBtn>
						<DiscountTypeBtn>$</DiscountTypeBtn>
					</DiscountTypeGroup>
				</div>
				<DiscountInputDivider>:</DiscountInputDivider>
				<DiscountInput type="number" min={0} defaultValue={0} />
			</DiscountInputRow>
			<AmountRow>
				<AmountLabel>Total Discount:</AmountLabel>
				<Amount>៛</Amount>
			</AmountRow>
			<AmountRow>
				<AmountLabel>Total Tax:</AmountLabel>
				<Amount>៛</Amount>
			</AmountRow>
			<AmountRow>
				<TotalLabel>Total:</TotalLabel>
				<Amount>៛</Amount>
			</AmountRow>
		</CartAmountBox>
	);
}

//#region Styled Components
const ActionsContainer = styled.div.attrs({ className: "px-1" })`
  width: 100%;
`;

const ActionsGrid = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  width: 100%;
`;

const LeftCol = styled.div`
  flex: 1.2;
  min-width: 0;
`;

const RightCol = styled.div`
  flex: 1;
  min-width: 0;
`;

const ShortcutLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.palette.gray[700]};
  margin-bottom: 4px;
  display: flex;
  align-items: center;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const StyledIcon = styled(Icon)`
  margin-left: 6px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.palette.warning.default} !important;
  &:focus {
    outline: none;
  }
`;

const StyledButton = styled(Button)`
  padding: 32px 16px;
  flex: 1;
  background: ${({ variant, theme }) => {
		switch (variant) {
			case "contrast":
				return theme.colors.palette.warning.default;
			case "outline":
				return theme.colors.common.white;
			default:
				return "";
		}
	}};
  color: ${({ variant, theme }) => {
		switch (variant) {
			case "contrast":
				return theme.colors.common.white;
			case "outline":
				return theme.colors.palette.gray[700];
			default:
				return "";
		}
	}};
  border: ${({ variant, theme }) => {
		switch (variant) {
			case "contrast":
				return "none";
			case "outline":
				return `1px solid ${theme.colors.palette.gray[300]}`;
			default:
				return "";
		}
	}};

  &:hover {
    background: ${({ variant, theme }) => {
			switch (variant) {
				case "contrast":
					return theme.colors.palette.warning.dark;
				case "outline":
					return theme.colors.palette.gray[100];
				default:
					return "";
			}
		}};
  }
`;

const CartAmountBox = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.common.white};
  border: 1px solid ${({ theme }) => theme.colors.palette.gray[300]};
  border-radius: 4px;
  padding: 3px 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const AmountRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AmountLabel = styled.span`
  font-size: 15px;
  font-weight: 600;
  width: 160px;
  text-align: right;
  color: ${({ theme }) => theme.colors.palette.gray[700]};
`;

const Amount = styled.span`
  margin-left: 8px;
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.common.black};
`;

const DiscountInputRow = styled.div`
  display: flex;
  align-items: center;
`;

const DiscountTypeGroup = styled.div`
  display: flex;
  border-radius: 4px;
  width: fit-content;
  justify-content: flex-end;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.palette.gray[300]};
  height: 36px;
`;

const DiscountTypeBtn = styled.button.attrs<{ active?: boolean }>(({ active }) => ({
	className: active ? "bg-blue-400 text-white" : "",
}))<{ active?: boolean }>`
  border: none;
  padding: 0 16px;
  width: fit-content;
  height: 36px;
  font-size: 18px;
  font-weight: 600;
`;

const DiscountInputDivider = styled.span`
  font-size: 22px;
  color: ${({ theme }) => theme.colors.palette.gray[400]};
  margin: 0 8px;
`;

const DiscountInput = styled(Input)`
  flex: 1;
  font-size: 18px;
  min-width: 0;
  height: 36px;
`;

const TotalLabel = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.common.black};
  width: 160px;
  text-align: right;

`;
//#endregion
