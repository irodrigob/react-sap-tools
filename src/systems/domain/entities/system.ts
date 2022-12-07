export default class System {
  readonly _id: String;
  readonly user: String;
  readonly name: String;
  readonly host: String;
  readonly sap_user: String;
  readonly sap_password: String;
  readonly ngrok_active: String | undefined;
  readonly ngrok_api_token: String | undefined;
  readonly ngrok_tunnel: String | undefined;
  constructor(
    _id: String,
    user: String,
    name: String,
    host: String,
    sap_user: String,
    sap_password: String,
    ngrok_active?: String,
    ngrok_api_token?: String,
    ngrok_tunnel?: String
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
}
