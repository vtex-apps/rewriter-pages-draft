
import { forEachObjIndexed, pick, endsWith } from 'ramda'

const HEADERS_TO_SEND = [
  'accept',
  'accept-language',
  'content-length',
  'content-type',
  'rest-range',
  'x-forwarded-host',
  'x-forwarded-path',
  'x-vtex-root-path',
  'cloudfront-is-mobile-viewer',
  'cloudfront-is-tablet-viewer',
  'cloudfront-viewer-country',
  'vtex-io-device-type',
  'vtex-io-viewer-country',
]

const HEADERS_TO_RESPOND = [
  'content-type',
  'cache-control',
  'access-control-allow-origin',
  'access-control-allow-credentials',
  'access-control-allow-headers',
  'x-frame-options',
  'x-vtex-etag-control',
]

const ORIGINAL_PATH_HEADER = 'x-vtex-original-path'
const FORWARDED_PATH_HEADER = 'x-forwarded-path'

const isReestrictedHost = (host: string) => endsWith('myvtex.com', host)

const proxyCall = async function(ctx: Context, evaluate: boolean) {
  const {
    clients: { proxy }
  } = ctx

  let href: string

  if (evaluate) {
    const reponse_eval = await proxy.evaluate(ctx.url)
    href = reponse_eval.href
  }
  else {
    href = ctx.url
  }
  const segmentToken = ctx.cookies.get('vtex_segment')
  const sessionToken = ctx.cookies.get('vtex_session')
  const bindingAddress = ctx.cookies.get('vtex_binding_address')
  const segmentCookie = segmentToken ? `vtex_segment=${segmentToken};` : ''
  const sessionCookie = sessionToken ? `vtex_session=${sessionToken};` : ''
  const bindingAddressCookie = bindingAddress
    ? `vtex_binding_address=${bindingAddress}`
    : ''
  const cookie = `VtexIdclientAutCookie=${ctx.vtex.authToken};${segmentCookie};${sessionCookie};${bindingAddressCookie}`

  const forwardedPath = ctx.get(FORWARDED_PATH_HEADER)

  const originalPathHeader = forwardedPath
    ? { [ORIGINAL_PATH_HEADER]: encodeURI(forwardedPath) }
    : null

  const canonicalPathHeader = forwardedPath
    ? { [ORIGINAL_PATH_HEADER]: encodeURI(forwardedPath) }
    : null

  const response = await proxy.getStream(href, {
    ...pick(HEADERS_TO_SEND, ctx.request.headers),
    cookie,
    ...originalPathHeader,
    ...canonicalPathHeader,
  })

  ctx.status = response.status || 500

  ctx.body = response.data

  // Set response headers based on service's response headers
  if (response.headers.vary) {
    ctx.vary(response.headers.vary)
  }

  const headersToRespond = pick(HEADERS_TO_RESPOND, response.headers)
  forEachObjIndexed(
    (value:string, header) => value && ctx.set(header, value),
    headersToRespond
  )
  
  if (response.headers['content-encoding']) {
    ctx.set(
      'Content-Encoding', response.headers['content-encoding']
    )
  }
}

export async function proxy(ctx: Context, next: () => Promise<any>) {
  if (isReestrictedHost(ctx.host)) {
    await proxyCall(ctx, true)
  }
  else {
    ctx.path = '/_v/segment/routing/vtex.store@2.x/notFoundSearch/search' + ctx.path
    await proxyCall(ctx, false)
  }
  await next()
}

