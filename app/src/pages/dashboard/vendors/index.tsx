import {
	EntityListItem,
	SummaryStatCard,
	TableFilterBar,
	TablePagination,
} from '@/components/common';
import Icon from '@/components/icon/icon';
import { Button } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';
import { Input } from '@/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/ui/select';
import { Text } from '@/ui/typography';
import {
	useDashboardList,
	useDashboardListActions,
} from '@/store/dashboardListStore';
import { useState } from 'react';
import {
	vendorList,
	vendorSummaryCards,
} from '@/_mock/data/dashboard';

const summaryCards = vendorSummaryCards;

const filterTypeOptions = [
  { value: 'all', label: 'All' },
  { value: 'cash-purchase', label: 'Cash Purchase' },
  { value: 'bill', label: 'Bill' },
  { value: 'payment', label: 'Payment' },
];

const filterFieldOptions = [
  { value: 'field-name', label: 'Field name' },
  { value: 'vendor', label: 'Vendor' },
  { value: 'ref-no', label: 'Ref No' },
];

const paginationPages: Array<number | '...'> = [1];

export default function VendorsPage() {
  const [activeVendorId, setActiveVendorId] = useState<string | null>(null);
  const activeVendor = vendorList.find(
    (vendor) => vendor.id === activeVendorId
  );
  const listState = useDashboardList('vendors');
  const { updateList } = useDashboardListActions();

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Select defaultValue="type">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Vendor Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="type">Vendor Type</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Icon icon="mdi:menu" />
              </Button>
            </div>

            <div className="mt-3 flex gap-2">
              <Input placeholder="Search..." />
              <Select defaultValue="active">
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Active" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 space-y-2">
              {vendorList.map((vendor) => (
                <EntityListItem
                  key={vendor.id}
                  customer={vendor}
                  isActive={vendor.id === activeVendorId}
                  onSelect={setActiveVendorId}
                />
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>Total 11</span>
              <span className="flex items-center gap-1">
                <Icon icon="mdi:chevron-left" />
                <Icon icon="mdi:chevron-right" />
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button size="sm" className="gap-1">
                  <Icon icon="mdi:account-multiple-outline" />
                  Vendor
                </Button>
                <Text variant="body2" className="text-muted-foreground">
                  {activeVendor
                    ? `${activeVendor.name} selected`
                    : 'No vendor selected'}
                </Text>
              </div>
              <Button size="sm" className="gap-2">
                <Icon icon="mdi:plus" />
                Create Bill
                <Icon icon="mdi:chevron-down" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => (
                <SummaryStatCard key={card.label} {...card} />
              ))}
            </div>

            <TableFilterBar
              typeOptions={filterTypeOptions}
              fieldOptions={filterFieldOptions}
              typeValue={listState.typeFilter}
              fieldValue={listState.fieldFilter}
              searchValue={listState.searchValue}
              typePlaceholder="Cash Purchase"
              onTypeChange={(value) =>
                updateList('vendors', { typeFilter: value, page: 1 })
              }
              onFieldChange={(value) =>
                updateList('vendors', { fieldFilter: value, page: 1 })
              }
              onSearchChange={(value) =>
                updateList('vendors', { searchValue: value, page: 1 })
              }
            />

            <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Ref No</th>
                    <th className="px-3 py-2 text-left">Vendor</th>
                    <th className="px-3 py-2 text-left">Type</th>
                    <th className="px-3 py-2 text-left">Ref Type</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                    <th className="px-3 py-2 text-left">Memo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-10 text-center text-sm text-muted-foreground"
                    >
                      No Data
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <TablePagination
              pages={paginationPages}
              currentPage={listState.page}
              totalItems={0}
              pageSize={listState.pageSize}
              pageSizeOptions={[10, 20, 50]}
              goToValue={String(listState.page)}
              onPrev={() => updateList('vendors', { page: 1 })}
              onNext={() => updateList('vendors', { page: 1 })}
              onPageChange={(nextPage) =>
                updateList('vendors', { page: nextPage })
              }
              onPageSizeChange={(nextSize) =>
                updateList('vendors', { pageSize: nextSize, page: 1 })
              }
              onGoToChange={(value) =>
                updateList('vendors', { page: Number(value) || 1 })
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
