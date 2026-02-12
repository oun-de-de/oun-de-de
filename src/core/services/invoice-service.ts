import type { PaginatedResponse } from "@/core/types/common";
import type { Invoice, InvoiceStatus, InvoiceType } from "@/core/types/invoice";
import type { Pagination } from "@/core/types/pagination";
import { mapPaginatedResponseToPagination } from "@/core/utils/pagination";
import { apiClient } from "../api/apiClient";

export enum INVOICE_API {
	LIST = "/invoices",
}

export const getInvoices = (params?: {
	page?: number;
	size?: number;
	sort?: string;
	status?: InvoiceStatus;
	type?: InvoiceType;
	refNo?: string;
	customerName?: string;
	customerId?: string;
}): Promise<Pagination<Invoice>> =>
	apiClient
		.get<PaginatedResponse<Invoice>>({
			url: INVOICE_API.LIST,
			params: {
				page: params?.page ? params.page - 1 : 0,
				size: params?.size,
				sort: params?.sort ?? "date,desc",
				status: params?.status,
				type: params?.type,
				refNo: params?.refNo,
				customerName: params?.customerName,
				customer_id: params?.customerId,
			},
		})
		.then(mapPaginatedResponseToPagination);

export const exportInvoice = (invoiceIds: string[], from?: string, to?: string) =>
	apiClient.post<Blob>({
		url: `${INVOICE_API.LIST}/export`,
		data: {
			invoiceIds,
			from,
			to,
		},
		responseType: "blob",
	});

export const updateInvoice = (invoiceIds: string[], customerName: string, type: InvoiceType, status: InvoiceStatus) =>
	apiClient.put<Invoice>({
		url: `${INVOICE_API.LIST}/update-batch`,
		data: {
			invoiceIds,
			customerName,
			type,
			status,
		},
	});

export default {
	getInvoices,
	exportInvoice,
	updateInvoice,
};
