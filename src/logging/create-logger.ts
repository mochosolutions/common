/**
 * Logger Factory
 * Creates configured Winston logger instances with optional CloudWatch transport
 */

import winston from 'winston';
import CloudWatchTransport from 'winston-aws-cloudwatch';
import type { LoggerPort } from './logger-port';

/**
 * Log metadata that can be attached to any log entry
 */
export type LogMeta = Record<string, unknown>;

/**
 * Logger interface for dependency injection
 * Extends LoggerPort with debug, since Winston-backed implementations support it
 */
export interface Logger extends LoggerPort {
  debug(message: string, meta?: LogMeta): void;
}

/**
 * Configuration options for logger factory
 */
export interface LoggerConfig {
  /** Log level (debug, info, warn, error) */
  level?: string;
  /** Application name for log metadata */
  appName?: string;
  /** Environment (development, production) */
  environment?: string;
  /** CloudWatch Log Group name (e.g., /mochosolutions/api/prod) */
  cloudwatchLogGroup?: string;
  /** AWS Region for CloudWatch */
  awsRegion?: string;
  /** Additional labels to attach to all logs */
  labels?: Record<string, string>;
}

/**
 * Default configuration values
 */
export const DEFAULT_LOGGER_CONFIG: Required<LoggerConfig> = {
  level: 'info',
  appName: 'mocho-api',
  environment: 'development',
  cloudwatchLogGroup: '',
  awsRegion: 'us-east-1',
  labels: {},
};

/**
 * Console format for development (pretty-printed)
 */
const devConsoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${String(timestamp)} [${level}]: ${String(message)}${metaStr}`;
  })
);

/**
 * Console format for production (JSON)
 */
const prodConsoleFormat = winston.format.combine(winston.format.timestamp(), winston.format.json());

/**
 * Creates a configured Winston logger instance
 * @param config Logger configuration options
 * @returns Configured logger instance
 */
export function createLogger(config: LoggerConfig = {}): Logger {
  const mergedConfig = { ...DEFAULT_LOGGER_CONFIG, ...config };
  const { level, appName, environment, cloudwatchLogGroup, awsRegion } = mergedConfig;

  const isProduction = environment === 'production';

  // Base transports - always include console
  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: isProduction ? prodConsoleFormat : devConsoleFormat,
    }),
  ];

  // Add CloudWatch transport in production when log group is configured
  if (isProduction && cloudwatchLogGroup) {
    transports.push(
      new CloudWatchTransport({
        logGroupName: cloudwatchLogGroup,
        logStreamName: `api-${new Date().toISOString().split('T')[0]}`,
        createLogGroup: false,
        createLogStream: true,
        awsConfig: {
          region: awsRegion,
        },
        formatLog: (item: { level: string; message: string; meta: Record<string, unknown> }) =>
          JSON.stringify({
            level: item.level,
            message: item.message,
            timestamp: new Date().toISOString(),
            app: appName,
            ...item.meta,
          }),
      })
    );
  }

  const logger = winston.createLogger({
    level,
    defaultMeta: { app: appName },
    transports,
  });

  return logger;
}

/**
 * Creates a child logger with additional context
 * Useful for request-scoped logging with correlation IDs
 */
export function createChildLogger(
  parentLogger: Logger,
  defaultMeta: Record<string, unknown>
): Logger {
  // Winston logger supports child() method
  if ('child' in parentLogger && typeof parentLogger.child === 'function') {
    return (parentLogger as winston.Logger).child(defaultMeta);
  }

  // Fallback: wrap the parent logger with default meta
  return {
    info: (message, meta) => parentLogger.info(message, { ...defaultMeta, ...meta }),
    warn: (message, meta) => parentLogger.warn(message, { ...defaultMeta, ...meta }),
    error: (message, meta) => parentLogger.error(message, { ...defaultMeta, ...meta }),
    debug: (message, meta) => parentLogger.debug(message, { ...defaultMeta, ...meta }),
  };
}
