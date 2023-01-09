export default class TunnelConfiguration {
  readonly _id: string;
  readonly user: string;
  readonly provider: string;
  readonly authToken: string;
  readonly apiToken: string;

  constructor(
    id: string,
    user: string,
    authToken: string,
    apiToken: string,
    provider?: string
  ) {
    this._id = id;
    this.user = user;
    this.apiToken = apiToken;
    this.authToken = authToken;
    this.provider = provider as string;
  }
}
