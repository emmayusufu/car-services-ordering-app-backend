import { createClient } from "redis";

const client = createClient({url: 'redis://localhost:6379'});

client.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
  await client.connect();
})();

const storeValue = async (key: string, value: string, exp: number) => {
  await client.setEx(key, exp, value);
};

const getValue = async (key: string): Promise<string> => {
  const value = await client.get(key);
  return value;
};

export { storeValue, getValue };
