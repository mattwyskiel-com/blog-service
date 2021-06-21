/* eslint-disable no-console */

export class Logger {
  private static log(logLevel: string, message: string, details?: Record<string, unknown>) {
    const logObject: Record<string, unknown> = {
      logLevel,
      message,
      ...details,
    };
    console.log(JSON.stringify(logObject));
  }

  public static debug(message: string, details?: Record<string, unknown>): void {
    Logger.log('debug', message, details);
  }

  public static error(message: string, details?: Record<string, unknown>): void {
    Logger.log('error', message, details);
  }

  public static info(message: string, details?: Record<string, unknown>): void {
    Logger.log('info', message, details);
  }

  public static warn(message: string, details?: Record<string, unknown>): void {
    Logger.log('warn', message, { error: details });
  }
}
