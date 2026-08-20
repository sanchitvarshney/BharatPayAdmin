export type AwbListItem = {
  awb_nos: string;
  partner: string;
  awb_count: string;
  txn_no: string;
  mail_to: string;
  mail_cc: string;
  insert_dt: string;
  inserted_by: string;
  [key: string]: any;
};

export type AwbListParams = {
  page: number;
  limit: number;
  search?: string;
  partner?: string;
};

export type AwbListPagination = {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type AwbListResponse = {
  success: boolean;
  status: string;
  message: string;
  pagination: AwbListPagination;
  data: AwbListItem[];
};

export type UpdateAwbCountPayload = {
  awb_nos: string;
  updated_count: number;
};

export type UpdateAwbCountResponse = {
  success: boolean;
  message: string;
};

export type AwbState = {
  awbList: AwbListItem[] | null;
  awbListLoading: boolean;
  total: number;
  page: number;
  limit: number;
  updateCountLoading: boolean;
  updatingAwb: string | null;
};
