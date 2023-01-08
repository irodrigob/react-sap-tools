export default class TunnelConfiguration {
  private _id: string;
  private provider: string;
  private authToken: string;
  private apiToken: string;

  constructor(
    id: string,
    authToken: string,
    apiToken: string,
    provider?: string
  ) {
    this._id = id;
    this.apiToken = apiToken;
    this.authToken = authToken;
    this.provider = provider as string;
  }
}
