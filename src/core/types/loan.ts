export type BorrowerType = "Employee" | "Customer";

export type LoanPayment = {
	amount: number;
	paidAt: string;
};

export type LoanRecord = {
	id: string;
	refNo: string;
	borrower: string;
	borrowerType: BorrowerType;
	startDate: string;
	loanAmount: number;
	monthlyPayment: number;
	payments: LoanPayment[];
};
