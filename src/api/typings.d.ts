declare namespace API {
  type BaseResponseBoolean = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseListLong = {
    code?: number;
    data?: number[];
    message?: string;
  };

  type BaseResponseListSysMenu = {
    code?: number;
    data?: SysMenu[];
    message?: string;
  };

  type BaseResponseListSysRole = {
    code?: number;
    data?: SysRole[];
    message?: string;
  };

  type BaseResponseListSysUser = {
    code?: number;
    data?: SysUser[];
    message?: string;
  };

  type BaseResponseLoginUserInfoVO = {
    code?: number;
    data?: LoginUserInfoVO;
    message?: string;
  };

  type BaseResponsePageSysMenu = {
    code?: number;
    data?: PageSysMenu;
    message?: string;
  };

  type BaseResponsePageSysRole = {
    code?: number;
    data?: PageSysRole;
    message?: string;
  };

  type BaseResponsePageSysUser = {
    code?: number;
    data?: PageSysUser;
    message?: string;
  };

  type BaseResponseSetLong = {
    code?: number;
    data?: number[];
    message?: string;
  };

  type BaseResponseSetString = {
    code?: number;
    data?: string[];
    message?: string;
  };

  type BaseResponseString = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseSysMenu = {
    code?: number;
    data?: SysMenu;
    message?: string;
  };

  type BaseResponseSysRole = {
    code?: number;
    data?: SysRole;
    message?: string;
  };

  type BaseResponseSysUser = {
    code?: number;
    data?: SysUser;
    message?: string;
  };

  type deleteMenuParams = {
    id: number;
  };

  type deleteRoleParams = {
    id: number;
  };

  type deleteUserParams = {
    id: number;
  };

  type getMenuInfoParams = {
    id: number;
  };

  type getRoleInfoParams = {
    id: number;
  };

  type getRolePermissionParams = {
    id: number;
  };

  type getUserInfoParams = {
    id: number;
  };

  type getUserRolesParams = {
    id: number;
  };

  type grantPermissionParams = {
    id: number;
    permissions?: number[];
  };

  type grantRoleParams = {
    id: number;
    roles?: number[];
  };

  type LoginUserInfoVO = {
    user?: SysUser;
    permissions?: string[];
    roles?: string[];
  };

  type pageMenuParams = {
    page: PageSysMenu;
  };

  type pageRoleParams = {
    page: PageSysRole;
  };

  type PageSysMenu = {
    records?: SysMenu[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
  };

  type PageSysRole = {
    records?: SysRole[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
  };

  type PageSysUser = {
    records?: SysUser[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
  };

  type pageUserParams = {
    page: PageSysUser;
  };

  type SysMenu = {
    menuId?: number;
    menuName?: string;
    parentId?: number;
    orderNum?: number;
    perms?: string;
    url?: string;
    menuType?: string;
    icon?: string;
    createTime?: string;
    updateTime?: string;
    children?: SysMenu[];
  };

  type SysRole = {
    roleId?: number;
    roleName?: string;
    roleKey?: string;
    status?: string;
    createTime?: string;
  };

  type SysUser = {
    userId?: number;
    username?: string;
    password?: string;
    nickname?: string;
    avatar?: string;
    email?: string;
    status?: string;
    createTime?: string;
    updateTime?: string;
  };

  type testMenuPerms1Params = {
    userId: number;
  };

  type UserLoginDto = {
    username?: string;
    password?: string;
  };
}
