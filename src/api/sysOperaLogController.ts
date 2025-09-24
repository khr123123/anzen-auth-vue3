// @ts-ignore
/* eslint-disable */
import request from "@/utils/http.ts";

/** 此处后端没有提供注释 GET /sysOperaLog/getInfo/${param0} */
export async function getLogInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getLogInfoParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseSysOperaLog>(
    `/sysOperaLog/getInfo/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 GET /sysOperaLog/list */
export async function logList(options?: { [key: string]: any }) {
  return request<API.BaseResponseListSysOperaLog>("/sysOperaLog/list", {
    method: "GET",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /sysOperaLog/page */
export async function logPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.logPageParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageSysOperaLog>("/sysOperaLog/page", {
    method: "GET",
    params: {
      ...params,
      page: undefined,
      ...params["page"],
    },
    ...(options || {}),
  });
}
