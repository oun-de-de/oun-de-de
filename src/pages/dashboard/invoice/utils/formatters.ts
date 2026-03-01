import type { InvoiceType } from "@/core/types/invoice";

export * from "@/core/utils/formatters";

export const isInvoiceType = (value: string): value is InvoiceType => value === "invoice" || value === "receipt";
