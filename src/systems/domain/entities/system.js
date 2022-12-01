export default class System {
  constructor(
    _id,
    user,
    name,
    host,
    sap_user,
    sap_password,
    ngrok_active,
    ngrok_api_token,
    ngrok_tunnel
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
