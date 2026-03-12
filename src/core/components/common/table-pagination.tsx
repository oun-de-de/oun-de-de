import Icon from "@/core/components/icon/icon";
import { Button } from "@/core/ui/button";
import { Input } from "@/core/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/ui/select";

type PaginationProps = {
	pages: Array<number | "...">;
	currentPage: number;
	totalPages: number;
	totalItems: number;
	pageSize: number;
	pageSizeOptions: number[];

	goToValue?: string;
	goToLabel?: string;
	totalLabel?: string;

	onPrev?: () => void;
	onNext?: () => void;
	onPageChange?: (page: number) => void;
	onPageSizeChange?: (size: number) => void;

	onGoToChange?: (value: string) => void;
	onGoToSubmit?: (page: number) => void;
};

export function TablePagination({
	pages,
	currentPage,
	totalPages,
	totalItems,
	pageSize,
	pageSizeOptions,
	goToValue,
	goToLabel = "Go to",
	totalLabel = "Total",
	onPrev,
	onNext,
	onPageChange,
	onPageSizeChange,
	onGoToChange,
	onGoToSubmit,
}: PaginationProps) {
	const canPrev = currentPage > 1;
	const canNext = currentPage < totalPages;

	const rawGoTo = goToValue ?? String(currentPage);

	const submitGoTo = () => {
		const n = Number(rawGoTo);
		if (!Number.isFinite(n)) return;
		const clamped = Math.min(Math.max(Math.trunc(n), 1), totalPages);
		onGoToSubmit?.(clamped);
	};

	let lastPage: number | null = null;
	const pageLinks = pages.map((page) => {
		if (page === "...") {
			return (
				<div
					key={`gap-after-${lastPage}`}
					className="flex h-8 w-8 items-center justify-center select-none text-gray-500"
					aria-hidden="true"
				>
					...
				</div>
			);
		}
		lastPage = page;
		return (
			<Button
				key={page}
				size="icon"
				className="h-8 w-8"
				variant={page === currentPage ? "default" : "ghost"}
				disabled={!onPageChange || page === currentPage}
				aria-current={page === currentPage ? "page" : undefined}
				onClick={() => onPageChange?.(page)}
			>
				{page}
			</Button>
		);
	});

	return (
		<div className="flex w-full flex-col gap-4 p-3 text-xs text-gray-700 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
			<div className="flex min-w-0 w-full items-center gap-1 sm:w-auto sm:flex-1">
				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8 shrink-0"
					onClick={onPrev}
					disabled={!canPrev || !onPrev}
					aria-label="Previous page"
				>
					<Icon icon="mdi:chevron-left" />
				</Button>

				<div className="min-w-0 flex-1 overflow-x-auto">
					<div className="flex w-max min-w-full items-center gap-1">{pageLinks}</div>
				</div>

				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8 shrink-0"
					onClick={onNext}
					disabled={!canNext || !onNext}
					aria-label="Next page"
				>
					<Icon icon="mdi:chevron-right" />
				</Button>
			</div>

			<div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
				<span>{goToLabel}</span>
				<div className="w-[56px]">
					<Input
						className="h-8 px-2 text-xs"
						value={rawGoTo}
						inputMode="numeric"
						onChange={(e) => onGoToChange?.(e.target.value)}
						onBlur={submitGoTo}
						onKeyDown={(e) => {
							if (e.key === "Enter") submitGoTo();
						}}
						aria-label="Go to page"
					/>
				</div>

				<Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange?.(Number(v))}>
					<SelectTrigger className="h-8 w-[92px] text-xs">
						<SelectValue placeholder={`${pageSize}`} />
					</SelectTrigger>
					<SelectContent>
						{pageSizeOptions.map((size) => (
							<SelectItem key={size} value={String(size)}>
								{size}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<span>
					{totalLabel} {totalItems}
				</span>
			</div>
		</div>
	);
}
