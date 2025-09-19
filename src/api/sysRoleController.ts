// @ts-ignore
/* eslint-disable */
import request from "@/utils/http.ts";

/** 此处后端没有提供注释 DELETE /sysRole/deleteRole/${param0} */
export async function deleteRole(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteRoleParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean>(`/sysRole/deleteRole/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /sysRole/getRoleInfo/${param0} */
export async function getRoleInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRoleInfoParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseSysRole>(`/sysRole/getRoleInfo/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /sysRole/listRole */
export async function listRole(options?: { [key: string]: any }) {
  return request<API.BaseResponseListSysRole>("/sysRole/listRole", {
    method: "GET",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /sysRole/pageRole */
export async function pageRole(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageRoleParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageSysRole>("/sysRole/pageRole", {
    method: "GET",
    params: {
      ...params,
      page: undefined,
      ...params["page"],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /sysRole/saveRole */
export async function saveRole(
  body: API.SysRole,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/sysRole/saveRole", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /sysRole/updateRole */
export async function updateRole(
  body: API.SysRole,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/sysRole/updateRole", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
