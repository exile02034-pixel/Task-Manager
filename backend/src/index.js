import app from './app.js';
import connectToDatabase from './config/dbConfig.js';
import * as taskService from './services/taskService.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectToDatabase();
  await taskService.bootstrapPendingDeletes();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
