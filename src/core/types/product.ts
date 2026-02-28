export type Unit = {
	id: string;
	name: string;
	descr: string;
	type: string;
};

export type DefaultProductSetting = {
	id: string;
	price: number;
	quantity: number;
};

export type Product = {
	id: string;
	name: string;
	date: string;
	refNo: string;
	quantity: number;
	cost: number;
	price: number;
	unit: Unit;
	defaultProductSetting: DefaultProductSetting;
};

export type CreateProduct = Omit<Product, "id" | "unit" | "defaultProductSetting"> & {
	unitId: string;
	defaultPrice: number;
	defaultQuantity: number;
};

export type UpdateProduct = Partial<CreateProduct>;
