import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { BaseStore } from "@/core/interfaces/base-store";
import { createBoundStore } from "@/core/utils/create-bound-store";

export type CartItem = {
	id: string;
	code: string;
	name: string;
	price: number;
	inStock: number;
	qty: number;
};

// 1. Define State
export interface BorrowCartState {
	cart: CartItem[];
}

// 2. Define Actions
export interface BorrowCartActions {
	addToCart: (item: Omit<CartItem, "qty">) => void;
	removeFromCart: (id: string) => void;
	updateQty: (id: string, delta: number) => void;
	clearCart: () => void;
}

// 3. Define Store Interface
export interface BorrowCartStore extends BaseStore<BorrowCartState, BorrowCartActions> {}

// 4. Create Bound Store
export const borrowCartBoundStore = createBoundStore<BorrowCartStore>({
	createStore: () =>
		create<BorrowCartStore>()(
			persist(
				(set) => ({
					state: {
						cart: [],
					},
					actions: {
						addToCart: (item) =>
							set((store) => {
								const { cart } = store.state;
								const existing = cart.find((i) => i.id === item.id);
								if (existing) {
									return {
										state: {
											...store.state,
											cart: cart.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i)),
										},
									};
								}
								return {
									state: {
										...store.state,
										cart: [...cart, { ...item, qty: 1 }],
									},
								};
							}),
						removeFromCart: (id) =>
							set((store) => ({
								state: {
									...store.state,
									cart: store.state.cart.filter((i) => i.id !== id),
								},
							})),
						updateQty: (id, delta) =>
							set((store) => ({
								state: {
									...store.state,
									cart: store.state.cart.map((i) => {
										if (i.id === id) {
											const newQty = Math.max(1, i.qty + delta);
											return { ...i, qty: newQty };
										}
										return i;
									}),
								},
							})),
						clearCart: () =>
							set((store) => ({
								state: {
									...store.state,
									cart: [],
								},
							})),
					},
				}),
				{
					name: "borrow-cart-storage",
					partialize: (store) => ({ state: store.state }) as any,
					merge: (persistedState: any, currentState) => {
						if (persistedState?.state) {
							return {
								...currentState,
								state: {
									...currentState.state,
									cart: persistedState.state.cart || [],
								},
							};
						}
						return currentState;
					},
				},
			),
		),
});

// Helper hooks
export const useBorrowCartState = () => borrowCartBoundStore.useState();
export const useBorrowCartActions = () => borrowCartBoundStore.useAction();

export const useCartTotal = () => {
	const { cart } = useBorrowCartState();
	return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
};
