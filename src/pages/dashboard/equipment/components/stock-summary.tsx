import type { EquipmentSummaryRow } from "@/core/types/equipment";
import { Badge } from "@/core/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/ui/card";

interface StockSummaryProps {
	rows: EquipmentSummaryRow[];
}

export function StockSummary({ rows }: StockSummaryProps) {
	return (
		<Card className="xl:col-span-1">
			<CardHeader className="pb-3">
				<CardTitle className="text-base">Stock Summary</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				{rows.map((row) => (
					<div key={row.item.id} className="rounded-md border p-3 text-sm">
						<div className="mb-2 flex items-center justify-between gap-2">
							<div>
								<div className="font-medium text-slate-700">{row.item.name}</div>
								<div className="text-xs text-slate-500">Threshold: {row.item.alertThreshold}</div>
							</div>
							<Badge variant={row.isLowStock ? "warning" : "success"}>{row.isLowStock ? "Low Stock" : "Normal"}</Badge>
						</div>
						<div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
							<div>IN: {row.stockIn}</div>
							<div>OUT: {row.stockOut}</div>
							<div>REMAINING: {row.remaining}</div>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
