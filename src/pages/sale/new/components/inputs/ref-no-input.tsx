import { styled } from "styled-components";
import { Icon } from "@/core/components/icon";

export function RefNoInput() {
	return (
		<Container className="px-1">
			<FieldLabel htmlFor="ref-no-input">Ref No</FieldLabel>
			<Content>
				<InputGroup>
					<Prefix>CS</Prefix>
					<Input id="ref-no-input" value="256554803446" readOnly />
					<Suffix>
						<Icon icon="mdi:barcode" size={20} />
					</Suffix>
				</InputGroup>
			</Content>
		</Container>
	);
}

//#region Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 32px;
`;

const FieldLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.palette.gray[700]};
  display: flex;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.palette.gray[300]};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.common.white};
  overflow: hidden;
`;

const Prefix = styled.span`
  padding: 0 18px;
  background: ${({ theme }) => theme.colors.palette.gray[100]};
  color: ${({ theme }) => theme.colors.palette.gray[500]};
  font-size: 15px;
  font-weight: 500;
  border-right: 1px solid ${({ theme }) => theme.colors.palette.gray[300]};
  display: flex;
  align-items: center;
  height: 36px;
`;

const Input = styled.input`
  border: none;
  outline: none;
  background: transparent;
  padding: 0 10px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.palette.gray[700]};
  height: 36px;
`;

const Suffix = styled.span`
  padding: 0 12px;
  display: flex;
  align-items: center;
  height: 36px;
  border-left: 1px solid ${({ theme }) => theme.colors.palette.gray[300]};
  background: ${({ theme }) => theme.colors.palette.gray[100]};
  color: ${({ theme }) => theme.colors.palette.gray[500]};
`;
//#endregion
