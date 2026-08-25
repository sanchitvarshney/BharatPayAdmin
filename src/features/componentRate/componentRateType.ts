export type ComponentRateItem = {
  c_part_no: string;
  c_name: string;
  units_name: string;
  component_key: string;
  is_enabled: string;
  rate: string;
  department: string;
  c_other_part_no: string;
};

export type ComponentRateState = {
  componentRateListLoading: boolean;
  componentRateList: ComponentRateItem[] | null;
  updateComponentRateLoading: boolean;
};

export type ComponentRateListResponse = {
  data: {
    components: ComponentRateItem[];
  };
};

export type DepartmentOption = {
  id: string;
  text: string;
};

export const departmentOptions: DepartmentOption[] = [
  { id: "ASSEMBLY", text: "Assembly" },
  { id: "TRC", text: "TRC" },
];
