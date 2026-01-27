import { Card, CardContent } from "@/core/ui/card";
import { MultiStoreListener } from "@/core/ui/store/multi-store-listener";
import { useStore } from "@/core/ui/store/multi-store-provider";
import { ReactNode } from "react";
import { SaleProductStore } from "../stores/sale-products/sale-products-store";

type SaleLayoutProps = {
	leftContent: ReactNode;
	rightContent: ReactNode;
};

export function SaleLayout({ leftContent, rightContent }: SaleLayoutProps) {
	const store = useStore<SaleProductStore>("saleProductsStore");

	return (
		<MultiStoreListener
			listeners={[
				{
					store: store,
					listener: (_state) => {},
				},
			]}
		>
			<div className="grid grid-cols-20 gap-2 h-full min-h-0 flex-1">
				<Card className="col-span-9 h-full py-0">
					<CardContent className="h-full flex flex-col min-h-0 px-2">{leftContent}</CardContent>
				</Card>

				<Card className="col-span-11 h-full py-0">
					<CardContent className="h-full flex flex-col gap-4 min-h-0 px-2">{rightContent}</CardContent>
				</Card>
			</div>
		</MultiStoreListener>
	);
}
