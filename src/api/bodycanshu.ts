// @ts-ignore
/* eslint-disable */
import request from "@/utils/http.ts";

/** 普通body请求 GET /test/menuPerms/${param0} */
export async function testMenuPerms1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.testMenuPerms1Params,
  options?: { [key: string]: any }
) {
  const { userId: param0, ...queryParams } = params;
  return request<API.BaseResponseSetString>(`/test/menuPerms/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /test/test */
export async function testMenuPerms(options?: { [key: string]: any }) {
  return request<API.BaseResponseSetString>("/test/test", {
    method: "GET",
    ...(options || {}),
  });
}
