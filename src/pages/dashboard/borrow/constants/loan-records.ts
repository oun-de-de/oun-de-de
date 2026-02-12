import type { LoanRecord } from "@/core/types/loan";

export const MOCK_LOAN_RECORDS: LoanRecord[] = [
	{
		id: "1",
		refNo: "BR-MONEY-001",
		borrower: "Dara Sok",
		borrowerType: "Employee",
		startDate: "2025-11-01",
		loanAmount: 1_000_000,
		monthlyPayment: 100_000,
		payments: [
			{ amount: 100_000, paidAt: "2025-12-01" },
			{ amount: 100_000, paidAt: "2026-01-01" },
			{ amount: 100_000, paidAt: "2026-02-01" },
		],
	},
	{
		id: "2",
		refNo: "BR-MONEY-002",
		borrower: "Nhật Minh",
		borrowerType: "Customer",
		startDate: "2025-10-01",
		loanAmount: 1_000_000,
		monthlyPayment: 50_000,
		payments: [
			{ amount: 50_000, paidAt: "2025-11-01" },
			{ amount: 50_000, paidAt: "2025-12-01" },
			// Missed the 3rd month, then continues late schedule.
			{ amount: 50_000, paidAt: "2026-02-01" },
			{ amount: 50_000, paidAt: "2026-03-01" },
		],
	},
	{
		id: "3",
		refNo: "BR-MONEY-003",
		borrower: "Chenda Kim",
		borrowerType: "Customer",
		startDate: "2024-12-01",
		loanAmount: 600_000,
		monthlyPayment: 100_000,
		payments: [
			{ amount: 100_000, paidAt: "2025-01-01" },
			{ amount: 100_000, paidAt: "2025-02-01" },
			{ amount: 100_000, paidAt: "2025-03-01" },
			{ amount: 100_000, paidAt: "2025-04-01" },
			{ amount: 100_000, paidAt: "2025-05-01" },
			{ amount: 100_000, paidAt: "2025-06-01" },
		],
	},
	{
		id: "4",
		refNo: "BR-MONEY-004",
		borrower: "Sreypov Chan",
		borrowerType: "Employee",
		startDate: "2025-09-01",
		loanAmount: 800_000,
		monthlyPayment: 100_000,
		payments: [{ amount: 100_000, paidAt: "2025-10-01" }],
	},
];
