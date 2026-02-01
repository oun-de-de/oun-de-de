import { SaleCategory } from "@/core/domain/sales/entities/sale-category";
import type { SaleProduct } from "@/core/domain/sales/entities/sale-product";
import type {
	CustomerFilter,
	EmployeeFilter,
	WarehouseFilter,
	SaleCategoryFilter,
} from "@/core/domain/sales/entities/sale-filter";
import type { SaleFilters } from "@/core/domain/sales/entities/sale-filter";
import type { Pagination } from "@/core/types/pagination";
import { apiClient } from "../apiClient";
import { faker } from "@faker-js/faker";

enum SaleApiPath {
	Customers = "/sale/customers",
	Employees = "/sale/employees",
	Warehouses = "/sale/warehouses",
	Categories = "/sale/categories",
	CategoriesFilters = "/sale/category-filters",
	Products = "/sale/products",
	Product = "/sale/products",
}

export interface SaleProductApi {
	getProduct(id: string | number): Promise<SaleProduct>;
	getProducts(params: {
		page: number;
		limit?: number;
		search?: string;
		filters?: SaleFilters;
		categoryIds?: (string | number)[];
	}): Promise<Pagination<SaleProduct>>;
}

export interface SaleApi extends SaleProductApi {
	getCustomerFilters(): Promise<CustomerFilter[]>;
	getEmployeeFilters(): Promise<EmployeeFilter[]>;
	getWarehouseFilters(): Promise<WarehouseFilter[]>;
	getSaleCategoryFilters(): Promise<SaleCategoryFilter[]>;
	getCategories(): Promise<SaleCategory[]>;
}

export class SaleApiImpl implements SaleApi {
	async getCustomerFilters(): Promise<CustomerFilter[]> {
		const response = await apiClient.get<CustomerFilter[]>({
			url: SaleApiPath.Customers,
		});
		return response;
	}

	async getEmployeeFilters(): Promise<EmployeeFilter[]> {
		const response = await apiClient.get<EmployeeFilter[]>({
			url: SaleApiPath.Employees,
		});
		return response;
	}

	async getWarehouseFilters(): Promise<WarehouseFilter[]> {
		const response = await apiClient.get<WarehouseFilter[]>({
			url: SaleApiPath.Warehouses,
		});
		return response;
	}

	async getSaleCategoryFilters(): Promise<SaleCategoryFilter[]> {
		const response = await apiClient.get<SaleCategoryFilter[]>({
			url: SaleApiPath.CategoriesFilters,
		});
		return response;
	}

	async getCategories(): Promise<SaleCategory[]> {
		const response = await apiClient.get<SaleCategory[]>({
			url: SaleApiPath.Categories,
		});
		return response;
	}

	async getProduct(id: string | number): Promise<SaleProduct> {
		const response = await apiClient.get<SaleProduct>({
			url: `${SaleApiPath.Product}/${id}`,
		});
		return response;
	}

	async getProducts(params: {
		page: number;
		limit?: number;
		search?: string;
		filters?: SaleFilters;
		categoryIds?: (string | number)[];
	}): Promise<Pagination<SaleProduct>> {
		const response = await apiClient.get<Pagination<SaleProduct>>({
			url: SaleApiPath.Products,
			params: {
				page: params.page,
				limit: params.limit ?? 20,
				search: params.search,
				categoryIds: params.categoryIds,
				...params.filters,
			},
		});
		return response;
	}
}

export default new SaleApiImpl();

// -------------------- Mock implementations (for local dev / storybook) --------------------
function makeFilter(id: string, name?: string) {
	return { id, name: name ?? `Name ${id}` };
}

function generateProduct(id: string, date?: string): SaleProduct {
	return {
		id,
		name: faker.commerce.productName() + " " + id,
		price: Number(faker.commerce.price({ min: 50, max: 500 })),
		amount: Number(faker.commerce.price({ min: 50, max: 500 })),
		currency: "USD",
		imageUrl: faker.image.urlPicsumPhotos({ width: 200, height: 200, grayscale: false }),
		date: date ?? faker.date.recent({ days: 30 }).toLocaleDateString("en-GB"),
		customer: makeFilter(id, `Customer ${id}`),
		employee: makeFilter(id, `Employee ${id}`),
		warehouse: makeFilter(id, `Warehouse ${id}`),
		saleCategory: makeFilter(id, `Category ${id}`),
	} as SaleProduct;
}

