declare namespace API {
  type BaseResponseBoolean = {
    code?: number;
    data?: boolean;
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

  type getInfo1Params = {
    id: number;
  };

  type getInfo2Params = {
    id: number;
  };

  type getInfoParams = {
    id: number;
  };

  type LoginUserInfoVO = {
    user?: SysUser;
    permissions?: string[];
    roles?: string[];
  };

  type page1Params = {
    page: PageSysRole;
  };

  type page2Params = {
    page: PageSysMenu;
  };

  type pageParams = {
    page: PageSysUser;
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

  type remove1Params = {
    id: number;
  };

  type remove2Params = {
    id: number;
  };

  type removeParams = {
    id: number;
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
    status?: string;
    createTime?: string;
  };

  type testMenuPerms1Params = {
    userId: number;
  };

  type UserLoginDto = {
    username?: string;
    password?: string;
  };
}
