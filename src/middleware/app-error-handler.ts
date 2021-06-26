import { finished } from 'stream';
//
import express from 'express';
import { StatusCodes } from 'http-status-codes';
//
import { createRequestErrorResponseMessage, logRequestError } from '../logger';

interface HandledError extends Error {
  code?: string;
}

const appErrorHandler = (
  err: HandledError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  const handleError = (code: number): void => {
    const { method, url } = req;
    const message = createRequestErrorResponseMessage(
      method,
      url,
      code,
      err.message
    );

    res.status(code).send(message);

    finished(res, () => {
      setImmediate(() => {
        logRequestError(message);
      });
    });
  };

  switch (err.code) {
    case 'ERR_ENTITY_NOT_FOUND': {
      handleError(StatusCodes.NOT_FOUND);
      break;
    }
    case 'ERR_METHOD_NOT_ALLOWED': {
      handleError(StatusCodes.METHOD_NOT_ALLOWED);
      break;
    }
    case 'ERR_ENTITY_FORBIDDEN': {
      handleError(StatusCodes.FORBIDDEN);
      break;
    }
    case 'ERR_CUSTOM_ERROR':
    default: {
      handleError(StatusCodes.INTERNAL_SERVER_ERROR);
      next();
    }
  }
};

export default appErrorHandler;
