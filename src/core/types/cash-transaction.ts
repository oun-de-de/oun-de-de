import type { SelectOption } from "./common";

export type CashTransaction = {
	id: string;
	no: number;
	date: string;
	refNo: string;
	type: string;
	counterpartyId: string;
	counterpartyName: string;
	memo: string;
	debit: number;
	credit: number;
	balance: number;
};

export type CashTransactionCounterparty = {
	id: string;
	name: string;
	code: string;
};

export type CashTransactionSummary = {
	count: number;
	debit: number;
	credit: number;
	balance: number;
};

export type CashTransactionDataset = {
	accountLabel: string;
	rows: CashTransaction[];
	counterparties: CashTransactionCounterparty[];
	typeOptions: SelectOption[];
	summary: CashTransactionSummary;
};
