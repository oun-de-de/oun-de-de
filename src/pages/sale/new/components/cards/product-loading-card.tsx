import styled from "styled-components";
import { Skeleton } from "@/core/ui/skeleton";

export interface ProductLoadingCardProps {
	height?: number;
}

export function ProductLoadingCard({ height = 240 }: ProductLoadingCardProps) {
	return (
		<Card style={{ height }}>
			<ImagePlaceholder>
				<Skeleton style={{ width: 100, height: 100, borderRadius: 10 }} />
			</ImagePlaceholder>
			<Name>
				<Skeleton style={{ width: 100, height: 18 }} />
			</Name>
		</Card>
	);
}

//#region Styled Components
const Card = styled.div`
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.palette.gray[200]};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.common.white};
  padding: 12px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ImagePlaceholder = styled.div`
  flex: 1;
  min-height: 120px;
  border: 1px dashed ${({ theme }) => theme.colors.palette.gray[300]};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.palette.gray[400]};
  background: ${({ theme }) => theme.colors.background.neutral[50]};
`;

const Name = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.palette.gray[800]};
  min-height: 18px;
  display: flex;
  align-items: center;
`;
//#endregion
