import { createClient, RedisClientType } from "redis";
import { Repository, Schema, Entity } from 'redis-om';
import { RedisDatabaseConnectionError } from '../errors/database-connection-error';

class RedisClient {
    private static instance: RedisClientType | null = null;
    private static maxRetries = 3; // Maximum number of retry attempts
    private static retryInterval = 1000; // Time between retries in milliseconds
  
    private constructor() { }
  

    private static async connectClient(config?: { password?: string, host?: string, port?: number }): Promise<void> {
        const host = config?.host || process.env.REDIS_URL;
        const port = config?.port || parseInt(process?.env?.REDIS_PORT ?? '6379');
        console.log("redisConnect", { host, port })

        const url = `redis://${host}:${port}`
        console.log("redisConnect", url)

        if (!this.instance) {
            const config = {
                password: process.env.REDIS_PASSWORD || "",
                socket: {
                    host: process.env.REDIS_URL || "",
                    port: parseInt(process?.env?.REDIS_PORT ?? '6379'),
                }
            }

            this.instance = createClient(config);

            this.instance.on('error', (err) => {
                console.log('Redis Client Error', err)
                throw new Error('Failed to connect to Redis');
            });
        }

        await this.instance.connect();
    }
  
    public static async connect(config?: { password?: string, host?: string, port?: number }): Promise<void> {
        if (!this.instance) {
            await this.connectClient(config);
        }
  
        let retryCount = 0;
        while (!this.instance?.isOpen && retryCount < this.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, this.retryInterval));
            retryCount++;
            try {
                await this.instance?.connect();
            } catch (error) {
                console.error('Retry connecting to Redis:', error);
                if (retryCount >= this.maxRetries) {
                    throw new Error('Failed to connect to Redis after maximum retries');
                }
            }
        }
  
        if (!this.instance?.isOpen) {
            throw new Error('Failed to connect to Redis');
        }
  
    }
  
    public static async getInstance(config?: { password?: string, host?: string, port?: number }): Promise<RedisClientType> {
        if (!this.instance) {
            await this.connectClient(config);
        }
  
        let retryCount = 0;
        while (!this.instance?.isOpen && retryCount < this.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, this.retryInterval));
            retryCount++;
            try {
                await this.instance?.connect();
            } catch (error) {
                console.error('Retry connecting to Redis:', error);
                if (retryCount >= this.maxRetries) {
                    throw new Error('Failed to connect to Redis after maximum retries');
                }
            }
        }
  
        if (!this.instance?.isOpen) {
            throw new  RedisDatabaseConnectionError();
        }
  
        return this.instance;
    }

    public static async getRepository<T extends Entity>(schema: Schema<T>): Promise<Repository<T>> {
        const client = await this.getInstance();
        const repo = new Repository(schema, client);
        return repo;
    }
  
    public static async ping(): Promise<boolean> {
        try {
            const client = await this.getInstance();
            const reply = await client.ping();
            return reply === 'PONG';
        } catch (error) {
            console.error('Redis ping failed:', error);
            return false;
        }
    }
  }

export default RedisClient;