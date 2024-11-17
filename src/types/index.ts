
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



export interface ImageMatchObj {
    fileName: string;
    filePath?: string;
}

export interface MatchedResult {
    itemId: string;
    variationId: string | null;
    fileName: string;
    name: string;
    updatedAt?: string;
}

export interface UnmatchedItem {
    itemId?: string;
    itemName?: string;
    variationId?: string;
    variationName?: string;
    fileName?: string; // Added fileName property
    unmatchedType: 'item' | 'variation' | 'image';
}


export interface NormalizedItems {
    [id: string]: { name: string };
}

export interface NormalizedVariants {
    [id: string]: { itemId: string; name: string };
}

  