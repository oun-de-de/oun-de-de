import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { SmartDataTable, SummaryStatCard } from "@/core/components/common";
import Icon from "@/core/components/icon/icon";
import type { Cycle } from "@/core/types/cycle";
import { Button } from "@/core/ui/button";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	useComboboxAnchor,
} from "@/core/ui/combobox";
import { Label } from "@/core/ui/label";
import { Text } from "@/core/ui/typography";
import { cn } from "@/core/utils";
import { DURATION_OPTIONS } from "../constants/constants";
import { useCycleTable } from "../hooks/use-cycle-table";
import { getCycleColumns } from "./cycle-columns";

type CycleContentProps = {
	customerId: string | null;
	customerName: string | null;
	onSelectCycle: (cycle: Cycle) => void;
	requireCustomer?: boolean;
};

const sanitizeDurationInput = (value: string) => value.replace(/\D+/g, "");
const ALL_DURATION_LABEL = "All Duration";

const getDurationDisplayValue = (duration: number) => {
	if (duration === 0) return ALL_DURATION_LABEL;
	return String(duration);
};

function normalizeDurationInput(value: string) {
	const trimmedValue = value.trim();
	if (trimmedValue.toLowerCase() === ALL_DURATION_LABEL.toLowerCase()) {
		return ALL_DURATION_LABEL;
	}
	return sanitizeDurationInput(trimmedValue);
}

export function CycleContent({ customerId, customerName, onSelectCycle, requireCustomer = false }: CycleContentProps) {
	const navigate = useNavigate();
	const {
		cycles,
		summaryCards,
		duration,
		onDurationChange,
		onResetFilters,
		currentPage,
		pageSize,
		totalItems,
		totalPages,
		paginationItems,
		onPageChange,
		onPageSizeChange,
		isLoading,
	} = useCycleTable(customerId, requireCustomer);

	const [durationInput, setDurationInput] = useState(() => getDurationDisplayValue(duration));
	const durationAnchorRef = useComboboxAnchor();
	const selectedDurationOption = useMemo(
		() => DURATION_OPTIONS.find((option) => option.value === String(duration)) ?? null,
		[duration],
	);

	const columns = useMemo(() => getCycleColumns(), []);

	useEffect(() => {
		setDurationInput(getDurationDisplayValue(duration));
	}, [duration]);

	if (requireCustomer && !customerId) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-center space-y-2">
					<Icon icon="mdi:account-arrow-left" className="text-4xl text-slate-300 mx-auto" />
					<Text variant="body1" className="text-slate-400">
						Select a customer from the sidebar to view cycles
					</Text>
				</div>
			</div>
		);
	}

	return (
		<div className={`flex w-full flex-col gap-4 ${isLoading ? "opacity-60 pointer-events-none" : ""}`}>
			{/* Header */}
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<Button size="sm" className="gap-1">
						Cycles
					</Button>
					<Text variant="body2" className="text-muted-foreground">
						{customerName ? `${customerName} selected` : "Select a customer"}
					</Text>
				</div>
				<div className="flex items-center gap-2">
					<Button size="sm" onClick={() => navigate("/dashboard/coupons/create")}>
						Create Coupons
					</Button>
				</div>
			</div>

			{/* Summary */}
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
				{summaryCards.map((card) => (
					<SummaryStatCard key={card.label} {...card} />
				))}
			</div>

			{/* Filters: Duration + Date Range */}
			<div className="flex flex-wrap items-center justify gap-4 rounded-lg border p-4">
				<div className="space-y-1.5">
					<Label>Duration</Label>
					<Combobox<(typeof DURATION_OPTIONS)[number]>
						items={DURATION_OPTIONS}
						value={selectedDurationOption}
						inputValue={durationInput}
						onValueChange={(option) => {
							const nextDuration = Number(option?.value ?? 0);
							setDurationInput(option?.label ?? ALL_DURATION_LABEL);
							onDurationChange(nextDuration);
						}}
						onInputValueChange={(nextInputValue) => {
							const normalizedInput = normalizeDurationInput(nextInputValue);
							setDurationInput(normalizedInput);
							onDurationChange(
								normalizedInput === "" || normalizedInput === ALL_DURATION_LABEL ? 0 : Number(normalizedInput),
							);
						}}
					>
						<div ref={durationAnchorRef} className="w-[180px]">
							<ComboboxInput className={cn("w-full bg-background")} placeholder="Duration" aria-label="Duration" />
						</div>
						<ComboboxContent anchor={durationAnchorRef}>
							<ComboboxEmpty>No matching duration.</ComboboxEmpty>
							<ComboboxList>{(option) => <ComboboxItem value={option}>{option.label}</ComboboxItem>}</ComboboxList>
						</ComboboxContent>
					</Combobox>
				</div>

				{/* <div className="space-y-1.5">
					<Label>From</Label>
					<Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
				</div>
				<div className="space-y-1.5">
					<Label>To</Label>
					<Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
				</div> */}
				<div className="space-y-1.5">
					<div className="h-2" aria-hidden="true" />
					<Button
						size="sm"
						className="h-8"
						onClick={() => {
							setDurationInput(getDurationDisplayValue(0));
							onResetFilters();
						}}
					>
						Reset Default
					</Button>
				</div>
			</div>

			{/* Cycles Table */}
			<SmartDataTable
				className="flex-1 min-h-0"
				maxBodyHeight="100%"
				data={cycles}
				columns={columns}
				onRowClick={(row) => onSelectCycle(row)}
				paginationConfig={{
					page: currentPage,
					pageSize,
					totalItems,
					totalPages,
					paginationItems,
					onPageChange,
					onPageSizeChange,
				}}
			/>
		</div>
	);
}
