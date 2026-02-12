import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
	useBorrowCartActions,
	useBorrowCartState,
	useCartTotal,
} from "@/pages/dashboard/borrow/stores/borrow-cart-store";
import { BorrowPaymentBorrowerInfo } from "./borrow-payment-borrower-info";
import { BorrowPaymentHeader } from "./borrow-payment-header";
import { BorrowPaymentItems } from "./borrow-payment-items";
import { BorrowPaymentLayout } from "./borrow-payment-layout";
import { BorrowPaymentRightPanel } from "./borrow-payment-right-panel";
import { BorrowPaymentSummary } from "./borrow-payment-summary";

export function BorrowPaymentView() {
	const navigate = useNavigate();
	const { cart } = useBorrowCartState();
	const { clearCart, removeFromCart } = useBorrowCartActions();

	const totalAmount = useCartTotal();

	// Form State
	const [borrowerName, setBorrowerName] = useState("");
	const [phone, setPhone] = useState("");
	const [idCard, setIdCard] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("cash");
	const [depositAmount, setDepositAmount] = useState<string>("");
	const [dueDate, setDueDate] = useState("");
	const [notes, setNotes] = useState("");
	const [refNo, setRefNo] = useState("");

	// MOCK DATA FOR DEMO
	const MOCK_CART_ITEMS = [
		{
			id: "mock-1",
			code: "EQ-001",
			name: "Drill Machine X200",
			price: 50,
			inStock: 10,
			qty: 1,
		},
		{
			id: "mock-2",
			code: "EQ-005",
			name: "Cordless Screwdriver",
			price: 35,
			inStock: 8,
			qty: 2,
		},
	];

	// Use real cart if available, otherwise use mock data for display
	const activeCart = cart.length > 0 ? cart : MOCK_CART_ITEMS;
	const activeTotal =
		cart.length > 0 ? totalAmount : MOCK_CART_ITEMS.reduce((sum, item) => sum + item.price * item.qty, 0);

	const handleConfirm = () => {
		if (!borrowerName.trim()) {
			toast.error("Borrower name is required");
			return;
		}
		toast.success("Transaction saved successfully!");
		clearCart();
		navigate("/dashboard/borrow");
	};

	return (
		<BorrowPaymentLayout
			header={<BorrowPaymentHeader />}
			rightPanel={
				<BorrowPaymentRightPanel
					totalAmount={activeTotal}
					paymentMethod={paymentMethod}
					setPaymentMethod={setPaymentMethod}
					depositAmount={depositAmount}
					setDepositAmount={setDepositAmount}
					dueDate={dueDate}
					setDueDate={setDueDate}
					refNo={refNo}
					setRefNo={setRefNo}
					notes={notes}
					setNotes={setNotes}
					onConfirm={handleConfirm}
				/>
			}
		>
			<BorrowPaymentBorrowerInfo
				borrowerName={borrowerName}
				setBorrowerName={setBorrowerName}
				phone={phone}
				setPhone={setPhone}
				idCard={idCard}
				setIdCard={setIdCard}
			/>

			<div className="px-6 py-2">
				<div className="h-px bg-gray-100 w-full" />
			</div>

			<BorrowPaymentItems cart={activeCart} onRemove={removeFromCart} />

			<BorrowPaymentSummary cart={activeCart} totalAmount={activeTotal} />
		</BorrowPaymentLayout>
	);
}
