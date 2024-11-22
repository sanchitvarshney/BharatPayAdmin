export type CreateRolePayload = {
  role_name: string;
  description: string;
}

export type CreateRoleResponse = {
    success: boolean;
    message: string;
}

export type RoleList = {
  role_id: string;
  role_name: string;
  description: string;
};

export type RolesListResponse = {
  success: boolean;
  roles: RoleList[];
  code: number;
};

export type PermissionState = {
  createRoleLoading: boolean;
  rolelistData: RoleList[]|null;
  roleListLoading: boolean;
  userRoleList:any;
}