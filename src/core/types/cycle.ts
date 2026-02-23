export type CycleStatus = "OPEN" | "CLOSED" | "OVERDUE";

export interface Cycle {
	id: string;
	customerId: string;
	customerName: string;
	startDate: string;
	endDate: string;
	status: CycleStatus;
	totalAmount?: number;
	totalPaidAmount?: number;
}

export interface CyclePayment {
	id: string;
	cycleId: string;
	paymentDate: string;
	amount: number;
}

export interface CyclePaymentView {
	refNo: string;
	customerName: string;
	date: string;
	amount: number;
	total: number;
	paid: number;
	balance: number;
}

export interface CreatePaymentRequest {
	paymentDate: string;
	amount: number;
}

export interface ConvertToLoanRequest {
	termMonths: number;
	startDate: string;
}
