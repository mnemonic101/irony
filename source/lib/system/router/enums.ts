export enum HttpVerb {
  GET,
  POST,
  PUT,
  DELETE,
  OPTIONS,
  PATCH,
  HEAD
}

export enum ParamType {
  path,
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
