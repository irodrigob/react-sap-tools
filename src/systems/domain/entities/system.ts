export default class System {
  readonly _id: string;
  readonly user: string;
  readonly name: string;
  readonly host: string;
  readonly sap_user: string;
  readonly sap_password: string;
  readonly ngrok_active?: boolean;
  readonly ngrok_api_token?: string;
  readonly connection_tunnel?: string;
  constructor(
    _id: string,
    user: string,
    name: string,
    host: string,
    sap_user: string,
    sap_password: string,
    ngrok_active?: boolean,
    ngrok_api_token?: string | undefined,
    connection_tunnel?: string | undefined
  ) {
    this._id = _id;
    this.user = user;
    this.name = name;
    this.host = host;
    this.sap_user = sap_user;
    this.sap_password = sap_password;
    this.ngrok_active = ngrok_active;
    this.ngrok_api_token = ngrok_api_token;
    this.connection_tunnel = connection_tunnel;
  }
}
