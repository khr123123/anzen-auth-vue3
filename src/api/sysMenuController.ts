// @ts-ignore
/* eslint-disable */
import request from "@/utils/http.ts";

/** 此处后端没有提供注释 GET /sysMenu/getInfo/${param0} */
export async function getInfo2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getInfo2Params,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseSysMenu>(`/sysMenu/getInfo/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /sysMenu/list */
export async function list2(options?: { [key: string]: any }) {
  return request<API.BaseResponseListSysMenu>("/sysMenu/list", {
    method: "GET",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /sysMenu/page */
export async function page2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page2Params,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageSysMenu>("/sysMenu/page", {
    method: "GET",
    params: {
      ...params,
      page: undefined,
      ...params["page"],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /sysMenu/remove/${param0} */
export async function remove2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.remove2Params,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean>(`/sysMenu/remove/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /sysMenu/save */
export async function save2(
  body: API.SysMenu,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/sysMenu/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /sysMenu/update */
export async function update2(
  body: API.SysMenu,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/sysMenu/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
