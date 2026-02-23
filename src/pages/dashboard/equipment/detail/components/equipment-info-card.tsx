import { useState } from "react";
import Icon from "@/core/components/icon/icon";
import type { InventoryItem } from "@/core/types/inventory";
import { Badge } from "@/core/ui/badge";
import { Button } from "@/core/ui/button";
import { Input } from "@/core/ui/input";
import { Label } from "@/core/ui/label";
import { Text } from "@/core/ui/typography";

function StatItem({ label, primary, children }: { label: string; primary?: boolean; children: React.ReactNode }) {
	return (
		<div className="space-y-1.5 flex flex-col">
			<Text variant="caption" className="text-slate-500">
				{label}
			</Text>
			{typeof children === "string" || typeof children === "number" ? (
				<Text variant="body1" className={primary ? "text-2xl font-bold" : "text-xl font-semibold"}>
					{children}
				</Text>
			) : (
				children
			)}
		</div>
	);
}

type EquipmentInfoCardProps = {
	item: InventoryItem;
	onUpdate?: (updatedItem: Partial<InventoryItem>) => void;
};

export function EquipmentInfoCard({ item, onUpdate }: EquipmentInfoCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedName, setEditedName] = useState(item.name);

	const isLowStock = item.quantityOnHand <= item.alertThreshold;

	const handleSave = () => {
		if (onUpdate) {
			onUpdate({
				name: editedName,
			});
		}
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditedName(item.name);
		setIsEditing(false);
	};

	return (
		<div className="rounded-lg border bg-white p-6 shadow-sm">
			<div className="flex items-start justify-between mb-4 md:mb-6">
				<div className="flex-1">
					{isEditing ? (
						<div className="space-y-4">
							<div>
								<Label htmlFor="item-name">Item Name</Label>
								<Input
									id="item-name"
									value={editedName}
									onChange={(e) => setEditedName(e.target.value)}
									className="mt-1"
								/>
							</div>
						</div>
					) : (
						<div className="flex flex-col">
							<Text variant="body1" className="text-2xl font-bold">
								{item.name}
							</Text>
							<Text variant="body2" className="text-slate-500 mt-1">
								{item.code} • {item.type}
							</Text>
						</div>
					)}
				</div>
				<div className="flex items-center gap-2">
					<Badge variant={isLowStock ? "warning" : "success"}>{isLowStock ? "Low Stock" : "Normal"}</Badge>
					{!isEditing && onUpdate && (
						<Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
							<Icon icon="mdi:pencil" className="mr-1" />
							Edit
						</Button>
					)}
				</div>
			</div>

			{isEditing && (
				<div className="flex gap-2 mt-4 pt-4 border-t">
					<Button size="sm" onClick={handleSave}>
						<Icon icon="mdi:check" className="mr-1" />
						Save
					</Button>
					<Button size="sm" variant="outline" onClick={handleCancel}>
						<Icon icon="mdi:close" className="mr-1" />
						Cancel
					</Button>
				</div>
			)}

			{!isEditing && (
				<div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t">
					<StatItem label="Quantity On Hand" primary>
						{item.quantityOnHand}
					</StatItem>
					<StatItem label="Alert Threshold">{item.alertThreshold}</StatItem>
					<StatItem label="Unit">{item.unit?.name ?? "-"}</StatItem>
					<StatItem label="Status">
						<Badge variant="info">Active</Badge>
					</StatItem>
				</div>
			)}
		</div>
	);
}
