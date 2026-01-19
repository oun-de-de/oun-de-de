import { ReactNode, createContext, useContext, useEffect, useRef } from "react";
import type { createBoundStore } from "../utils/create-bound-store";
import { createTaggedLogger } from "../utils/logger";
import { BaseStore } from "../types/base-store";

const logger = createTaggedLogger("MultiStoreProvider");

/**
 * Configuration for a store in MultiStoreProvider
 */
export interface StoreConfig {
	name: string;
	store: ReturnType<typeof createBoundStore>;
}

/**
 * Context to share store registry
 */
const StoreContext = createContext<Map<string, ReturnType<typeof createBoundStore>> | null>(null);

interface MultiStoreProviderProps {
	stores: StoreConfig[];
	children: ReactNode;
}

/**
 * MultiStoreProvider - Provider to share multiple Zustand stores with component tree
 * Auto-subscribes to stores with onStateChange callback
 *
 * @example
 * ```tsx
 * // 1. Create stores outside component
 * const dailyIncomePosStore = createBoundStore<DailyIncomePosStore, Deps>({
 *   deps: dailyIncomePosDeps,
 *   createStore: ({ posRepo }) => createDailyIncomePosStore(posRepo),
 * });
 *
 * // 2. Wrap app with MultiStoreProvider
 * <MultiStoreProvider
 *   stores={[
 *     {
 *       name: 'dailyIncomePos',
 *       store: dailyIncomePosStore,
 *     },
 *   ]}
 * >
 *   <App />
 * </MultiStoreProvider>
 *
 * // 3. In child component, get store by name
 * function MyComponent() {
 *   const dailyIncomePos = useStore('dailyIncomePos');
 *   const state = dailyIncomePos.useState();
 *   const actions = dailyIncomePos.useAction();
 * }
 * ```
 */
export function MultiStoreProvider({ stores, children }: MultiStoreProviderProps) {
	function buildRegistry(source: StoreConfig[]) {
		const registry = new Map<string, ReturnType<typeof createBoundStore>>();
		source.forEach((config) => {
			if (registry.has(config.name)) {
				logger.warn(`Store name conflict: "${config.name}" already registered`);
			}
			registry.set(config.name, config.store);
		});
		return registry;
	}

	// Initialize synchronously to avoid null context during first render
	const storeRegistryRef = useRef<Map<string, ReturnType<typeof createBoundStore>>>(buildRegistry(stores));

	// Keep registry in sync when `stores` changes and log registration
	useEffect(() => {
		storeRegistryRef.current = buildRegistry(stores);
		const keys = Array.from(storeRegistryRef.current.keys());
		logger.info(`Registered ${keys.length} stores:`, keys);
	}, [stores]);

	// Auto-subscribe to stores with onStateChange callback
	useEffect(() => {
		const unsubscribers: (() => void)[] = [];

		stores.forEach((config) => {
			try {
				const unsubscribe = config.store.subscribe((state, prevState) => {
					logger.debug(`Store "${config.name}" state changed:`, {
						prevState,
						newState: state,
					});
				});
				unsubscribers.push(unsubscribe);
			} catch (error) {
				logger.error(`Error subscribing to store "${config.name}":`, error);
			}
		});

		// Cleanup: Auto-unsubscribe on unmount
		return () => {
			unsubscribers.forEach((unsubscribe) => unsubscribe());

			if (unsubscribers.length > 0) {
				logger.info(`Unsubscribed from ${unsubscribers.length} store(s)`);
			}
		};
	}, [stores]);

	return <StoreContext.Provider value={storeRegistryRef.current}>{children}</StoreContext.Provider>;
}

/**
 * Hook to get store from MultiStoreProvider
 *
 * @param name - Name of the store registered in MultiStoreProvider
 * @returns Object with useState and useAction hooks
 * @throws Error if store not found or MultiStoreProvider not found
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { useState, useAction } = useStore<DailyIncomePosStore>('dailyIncomePos');
 *   const state = useState();
 *   const { fetch } = useAction();
 *
 *   useEffect(() => {
 *     fetch(data);
 *   }, []);
 * }
 * ```
 */
export function useStore<Store extends BaseStore<Store["state"], Store["actions"]>>(
	name: string,
): {
	useState: () => Store["state"];
	useAction: () => Store["actions"];
} {
	const registry = useContext(StoreContext);

	if (!registry) {
		throw new Error(
			`[useStore] Cannot find StoreContext. Make sure your component is wrapped with <MultiStoreProvider>.`,
		);
	}

	const store = registry.get(name);

	if (!store) {
		const availableStores = Array.from(registry.keys()).join(", ");
		throw new Error(`[useStore] Store "${name}" not found. Available stores: ${availableStores}`);
	}

	return {
		useState: store.useState,
		useAction: store.useAction,
	};
}

/**
 * Hook helper to create typed useStore hook for each store
 *
 * @example
 * ```tsx
 * const useDailyIncomePosStore = createStoreHook<DailyIncomePosStore>('dailyIncomePos');
 *
 * function MyComponent() {
 *   const { useState, useAction } = useDailyIncomePosStore(); // Fully typed!
 *   const state = useState();
 *   const { fetch } = useAction();
 * }
 * ```
 */
export function createStoreHook<Store extends BaseStore<Store["state"], Store["actions"]>>(storeName: string) {
	return () => useStore<Store>(storeName);
}