function generateProductsForPage(
	page: number,
	limit: number,
	total = 123,
	date?: string,
	search?: string,
	customer?: string,
	employee?: string,
	warehouse?: string,
	saleCategory?: string,
) {
	const pageCount = Math.ceil(total / limit);
	const startIndex = (page - 1) * limit;
	let list: SaleProduct[] = Array.from({ length: Math.min(limit, Math.max(0, total - startIndex)) }, (_, i) => {
		const id = (startIndex + i + 1).toString();
		const p = generateProduct(id, date);
		if (customer) p.customer = makeFilter(customer, `Customer ${customer}`);
		if (employee) p.employee = makeFilter(employee, `Employee ${employee}`);
		if (warehouse) p.warehouse = makeFilter(warehouse, `Warehouse ${warehouse}`);
		if (saleCategory) p.saleCategory = makeFilter(saleCategory, `Category ${saleCategory}`);
		return p;
	});

	if (search) {
		list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
	}

	return {
		list,
		page,
		pageSize: limit,
		pageCount,
		total,
	} as Pagination<SaleProduct>;
}

export class SaleApiMockupImpl implements SaleApi {
	async getCustomerFilters(): Promise<CustomerFilter[]> {
		return Promise.resolve([
			{ id: "1", name: "Customer 1" },
			{ id: "2", name: "Customer 2" },
			{ id: "3", name: "Customer 3" },
		]);
	}

	async getEmployeeFilters(): Promise<EmployeeFilter[]> {
		return Promise.resolve([
			{ id: "1", name: "Employee 1" },
			{ id: "2", name: "Employee 2" },
			{ id: "3", name: "Employee 3" },
		]);
	}

	async getWarehouseFilters(): Promise<WarehouseFilter[]> {
		return Promise.resolve([
			{ id: "1", name: "Warehouse A" },
			{ id: "2", name: "Warehouse B" },
			{ id: "3", name: "Warehouse C" },
		]);
	}

	async getSaleCategoryFilters(): Promise<SaleCategoryFilter[]> {
		return Promise.resolve([
			{ id: "1", name: "General" },
			{ id: "2", name: "Category 1" },
			{ id: "3", name: "Category 2" },
		]);
	}

	async getCategories(): Promise<SaleCategory[]> {
		return Promise.resolve([
			{ name: "NA", id: "na" },
			{ name: "ទឹកកកនឹម", id: "ice-cream" },
			{ name: "ទឹកកកសរសើប", id: "ice-dessert" },
			{ name: "ប្រហុកឡេក", id: "dish-1" },
			{ name: "លីត្រ", id: "liter" },
			{ name: "សំបកបបូរ", id: "shell" },
		]);
	}

	async getProduct(id: string | number): Promise<SaleProduct> {
		return Promise.resolve(generateProduct(String(id)));
	}

	async getProducts(params: {
		page: number;
		limit?: number;
		search?: string;
		filters?: SaleFilters;
		categoryIds?: (string | number)[];
	}): Promise<Pagination<SaleProduct>> {
		const page = params.page ?? 1;
		const limit = params.limit ?? 10;
		const search = params.search;
		const customer = params.filters?.customer as unknown as string | undefined;
		const employee = params.filters?.employee as unknown as string | undefined;
		const warehouse = params.filters?.warehouse as unknown as string | undefined;
		const saleCategory = params.filters?.saleCategory as unknown as string | undefined;
		const date = params.filters?.date as unknown as string | undefined;

		return Promise.resolve(
			generateProductsForPage(page, limit, 123, date, search, customer, employee, warehouse, saleCategory),
		);
	}
}

export class SaleProductMockupImpl implements SaleProductApi {
	async getProduct(id: string | number): Promise<SaleProduct> {
		return Promise.resolve(generateProduct(String(id)));
	}

	async getProducts(params: {
		page: number;
		limit?: number;
		search?: string;
		filters?: SaleFilters;
		categoryIds?: (string | number)[];
	}): Promise<Pagination<SaleProduct>> {
		const page = params.page ?? 1;
		const limit = params.limit ?? 10;
		const search = params.search;
		const customer = params.filters?.customer as unknown as string | undefined;
		const employee = params.filters?.employee as unknown as string | undefined;
		const warehouse = params.filters?.warehouse as unknown as string | undefined;
		const saleCategory = params.filters?.saleCategory as unknown as string | undefined;
		const date = params.filters?.date as unknown as string | undefined;

		return Promise.resolve(
			generateProductsForPage(page, limit, 123, date, search, customer, employee, warehouse, saleCategory),
		);
	}
}

// End mock implementations
