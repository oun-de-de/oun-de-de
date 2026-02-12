import { differenceInCalendarMonths, format, parseISO } from "date-fns";
import type { LoanRecord } from "@/core/types/loan";
import type { BorrowRow } from "../components/borrow-columns";

function safeMonthlyPayment(value: number) {
	return Math.max(1, value);
}

function formatCurrency(value: number) {
	return value.toLocaleString();
}

export function mapLoanRecordToBorrowRow(record: LoanRecord, now: Date = new Date()): BorrowRow {
	const monthlyPayment = safeMonthlyPayment(record.monthlyPayment);
	const plannedMonths = Math.ceil(record.loanAmount / monthlyPayment);
	const paidAmount = record.payments.reduce((sum, payment) => sum + payment.amount, 0);
	const paidMonths = Math.floor(paidAmount / monthlyPayment);
	const remainingAmount = Math.max(0, record.loanAmount - paidAmount);

	const startDate = parseISO(record.startDate);
	const elapsedMonths = Math.max(differenceInCalendarMonths(now, startDate), 0);
	const expectedPaidMonths = Math.min(plannedMonths, elapsedMonths);
	const missedMonths = Math.max(expectedPaidMonths - paidMonths, 0);

	// Customer can pay late and push timeline; employee keeps fixed schedule.
	const delayedMonths = record.borrowerType === "Customer" ? missedMonths : 0;
	const adjustedMonths = plannedMonths + delayedMonths;

	const status: BorrowRow["status"] = remainingAmount === 0 ? "Returned" : missedMonths > 0 ? "Overdue" : "Active";

	return {
		id: record.id,
		refNo: record.refNo,
		borrower: record.borrower,
		borrowerType: record.borrowerType,
		startDate: format(startDate, "yyyy-MM-dd"),
		loanAmount: formatCurrency(record.loanAmount),
		monthlyPayment: formatCurrency(monthlyPayment),
		plannedMonths,
		paidMonths,
		missedMonths,
		adjustedMonths,
		remainingAmount: formatCurrency(remainingAmount),
		status,
	};
}
