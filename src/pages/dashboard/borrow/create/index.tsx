import { BorrowCreateProvider } from "./borrow-create-provider";
import { BorrowCreateView } from "./components/borrow-create-view";

export default function BorrowCreatePage() {
	return (
		<BorrowCreateProvider>
			<BorrowCreateView />
		</BorrowCreateProvider>
	);
}
