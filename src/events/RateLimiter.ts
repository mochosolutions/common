
import redisClient from '../utils/redisClient';

export class RateLimiter {

  async checkAndThrottle(key: string, maxRequests: number): Promise<boolean> {
    const client = await redisClient.getInstance();
    const currentCount = await client.incr(key);
    
    if (currentCount === 1) {
      await client.expire(key, 60); // 60 seconds window
    }

    return currentCount <= maxRequests;
  }

   async resetThrottle(key: string): Promise<void> {
    const client = await redisClient.getInstance();
    await client.del(key); // Reset the count
  }
}
