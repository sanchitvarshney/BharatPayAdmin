export type CategoryRateState = {
  createCategoryRateLoading: boolean;
  categoryRateListLoading: boolean;
  categoryRateList: CategoryRateGroup[] | null;
  updateCategoryRateLoading: boolean;
};

export type CategoryRateComponent = {
  component_key: string;
  rate: number;
  status: string;
};

export type CreateCategoryRateType = {
  category_name: string;
  components: CategoryRateComponent[];
};

export type CreateCategoryRateResponse = {
  success: boolean;
  message: string;
};

export type UpdateCategoryRateType = {
  category_key: string;
  category_name: string;
  components: CategoryRateComponent[];
};

export type CategoryRateComponentItem = {
  rateId: number;
  rateKey: string;
  componentKey: string;
  componentName: string;
  rate: string;
  createdDate: string;
};

export type CategoryRateGroup = {
  categoryId: number;
  categoryKey: string;
  categoryName: string;
  components: CategoryRateComponentItem[];
};

export type CategoryRateListResponse = {
  success: boolean;
  data: CategoryRateGroup[];
};
