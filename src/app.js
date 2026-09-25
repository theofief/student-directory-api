import express from 'express';
import studentsRouter from './routes/students.js';

const app = express();

app.use(express.json());
app.use('/students', studentsRouter);

export default app;
