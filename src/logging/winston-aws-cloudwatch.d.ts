declare module 'winston-aws-cloudwatch' {
  import Transport from 'winston-transport';

  interface CloudWatchTransportOptions {
    logGroupName: string;
    logStreamName: string;
    awsConfig?: {
      region?: string;
      accessKeyId?: string;
      secretAccessKey?: string;
    };
    formatLog?: (item: {
      level: string;
      message: string;
      meta: Record<string, unknown>;
    }) => string;
    formatLogItem?: (item: unknown) => unknown;
    createLogGroup?: boolean;
    createLogStream?: boolean;
    submissionRetryCount?: number;
  }

  class CloudWatchTransport extends Transport {
    constructor(options: CloudWatchTransportOptions);
  }

  export = CloudWatchTransport;
}
