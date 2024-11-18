// Define a helper function to make requests in batches
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';


interface RequestBatchArgs {
    arr: any[];
    batchSize: number;
    batchDelay: number;
    asyncFunc: any;
    funcArgs?: any;
    maxRetries:  number
}

export const makeRequestsInBatches = async ({
  arr = [],
  batchSize = 50,
  batchDelay = 3000,
  asyncFunc,
  funcArgs,
  maxRetries,
}: RequestBatchArgs) => {
  const responses: any[] = [];
  const failedRequests: { item: any; retries: number }[] = [];

  for (let i = 0; i < arr.length; i += batchSize) {
    const batch = arr.slice(i, i + batchSize);
    const batchPromises: Promise<AxiosResponse<any>>[] = [];

    for (const item of batch) {
      const itemPromise = async () => {
        let retries = 0;
        while (retries <= maxRetries) {
          try {
            const response = await asyncFunc(item, funcArgs);
            return response;
          } catch (error) {
            if (retries >= maxRetries) {
              failedRequests.push({ item, retries });
              throw error;
            }
            retries++;
          }
        }
      };

      batchPromises.push(itemPromise());
    }

    try {
      const batchResponses = await Promise.all(batchPromises);
      responses.push(...batchResponses);
    } catch (error: any) {
      console.error(`Batch request failed: ${error.message}`);
    }

    if (i + batchSize < arr.length) {
      const randomDelay = Math.floor(Math.random() * batchDelay) + 1000;
      console.log(`Waiting for ${randomDelay / 1000} seconds before the next batch...`);
      await new Promise((resolve) => setTimeout(resolve, randomDelay));
    }
  }

  return { responses, failedRequests };
};
  
  
  