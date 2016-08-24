export enum HttpVerb {
  GET = 1,
  POST,
  PUT,
  DELETE,
  OPTIONS,
  PATCH,
  HEAD
}

export enum ParamType {
  path = 1,
  query,
  header,
  cookie,
  form,
  body,
  file,
  files,
  context,
  context_request,
  context_response,
  context_next,
  context_accept,
  context_accept_language
}
