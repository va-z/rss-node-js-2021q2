import express from 'express';
import swaggerUI from 'swagger-ui-express';
import path from 'path';
import YAML from 'yamljs';
import pe from 'pretty-error';
//
import userRouter from './resources/users/user.router';
import boardRouter from './resources/boards/board.router';
import taskRouter from './resources/tasks/task.router';
import {
  appErrorHandler,
  appRequestLogger,
  resourceNotFoundHandler,
} from './middleware';

pe.start();

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));

app.use(express.json());

app.use(appRequestLogger);

app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use('/', (req, res, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});

app.use('/users', userRouter);
app.use('/boards', boardRouter);
app.use('/boards/:boardId', taskRouter);

app.use(resourceNotFoundHandler);
app.use(appErrorHandler);

process.on('uncaughtException', () => {
  process.stderr.write('exception caught');
});

process.on('unhandledRejection', (_reason, promise) => {
  promise.catch(() => {
    process.stderr.write('rejection handled');
  });
});

export default app;
