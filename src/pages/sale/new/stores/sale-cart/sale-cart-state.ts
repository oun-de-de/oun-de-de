type SaleCartType =
	| "InitialState"
	| "AddItemLoadingState"
	| "AddItemSuccessState"
	| "AddItemErrorState"
	| "RemoveItemLoadingState"
	| "RemoveItemSuccessState"
	| "RemoveItemErrorState"
	| "UpdateItemQuantityLoadingState"
	| "UpdateItemQuantitySuccessState"
	| "UpdateItemQuantityErrorState"
	| "ClearCartLoadingState"
	| "ClearCartSuccessState"
	| "ClearCartErrorState";
