type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "info" | "success" | "warning" | "error";

const DEFAULT_PRICE_LABEL_MAP: Record<string, string> = {
	retail_price: "Retail Price",
	wholesale_price: "Wholesale Price",
	special_price: "Special Price",
};

export const getDefaultPriceLabel = (value?: string): string => {
	if (!value) return "-";
	return DEFAULT_PRICE_LABEL_MAP[value] || value;
};

export const getDefaultPriceVariant = (value?: string): BadgeVariant => {
	switch (value) {
		case "retail_price":
			return "info";
		case "wholesale_price":
			return "warning";
		case "special_price":
			return "success";
		default:
			return "outline";
	}
};
