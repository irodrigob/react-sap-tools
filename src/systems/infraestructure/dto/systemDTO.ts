export interface SystemDTO {
  _id: String;
  user: String;
  name: String;
  host: String;
  sap_user: String;
  sap_password: String;
  ngrok_active: String | undefined;
  ngrok_api_token: String | undefined;
  ngrok_tunnel: String | undefined;
}
