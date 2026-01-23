import { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/core/ui/card";

export type DashboardCardProps = {
	title: ReactNode;
	subheader?: ReactNode;
	children?: ReactNode;
};

export default function DashboardCard({ title, subheader, children }: DashboardCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{subheader ? <CardAction>{subheader}</CardAction> : null}
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}
