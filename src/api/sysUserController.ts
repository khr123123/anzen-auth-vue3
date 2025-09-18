// @ts-ignore
/* eslint-disable */
import request from "@/utils/http.ts";

/** 此处后端没有提供注释 GET /sysUser/getInfo */
export async function getLoginUserInfo(options?: { [key: string]: any }) {
  return request<API.BaseResponseLoginUserInfoVO>("/sysUser/getInfo", {
    method: "GET",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /sysUser/getInfo/${param0} */
export async function getInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getInfoParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseSysUser>(`/sysUser/getInfo/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /sysUser/getRouters */
export async function getRouters(options?: { [key: string]: any }) {
  return request<API.BaseResponseListSysMenu>("/sysUser/getRouters", {
    method: "GET",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /sysUser/list */
export async function list(options?: { [key: string]: any }) {
  return request<API.BaseResponseListSysUser>("/sysUser/list", {
    method: "GET",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /sysUser/login */
export async function userLogin(
  body: API.UserLoginDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>("/sysUser/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /sysUser/page */
export async function page(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageSysUser>("/sysUser/page", {
    method: "GET",
    params: {
      ...params,
      page: undefined,
      ...params["page"],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /sysUser/remove/${param0} */
export async function remove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean>(`/sysUser/remove/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /sysUser/save */
export async function save(
  body: API.SysUser,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/sysUser/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /sysUser/update */
export async function update(
  body: API.SysUser,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/sysUser/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
