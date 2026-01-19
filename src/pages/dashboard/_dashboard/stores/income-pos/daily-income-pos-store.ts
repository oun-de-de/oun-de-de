import { create } from "zustand";
import { GetIncomePosListUseCase } from "../../../../../core/domain/dashboard/usecases/get-income-pos-list-use-case";
import { DailyIncomePosInitialState, type DailyIncomePosState } from "./daily-income-pos-state";
import {
	DailyIncomePosLoadFirstErrorState,
	DailyIncomePosLoadFirstLoadingState,
	DailyIncomePosLoadFirstSuccessState,
} from "./states/get-state";
import { FilterData } from "../../../../../core/domain/dashboard/entities/filter";
import { BaseStore } from "@/core/types/base-store";
import { DailyIncomePosRepository } from "@/core/domain/dashboard/repositories/daily-income-pos-repository";

type DailyIncomePosActions = {
	fetch: (id: FilterData) => Promise<void>;
};

export interface DailyIncomePosStore extends BaseStore<DailyIncomePosState, DailyIncomePosActions> {
	state: DailyIncomePosState;
	actions: {
		fetch: (id: FilterData) => Promise<void>;
		subscribe?: (state: DailyIncomePosState, prevState: DailyIncomePosState) => void;
	};
}

type Deps = {
	posRepo: DailyIncomePosRepository;
};

export const createDailyIncomePosStore = ({ posRepo }: Deps) =>
	create<DailyIncomePosStore>((set, get) => ({
		state: DailyIncomePosInitialState(),

		actions: {
			async fetch(id: FilterData) {
				const currentState = get().state;

				set({
					state: DailyIncomePosLoadFirstLoadingState(currentState, id),
				});

				const result = await new GetIncomePosListUseCase(posRepo).getIncomePosList(id);

				result.fold(
					(failure) => {
						set({
							state: DailyIncomePosLoadFirstErrorState(currentState, failure),
						});
					},
					(list) => {
						set({
							state: DailyIncomePosLoadFirstSuccessState(currentState, list),
						});
					},
				);
			},
		},
	}));
