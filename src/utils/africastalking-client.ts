import { Client } from "africastalking-ts";

class AfricasTalkingClient {
  private _client = new Client({
    apiKey: process.env.AFRICASTALKING_API_KEY,
    username: process.env.AFRICASTALKING_USERNAME,
  });

  private static _instance: AfricasTalkingClient;

  private constructor() {}

  static getInstance  () {
    return this._instance || (this._instance = new AfricasTalkingClient());
  };

  sendSMS = async (phoneNumbers: string[], message: string) => {
    const options = {
      to: phoneNumbers,
      message,
    };
    try {
      return await this._client.sendSms(options);
    } catch (error) {
      return error;
    }
  };
}

export default AfricasTalkingClient;
