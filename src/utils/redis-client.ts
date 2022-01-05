import { createClient } from "redis";
import { logger } from "./logger";

class RedisClient {
  private static instance :RedisClient
  private client = createClient({ url: "redis://localhost:6379" });

  private constructor() {
    this.initializeRedisClient()
  }

  initializeRedisClient = async () => {
    try {
      this.client.on("error", (err) => console.log("Redis Client Error", err));
      await this.client.connect();
    } catch (error) {
      logger.error(`Redis client error : ${error}`);
    }
  };

  static getInstance () {
    if(this.instance){
      return this.instance
    }
    this.instance = new RedisClient()
    return this.instance
  }


  setValue = async (key: string, value: string, exp: number) => {
    await this.client.setEx(key, exp, value);
  };

  getValue = async (key: string) => {
    const value = await this.client.get(key);
    return value;
  };
}

export default RedisClient;
