export default class System {
  readonly _id: string;
  readonly user: string;
  readonly name: string;
  readonly host: string;
  readonly sap_user: string;
  readonly sap_password: string;
  readonly ngrok_active: boolean;
  readonly ngrok_api_token: string;
  readonly ngrok_tunnel: string;
  constructor(
    _id: string,
    user: string,
    name: string,
    host: string,
    sap_user: string,
    sap_password: string,
    ngrok_active: boolean,
    ngrok_api_token: string | null,
    ngrok_tunnel: string | null
  ) {
    this._id = _id;
    this.user = user;
    this.name = name;
    this.host = host;
    this.sap_user = sap_user;
    this.sap_password = sap_password;
    this.ngrok_active = ngrok_active;
    this.ngrok_api_token = ngrok_api_token;
    this.ngrok_tunnel = ngrok_tunnel;
  }
  static new(
    user: string,
    name: string,
    host: string,
    sap_user: string,
    sap_password: string,
    ngrok_active: boolean,
    ngrok_api_token?: string,
    ngrok_tunnel?: string
  ) {
    return new System(
      "",
      name,
      host,
      sap_user,
      sap_password,
      ngrok_active,
      ngrok_api_token,
      ngrok_tunnel
    );
  }
}
