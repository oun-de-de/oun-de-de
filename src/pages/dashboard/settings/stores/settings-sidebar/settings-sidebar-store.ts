import { create } from "zustand";
import { settingsLeftMenu } from "@/_mock/data/dashboard";
import type { BaseStore } from "@/core/types/base-store";
import type { SettingsRow } from "@/core/types/common";
import { createBoundStore } from "@/core/utils/create-bound-store";
import {
	_SettingsSidebarState,
	SettingsSidebarInitialState,
	type SettingsSidebarState,
} from "./settings-sidebar-state";
import {
	SettingsSidebarSelectItemLoadingState,
	SettingsSidebarSelectItemSuccessState,
} from "./states/select-item-state";

type SettingsSidebarActions = {
	selectItem: (item: string) => void;
	reset: () => void;
	// Form actions
	openCreateForm: () => void;
	openEditForm: (item: SettingsRow) => void;
	closeForm: () => void;
};

export interface SettingsSidebarStore extends BaseStore<SettingsSidebarState, SettingsSidebarActions> {
	state: SettingsSidebarState;
	actions: SettingsSidebarActions;
}

const createSettingsSidebarStore = (items: string[]) =>
	create<SettingsSidebarStore>((set, get) => ({
		state: SettingsSidebarInitialState(items),
		actions: {
			selectItem(item: string) {
				set({ state: SettingsSidebarSelectItemLoadingState(get().state) });
				set({ state: SettingsSidebarSelectItemSuccessState(get().state, item) });
			},
			reset() {
				set({ state: SettingsSidebarInitialState(items) });
			},
			// Form actions
			openCreateForm() {
				set({
					state: _SettingsSidebarState({
						state: get().state,
						type: get().state.type,
						showForm: true,
						editItem: null,
						formMode: "create",
					}),
				});
			},
			openEditForm(item: SettingsRow) {
				set({
					state: _SettingsSidebarState({
						state: get().state,
						type: get().state.type,
						showForm: true,
						editItem: item,
						formMode: "edit",
					}),
				});
			},
			closeForm() {
				set({
					state: _SettingsSidebarState({
						state: get().state,
						type: get().state.type,
						showForm: false,
						editItem: null,
						formMode: "create",
					}),
				});
			},
		},
	}));

export const settingsSidebarBoundStore = createBoundStore<SettingsSidebarStore>({
	createStore: () => createSettingsSidebarStore(settingsLeftMenu),
});

// Convenience hooks
export const useSettingsSidebarState = () => settingsSidebarBoundStore.useState();
export const useSettingsSidebarActions = () => settingsSidebarBoundStore.useAction();
export const useActiveItem = () => settingsSidebarBoundStore.useState().activeItem;
export const useFormState = () => {
	const state = settingsSidebarBoundStore.useState();
	return {
		showForm: state.showForm,
		editItem: state.editItem,
		formMode: state.formMode,
	};
};
