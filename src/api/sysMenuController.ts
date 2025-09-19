// @ts-ignore
/* eslint-disable */
import request from "@/utils/http.ts";

/** 此处后端没有提供注释 DELETE /sysMenu/deleteMenu/${param0} */
export async function deleteMenu(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteMenuParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean>(`/sysMenu/deleteMenu/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /sysMenu/getMenuInfo/${param0} */
export async function getMenuInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMenuInfoParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseSysMenu>(`/sysMenu/getMenuInfo/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /sysMenu/getUserMenuTree */
export async function getUserMenuTree(options?: { [key: string]: any }) {
  return request<API.BaseResponseListSysMenu>("/sysMenu/getUserMenuTree", {
    method: "POST",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /sysMenu/getUserMenuTreeWithButton */
export async function getUserMenuTreeWithButton(options?: {
  [key: string]: any;
}) {
  return request<API.BaseResponseListSysMenu>(
    "/sysMenu/getUserMenuTreeWithButton",
    {
      method: "POST",
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 GET /sysMenu/listMenu */
export async function listMenu(options?: { [key: string]: any }) {
  return request<API.BaseResponseListSysMenu>("/sysMenu/listMenu", {
    method: "GET",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /sysMenu/listMenu2Tree */
export async function listMenu2Tree(options?: { [key: string]: any }) {
  return request<API.BaseResponseListSysMenu>("/sysMenu/listMenu2Tree", {
    method: "GET",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /sysMenu/pageMenu */
export async function pageMenu(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageMenuParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageSysMenu>("/sysMenu/pageMenu", {
    method: "GET",
    params: {
      ...params,
      page: undefined,
      ...params["page"],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /sysMenu/saveMenu */
export async function saveMenu(
  body: API.SysMenu,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/sysMenu/saveMenu", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /sysMenu/updateMenu */
export async function updateMenu(
  body: API.SysMenu,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/sysMenu/updateMenu", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
