export type SummaryStatCardData = {
  label: string;
  value: number;
  color: string;
  icon: string;
};

export type EntityListItemData = {
  id: string;
  name: string;
  code: string;
};

export type TransactionRow = {
  date: string;
  refNo: string;
  customer: string;
  type: string;
  refType: string;
  status: string;
  amount: number;
  memo: string;
};
