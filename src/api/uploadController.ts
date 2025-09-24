// @ts-ignore
/* eslint-disable */
import request from "@/utils/http.ts";

/** 此处后端没有提供注释 POST /upload */
export async function uploadFile(body: {}, options?: { [key: string]: any }) {
  return request<Record<string, any>>("/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
