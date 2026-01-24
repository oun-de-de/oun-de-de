import type { SettingsRow } from "@/core/types/common";
import type { BaseState } from "@/core/types/state";

type SettingsSidebarType =
	| "InitialState"
	| "SelectItemLoadingState"
	| "SelectItemSuccessState"
	| "SelectItemErrorState";

type FormMode = "create" | "edit";

export type SettingsSidebarState = BaseState<SettingsSidebarType> & {
	activeItem: string;
	items: string[];
	// Form state
	showForm: boolean;
	editItem: SettingsRow | null;
	formMode: FormMode;
};

export const SettingsSidebarInitialState = (items: string[]): SettingsSidebarState => ({
	type: "InitialState",
	activeItem: items[0] ?? "",
	items,
	showForm: false,
	editItem: null,
	formMode: "create",
});

export const _SettingsSidebarState = ({
	state,
	type,
	activeItem,
	items,
	showForm,
	editItem,
	formMode,
}: {
	state: SettingsSidebarState;
	type: SettingsSidebarType;
	activeItem?: string;
	items?: string[];
	showForm?: boolean;
	editItem?: SettingsRow | null;
	formMode?: FormMode;
}): SettingsSidebarState => ({
	type,
	activeItem: activeItem ?? state.activeItem,
	items: items ?? state.items,
	showForm: showForm ?? state.showForm,
	editItem: editItem ?? state.editItem,
	formMode: formMode ?? state.formMode,
});
