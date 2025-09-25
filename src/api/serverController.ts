// @ts-ignore
/* eslint-disable */
import request from "@/utils/http.ts";

/** 此处后端没有提供注释 GET /monitor/server */
export async function getInfo(options?: { [key: string]: any }) {
  return request<API.BaseResponseServer>("/monitor/server", {
    method: "GET",
    ...(options || {}),
  });
}
