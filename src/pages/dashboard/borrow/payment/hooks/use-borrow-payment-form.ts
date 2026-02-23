import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import customerService from "@/core/api/services/customer-service";
import employeeService from "@/core/api/services/employee-service";
import loanService from "@/core/api/services/loan-service";
import type { BorrowerType } from "@/core/types/loan";
import { getTodayUTC } from "@/core/utils/date-utils";
import {
	useBorrowCartActions,
	useBorrowCartState,
	useCartTotal,
	useCartTotalQty,
} from "@/pages/dashboard/borrow/stores/borrow-cart-store";

export function useBorrowPaymentForm() {
	const navigate = useNavigate();
	const { cart } = useBorrowCartState();
	const { clearCart, removeFromCart } = useBorrowCartActions();
	const skipEmptyCartGuardRef = useRef(false);
	const totalQty = useCartTotalQty();
	const totalAmount = useCartTotal();

	const [borrowerType, setBorrowerType] = useState<BorrowerType>("customer");
	const [borrowerId, setBorrowerId] = useState("");
	const [termMonths, setTermMonths] = useState<number>(1);

	const [paymentMethod, setPaymentMethod] = useState("cash");
	const [depositAmount, setDepositAmount] = useState<string>("");
	const [dueDate, setDueDate] = useState(getTodayUTC);
	const [notes, setNotes] = useState("");
	const [refNo, setRefNo] = useState("");

	useEffect(() => {
		if (skipEmptyCartGuardRef.current) return;
		if (cart.length === 0) {
			toast.error("Cart is empty");
			navigate("/dashboard/borrow", { replace: true });
		}
	}, [cart.length, navigate]);

	// Fetch Customers
	const { data: customers = [] } = useQuery({
		queryKey: ["customers-list"],
		queryFn: () => customerService.getCustomerList({ limit: 1000 }).then((res) => res.list),
	});

	// Fetch Employees
	const { data: employees = [] } = useQuery({
		queryKey: ["employees-list"],
		queryFn: () => employeeService.getEmployeeList({ size: 1000 }),
	});

	const { mutate: createLoan, isPending } = useMutation({
		mutationFn: loanService.createLoan,
		onSuccess: () => {
			skipEmptyCartGuardRef.current = true;
			toast.success("Transaction saved successfully!");
			clearCart();
			navigate("/dashboard/borrow", { replace: true });
		},
		onError: () => {
			toast.error("Failed to create loan");
		},
	});

	const handleBorrowerTypeChange = (value: BorrowerType) => {
		setBorrowerType(value);
		setBorrowerId("");
	};

	const confirm = () => {
		if (cart.length === 0) {
			toast.error("Cart is empty");
			return;
		}
		if (!borrowerId) {
			toast.error("Please select a valid borrower");
			return;
		}
		if (termMonths < 1) {
			toast.error("Term must be at least 1 month");
			return;
		}
		const parsedDepositAmount = Number(depositAmount);
		const principalAmount =
			depositAmount.trim() === "" || Number.isNaN(parsedDepositAmount) ? totalAmount : parsedDepositAmount;
		if (principalAmount <= 0) {
			toast.error("Principal amount must be greater than 0");
			return;
		}

		createLoan({
			borrowerType,
			borrowerId,
			principalAmount,
			termMonths,
			startDate: dueDate.toISOString(),
		});
	};

	return {
		cart,
		removeFromCart,
		totalQty,
		totalAmount,
		borrowerType,
		setBorrowerType: handleBorrowerTypeChange,
		borrowerId,
		setBorrowerId,
		termMonths,
		setTermMonths,
		paymentMethod,
		setPaymentMethod,
		depositAmount,
		setDepositAmount,
		dueDate,
		setDueDate,
		notes,
		setNotes,
		refNo,
		setRefNo,
		confirm,
		isPending,
		customers,
		employees,
	};
}
