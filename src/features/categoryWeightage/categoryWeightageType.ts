export type CategoryWeightageState = {
  createCategoryWeightageLoading: boolean;
  categoryWeightageListLoading: boolean;
  categoryWeightageList: CategoryWeightageListItem[] | null;
  updateCategoryWeightageLoading: boolean;
};

export type CreateCategoryWeightageResponse = {
  success: boolean;
  message: string;
};

export type CategoryWeightageListItem = {
  id: number;
  component: string;
  part_code: string;
  wastage_percent: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
};

export type CategoryWeightagePagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CategoryWeightageListResponse = {
  success: boolean;
  status: string;
  message: string;
  data: CategoryWeightageListItem[];
  pagination: CategoryWeightagePagination;
};
