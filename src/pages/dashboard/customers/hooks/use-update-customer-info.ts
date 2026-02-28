import { useUpdateCustomer } from "./use-update-customer";

type UseUpdateCustomerInfoOptions = {
	showSuccessToast?: boolean;
};

export const useUpdateCustomerInfo = (customerId?: string, options?: UseUpdateCustomerInfoOptions) => {
	const { showSuccessToast = true } = options || {};

	return useUpdateCustomer(customerId, {
		showSuccessToast,
		successMessage: "Customer info updated successfully",
		errorMessage: "Failed to update customer info",
	});
};
