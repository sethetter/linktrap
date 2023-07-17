// TODO: Extract this to a shared utils package for myself.
// TODO: Better align this with fetch API, if possible.
type ResponseBody = string | Record<string, any>;

export class ResponseError extends Error {
  status: number;
  headers: Headers;

  constructor(resp: Response, public body?: ResponseBody) {
    super(`${resp.status} (${resp.url})`);
    this.name = "ResponseError";
    this.status = resp.status;
    this.headers = resp.headers;
  }
}

export async function throwForStatus(
  resp: Response,
  body?: ResponseBody
): Promise<Response> {
  if (resp.ok) return resp;

  if (resp.bodyUsed) throw new ResponseError(resp, body);
  switch (resp.headers.get("content-type")) {
    case "application/json":
      throw new ResponseError(resp, await resp.json());
    default:
      throw new ResponseError(resp, await resp.text());
  }
}
