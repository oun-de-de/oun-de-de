import { ReactNode, createContext, useContext, useEffect, useRef } from "react";
import type { createBoundStore } from "../utils/create-bound-store";
import { createTaggedLogger } from "../utils/logger";

const logger = createTaggedLogger("StoreProvider");

/**
 * Context for single store provider
 */
const SingleStoreContext = createContext<ReturnType<typeof createBoundStore> | null>(null);

interface StoreProviderProps<T extends ReturnType<typeof createBoundStore> = ReturnType<typeof createBoundStore>> {
	/** Bound store instance from createBoundStore() */
	store: T;
	/** Children components */
	children: ReactNode;
}

/**
 * StoreProvider - Provider for a single Zustand store
 * Similar to BlocProvider in Flutter, but for a single store
 *
 * @example
 * ```tsx
 * // 1. Create bound store outside component
 * const dailyIncomePosStore = createBoundStore<DailyIncomePosStore, Deps>({
 *   deps: dailyIncomePosDeps,
 *   createStore: ({ posRepo }) => createDailyIncomePosStore(posRepo),
 * });
 *
 * // 2. Wrap with StoreProvider
 * <StoreProvider store={dailyIncomePosStore}>
 *   <DashboardIncomePos />
 * </StoreProvider>
 *
 * // 3. Access store in child components
 * function DashboardIncomePos() {
 *   const store = useStoreContext();
 *   const state = store.useState();
 *   const { fetch } = store.useAction();
 * }
 * ```
 */
export function StoreProvider<T extends ReturnType<typeof createBoundStore>>({
	store,
	children,
}: StoreProviderProps<T>) {
	const storeRef = useRef(store);

	useEffect(() => {
		storeRef.current = store;
		logger.info("Store provider initialized");
	}, [store]);

	return <SingleStoreContext.Provider value={storeRef.current}>{children}</SingleStoreContext.Provider>;
}

/**
 * Hook to get the store from StoreProvider
 *
 * @returns Bound store instance
 * @throws Error if not wrapped with StoreProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const store = useStoreContext();
 *   const state = store.useState();
 *   const actions = store.useAction();
 * }
 * ```
 */
export function useStoreContext<T = ReturnType<typeof createBoundStore>>(): T {
	const store = useContext(SingleStoreContext);

	if (!store) {
		throw new Error(
			"[useStoreContext] Cannot find store context. Make sure your component is wrapped with <StoreProvider>.",
		);
	}

	return store as T;
}
