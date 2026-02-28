import { useUpdateCustomer } from "./use-update-customer";

export type UpdateWarehouseInput = {
	warehouseId: string;
};

export const useUpdateCustomerWarehouse = (customerId?: string) => {
	return useUpdateCustomer(customerId, {
		successMessage: "Warehouse updated successfully",
		errorMessage: "Failed to update warehouse",
		invalidateWarehouseList: true,
	});
};
