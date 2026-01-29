import { useIsAuthenticated } from "@/core/services/auth/hooks/use-auth";
import { Navigate } from "react-router";

type Props = {
	children: React.ReactNode;
};

export default function LoginAuthGuard({ children }: Props) {
	const isAuthenticated = useIsAuthenticated();

	if (!isAuthenticated) {
		return <Navigate to="/auth/login" replace />;
	}

	return <>{children}</>;
}
