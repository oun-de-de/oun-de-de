import { create } from "zustand";
import { CustomerInfoInitialState, type CustomerInfoState } from "./customer-info-state";
import {
	CustomerInfoLoadFirstErrorState,
	CustomerInfoLoadFirstLoadingState,
	CustomerInfoLoadFirstSuccessState,
} from "./states/get-state";
import { BaseStore } from "@/core/types/base-store";
import { GetCustomerInfoUseCase } from "@/core/domain/dashboard/usecases/get-customer-info-use-case";
import { CustomerInfoRepository } from "@/core/domain/dashboard/repositories/customer-info-repository";

type CustomerInfoActions = {
	fetch: () => Promise<void>;
};

export interface CustomerInfoStore extends BaseStore<CustomerInfoState, CustomerInfoActions> {
	state: CustomerInfoState;
	actions: {
		fetch: () => Promise<void>;
	};
}

type Deps = {
	customerRepo: CustomerInfoRepository;
};

export const createCustomerInfoStore = ({ customerRepo }: Deps) =>
	create<CustomerInfoStore>((set, get) => ({
		state: CustomerInfoInitialState(),
		actions: {
			async fetch() {
				const currentState = get().state;

				set({
					state: CustomerInfoLoadFirstLoadingState(currentState),
				});

				const result = await new GetCustomerInfoUseCase(customerRepo).getCustomerInfo();

				result.fold(
					(failure) => {
						set({
							state: CustomerInfoLoadFirstErrorState(currentState, failure),
						});
					},
					(list) => {
						set({
							state: CustomerInfoLoadFirstSuccessState(currentState, list),
						});
					},
				);
			},
		},
	}));
