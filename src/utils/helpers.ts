import { client } from "./africastalking";

export const generateOTP = () => {
  const length = 6;
  var randomChars = "123456789";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
};

export const sendSMS = async ( phoneNumbers:string[], message:string) => {
  const options = {
    to: phoneNumbers,
    message,
  };
  try {
    return await client.sendSms(options);
  } catch (error) {
    return error
  }
};
