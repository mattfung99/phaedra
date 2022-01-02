import { Application } from 'express';
import { createServer, sendFirstRequest, enableCors, enableLogging, enableRoutes, enableErrorHandling, enableServerListening } from 'server';

const startServer = () => {
  const app: Application = createServer();
  const NAMESPACE = 'Server';
  sendFirstRequest(app);
  enableCors(app);
  enableLogging(app, NAMESPACE);
  enableRoutes(app);
  enableErrorHandling(app);
  enableServerListening(app, NAMESPACE);
};

startServer();
