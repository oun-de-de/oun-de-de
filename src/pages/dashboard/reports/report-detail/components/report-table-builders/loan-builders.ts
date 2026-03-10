import type { Customer } from "@/core/types/customer";
import type { Installment, Loan } from "@/core/types/loan";
import { formatDisplayDate, formatNumber } from "@/core/utils/formatters";
import type { ReportTemplateRow } from "../../../components/layout/report-template-table";

function getLoanPaymentTotals(loan: Loan, installments: Installment[] = []) {
	const collected = installments
		.filter((installment) => installment.status === "paid" || installment.paidAt)
		.reduce((sum, installment) => sum + installment.amount, 0);
	const balance = Math.max(loan.principalAmount - collected, 0);

	return { collected, balance };
}

function getInstallmentSummary(installments: Installment[] = []) {
	const paidCount = installments.filter((installment) => installment.status === "paid" || installment.paidAt).length;
	const overdueCount = installments.filter((installment) => installment.status === "overdue").length;
	const nextDue = installments
		.filter((installment) => installment.status !== "paid" && !installment.paidAt)
		.sort((left, right) => left.monthIndex - right.monthIndex)[0];

	return {
		paidCount,
		overdueCount,
		nextDue: nextDue ? formatDisplayDate(nextDue.dueDate) : "-",
	};
}

function getCustomerLoanPurpose(loan: Loan, customer?: Customer) {
	if (loan.termMonths >= 12) return "Vehicle or long-term equipment purchase";
	if (loan.termMonths >= 6) return "Tank or equipment purchase";
	if (customer?.name) return `Customer financing for ${customer.name}`;
	return "Customer loan / installment";
}

function getCustomerPaymentTerm(loan: Loan, installments: Installment[] = []) {
	const { paidCount, overdueCount, nextDue } = getInstallmentSummary(installments);
	return `${loan.termMonths} months | Paid ${paidCount}/${Math.max(loan.termMonths, installments.length || 0)} | Next due ${nextDue}${
		overdueCount > 0 ? ` | Overdue ${overdueCount}` : ""
	}`;
}

function getCustomerOtherText(loan: Loan, installments: Installment[] = []) {
	const { overdueCount } = getInstallmentSummary(installments);
	const monthlyPayment = loan.monthlyPayment ?? 0;
	const monthlyText = monthlyPayment > 0 ? `${formatNumber(monthlyPayment)}/month` : "-";
	return overdueCount > 0 ? `${monthlyText} | ${overdueCount} overdue` : monthlyText;
}

function getEmployeeLoanMemo(loan: Loan, installments: Installment[] = []) {
	const { paidCount, nextDue } = getInstallmentSummary(installments);
	return `${loan.borrowerName} loan account | Paid ${paidCount} installments | Next due ${nextDue}`;
}

export function buildCustomerLoanRows(
	loans: Loan[],
	customers: Customer[],
	installmentsByLoanId: Record<string, Installment[]>,
): ReportTemplateRow[] {
	const customerMap = new Map(customers.map((customer) => [customer.id, customer]));
	return loans.map((loan, index) => {
		const customer = customerMap.get(loan.borrowerId);
		const installments = installmentsByLoanId[loan.id] ?? [];
		const { collected, balance } = getLoanPaymentTotals(loan, installments);

		return {
			key: loan.id,
			cells: {
				no: index + 1,
				date: formatDisplayDate(loan.createdAt || loan.startDate),
				code: customer?.code ?? loan.borrowerId,
				name: loan.borrowerName,
				reason: getCustomerLoanPurpose(loan, customer),
				debit: formatNumber(loan.principalAmount),
				credit: formatNumber(collected),
				balance: formatNumber(balance),
				qty: loan.termMonths,
				paymentTerm: getCustomerPaymentTerm(loan, installments),
				other: getCustomerOtherText(loan, installments),
			},
		};
	});
}

export function buildEmployeeLoanRows(
	loans: Loan[],
	installmentsByLoanId: Record<string, Installment[]>,
): ReportTemplateRow[] {
	return loans.map((loan, index) => {
		const installments = installmentsByLoanId[loan.id] ?? [];
		const { collected, balance } = getLoanPaymentTotals(loan, installments);

		return {
			key: loan.id,
			cells: {
				date: formatDisplayDate(loan.createdAt || loan.startDate),
				type: "General Employee",
				refNo: `${String(index + 1).padStart(5, "0")}-${loan.borrowerId}`,
				employee: loan.borrowerName,
				memo: getEmployeeLoanMemo(loan, installments),
				name: "",
				debit: formatNumber(loan.principalAmount),
				credit: formatNumber(collected),
				balance: formatNumber(balance),
			},
		};
	});
}
