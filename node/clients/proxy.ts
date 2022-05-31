/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'
import { AxiosResponse } from 'axios'

const baseURL = ({ workspace, account }: IOContext) => {
  return `http://${workspace}--${account}.myvtex.com`
}

export class IOInternalProxy extends ExternalClient {
  constructor(ctx: IOContext, opts?: InstanceOptions) {
    super(baseURL(ctx), ctx, opts)
  }

  // TODO: Add Inflight to this call
  public getStream = (path: string, headers: Record<string, string>) =>
    (this.http as any).request({
      headers,
      responseType: 'stream',
      transformResponse: (x: any) => x,
      url: path,
      validateStatus: (_: any) => true,
    }) as Promise<AxiosResponse>

  public evaluate = (path: string) => {
    //console.log("storeUserAuthToken",this.context.storeUserAuthToken)
    //console.log("adminUserAuthToken",this.context.adminUserAuthToken)
    //console.log("authToken",this.context.authToken)

    return this.http.get(
      `http://app.io.vtex.com/vtex.rewriter/v1/${this.context.account}/${this.context.workspace}/evaluate${path}`, 
      {
        headers: {VtexIdclientAutCookie: this.context.authToken}
      }
    )
  }

}