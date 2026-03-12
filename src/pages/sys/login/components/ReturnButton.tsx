import { BackButton } from "@/core/components/common";
import { useTranslation } from "react-i18next";

interface ReturnButtonProps {
	onClick?: () => void;
}
export function ReturnButton({ onClick }: ReturnButtonProps) {
	const { t } = useTranslation();
	return <BackButton appearance="link" onClick={onClick} className="w-full" label={t("sys.login.backSignIn")} />;
}
