// @ts-ignore
/* eslint-disable */
import request from "@/utils/http.ts";

/** 此处后端没有提供注释 DELETE /sysUser/deleteUser/${param0} */
export async function deleteUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean>(`/sysUser/deleteUser/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /sysUser/getLoginUserInfo */
export async function getLoginUserInfo(options?: { [key: string]: any }) {
  return request<API.BaseResponseLoginUserInfoVO>("/sysUser/getLoginUserInfo", {
    method: "GET",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /sysUser/getUserInfo/${param0} */
export async function getUserInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserInfoParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseSysUser>(`/sysUser/getUserInfo/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /sysUser/getUserRouters */
export async function getUserRouters(options?: { [key: string]: any }) {
  return request<API.BaseResponseListSysMenu>("/sysUser/getUserRouters", {
    method: "GET",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /sysUser/listUser */
export async function listUser(options?: { [key: string]: any }) {
  return request<API.BaseResponseListSysUser>("/sysUser/listUser", {
    method: "GET",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /sysUser/loginUser */
export async function loginUser(
  body: API.UserLoginDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>("/sysUser/loginUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /sysUser/pageUser */
export async function pageUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageUserParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageSysUser>("/sysUser/pageUser", {
    method: "GET",
    params: {
      ...params,
      page: undefined,
      ...params["page"],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /sysUser/saveUser */
export async function saveUser(
  body: API.SysUser,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/sysUser/saveUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /sysUser/updateUser */
export async function updateUser(
  body: API.SysUser,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/sysUser/updateUser", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
