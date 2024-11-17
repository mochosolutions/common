import { Subjects } from './subjects';
import { UploadStatus  } from './../types';

export interface Event {
  subject: Subjects;
  data: any;
}

export interface ImageObj {
  fileName: string;
  itemId: string;
  formattedName?: string;
  caption?: string;

}

// export enum UploadStatus {
//   IN_PROGRESS = 'in_progress',
//   COMPLETED = 'completed',
//   FAILED = 'failed',
// }



export interface JobCreatedEvent extends Event {
  subject: Subjects.JobCreated;
  data: {
    jobId: string;
    title: string;
    createdAt: Date;
    tenantId: string;
    images: any[];
    userId: string;
    tempJobId: string;
  };
}
export interface JobProgressEvent extends Event {
  subject: Subjects.JobProgress;
  data: {
    jobId: string;
    userId: string;
    timestamp: string;
    progress: number; // Current progress (e.g., batches completed)
    total: number; // Total batches
    batchIndex?: number; // Optional, for granular updates
    itemId?: string; // Optional, for item-level updates
    fileName?: string; // Optional, for the specific file being processed
    status?: UploadStatus; // Standardized status
  };
}

export interface JobCompleteEvent extends Event {
  subject: Subjects.JobComplete;
  data: {
    jobId: string;
    userId: string;
    completedAt: string; // ISO date-time string
  };
}

export interface JobFailedEvent extends Event {
  subject: Subjects.JobFailed;
  data: {
    jobId: string;
    userId: string;
    completedAt: string;
    itemId?: string;
    fileName?: string;
    error: string;
    batchIndex?: number; // Optional, for batch-level failures
  };
}