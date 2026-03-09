export type TemplateMode = "standard" | "compact" | "detailed";
export type PaperSizeMode = "a4" | "a5" | "letter";
export type SortMode = "default" | "date-desc" | "date-asc" | "customer-asc" | "balance-desc";

export const TEMPLATE_LABELS: Record<TemplateMode, string> = {
	standard: "Standard",
	compact: "Compact",
	detailed: "Detailed",
};

export const PAPER_SIZE_LABELS: Record<PaperSizeMode, string> = {
	a4: "A4",
	a5: "A5",
	letter: "Letter",
};

export const SORT_LABELS: Record<SortMode, string> = {
	default: "Default",
	"date-desc": "Date (Newest)",
	"date-asc": "Date (Oldest)",
	"customer-asc": "Customer (A-Z)",
	"balance-desc": "Balance (High-Low)",
};

const PAPER_SIZE_WRAPPER_CLASS_NAMES: Record<PaperSizeMode, string> = {
	a4: "print:mx-auto print:w-[186mm] print:max-w-[186mm]",
	a5: "print:mx-auto print:w-[118mm] print:max-w-[118mm]",
	letter: "print:mx-auto print:w-[184mm] print:max-w-[184mm]",
};

const PAPER_SIZE_PAGE_VALUES: Record<PaperSizeMode, string> = {
	a4: "A4",
	a5: "A5",
	letter: "Letter",
};

export function getPaperSizeWrapperClassName(paperSizeMode: PaperSizeMode): string {
	return PAPER_SIZE_WRAPPER_CLASS_NAMES[paperSizeMode];
}

export function getPaperSizePageValue(paperSizeMode: PaperSizeMode): string {
	return PAPER_SIZE_PAGE_VALUES[paperSizeMode];
}

export function getTemplateClassName(templateMode: TemplateMode): string {
	switch (templateMode) {
		case "compact":
			return "rounded-t-none gap-4 p-4 text-[11px]";
		case "detailed":
			return "rounded-t-none gap-8 p-8 text-sm";
		default:
			return "rounded-t-none gap-6 p-6";
	}
}
