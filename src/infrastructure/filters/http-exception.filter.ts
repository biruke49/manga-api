import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

interface IError {
  message: string | string[];
  code_error?: string | null;
  error?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request: any = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = this.normalizeError(exception);

    const responseData = {
      ...{
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
      ...message,
    };

    this.logMessage(request, message, status, exception);

    response.status(status).json(responseData);
  }

  private logMessage(
    request: any,
    message: IError,
    status: number,
    exception: any
  ) {
    if (status === 500) {
      console.error(
        `End Request for ${request.path}`,
        `method=${request.method} status=${status} code_error=${
          message.code_error ? message.code_error : null
        } message=${message.message ? message.message : null}`,
        status >= 500 ? exception.stack : ""
      );
    } else {
      console.warn(
        `End Request for ${request.path}`,
        `method=${request.method} status=${status} code_error=${
          message.code_error ? message.code_error : null
        } message=${message.message ? message.message : null}`
      );
    }
  }

  private normalizeError(exception: any): IError {
    if (exception instanceof HttpException) {
      const payload = exception.getResponse();

      if (typeof payload === "string") {
        return { message: payload, code_error: null };
      }

      if (payload && typeof payload === "object") {
        const record = payload as Record<string, unknown>;
        return {
          message:
            typeof record.message === "string" || Array.isArray(record.message)
              ? record.message
              : exception.message,
          error: typeof record.error === "string" ? record.error : undefined,
          code_error:
            typeof record.code_error === "string" ? record.code_error : null,
        };
      }
    }

    return {
      message:
        exception instanceof Error
          ? exception.message
          : "An unexpected server error occurred.",
      code_error: null,
    };
  }
}
