
import {Client} from 'africastalking-ts';

const credentials = {
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_USERNAME,
};


export const client = new Client(credentials)