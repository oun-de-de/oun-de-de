import DashboardCard from "./card/dashboard-card";
import DashboardCustomerInfo from "./components/dashboard-customer-info";
import DashboardPerformance from "./components/dashboard-performance";

export default function Dashboard() {
	return (
		<div className="grid grid-cols-1 xl:grid-cols-2 gap-2 lg:gap-2">
			<DashboardCard title="Customer Info">
				<DashboardCustomerInfo />
			</DashboardCard>
			<DashboardCard title="Performance">
				<DashboardPerformance />
			</DashboardCard>
			<DashboardCard title="Daily Income (Pos)" />
			<DashboardCard title="Daily Income &amp; Expense (Accounting)" />
		</div>
	);
}