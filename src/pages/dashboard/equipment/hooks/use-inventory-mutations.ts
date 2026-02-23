import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import inventoryService from "@/core/api/services/inventory-service";
import type { CreateBorrowingRequest, CreateInventoryItem, UpdateStockRequest } from "@/core/types/inventory";
import { INVENTORY_QUERY_KEYS } from "./use-inventory-items";

function assertItemId(itemId?: string): string {
	if (!itemId) throw new Error("Item ID is required");
	return itemId;
}

function invalidateItemRelatedQueries(queryClient: ReturnType<typeof useQueryClient>, itemId?: string) {
	queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.items });
	if (!itemId) return;
	queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.item(itemId) });
	queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.transactions(itemId) });
	queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.borrowings(itemId) });
}

export function useCreateItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateInventoryItem) => inventoryService.createItem(data),
		onSuccess: () => {
			toast.success("Item created successfully");
			invalidateItemRelatedQueries(queryClient);
		},
		onError: () => {
			toast.error("Failed to create item");
		},
	});
}

export function useUpdateStock(itemId?: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateStockRequest) => {
			const requiredItemId = assertItemId(itemId);
			return inventoryService.updateStock(requiredItemId, data);
		},
		onSuccess: () => {
			toast.success("Stock updated successfully");
			invalidateItemRelatedQueries(queryClient, itemId);
		},
		onError: () => {
			toast.error("Failed to update stock");
		},
	});
}

export function useCreateBorrowing(itemId?: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateBorrowingRequest) => {
			const requiredItemId = assertItemId(itemId);
			return inventoryService.createBorrowing(requiredItemId, data);
		},
		onSuccess: () => {
			toast.success("Borrowing created successfully");
			invalidateItemRelatedQueries(queryClient, itemId);
		},
		onError: () => {
			toast.error("Failed to create borrowing");
		},
	});
}

export function useReturnBorrowing(itemId?: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (borrowingId: string) => {
			const requiredItemId = assertItemId(itemId);
			return inventoryService.returnBorrowing(requiredItemId, borrowingId);
		},
		onSuccess: () => {
			toast.success("Borrowing returned successfully");
			invalidateItemRelatedQueries(queryClient, itemId);
		},
		onError: () => {
			toast.error("Failed to return borrowing");
		},
	});
}
