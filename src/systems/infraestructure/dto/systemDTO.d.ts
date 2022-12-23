export interface SystemDTO {
  _id: string;
  user: string;
  name: string;
  host: string;
  sap_user: string;
  sap_password: string;
  ngrok_active?: boolean;
  ngrok_api_token?: string;
  ngrok_tunnel?: string;
}

export interface newSystemDTO {
  user: string;
  name: string;
  host: string;
  sap_user: string;
  sap_password: string;
  ngrok_active?: boolean;
  ngrok_api_token?: string;
  ngrok_tunnel?: string;
}
