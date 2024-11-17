// import { Job } from 'bullmq';

export enum UploadStatus {
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    FAILED = 'failed',
  }
  
export interface Image {
    s3Key: string;
    fileName: string;
    itemId: string;
}
  
  export interface ImageJobData {
    jobId: string;
    userId: string;
    images: Image[];
    tempJobId: string;
  }
  
  
//   export interface JobProcessor<T> {
//       processJob(job: Job<T>): Promise<void>;
//   }
  