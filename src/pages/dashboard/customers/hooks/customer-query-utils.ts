import type { QueryClient } from "@tanstack/react-query";

export const invalidateCustomerDetailQueries = (queryClient: QueryClient, customerId?: string) => {
	if (!customerId) return;

	queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
};

export const invalidateCustomerListQueries = (queryClient: QueryClient) => {
	queryClient.invalidateQueries({ queryKey: ["customers"] });
	queryClient.invalidateQueries({ queryKey: ["customers-list"] });
};

export const invalidateCustomerVehiclesQueries = (queryClient: QueryClient, customerId?: string) => {
	if (!customerId) return;

	queryClient.invalidateQueries({ queryKey: ["customer-vehicles", customerId] });
	invalidateCustomerDetailQueries(queryClient, customerId);
};

export const invalidateCustomerInfoQueries = (queryClient: QueryClient, customerId?: string) => {
	invalidateCustomerDetailQueries(queryClient, customerId);
	invalidateCustomerListQueries(queryClient);
};
