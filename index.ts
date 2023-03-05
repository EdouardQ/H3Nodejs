import express from 'express'
import mongoose from 'mongoose'
import { jwt } from './src/security/AuthMiddleware'
import errorHandler from "./src/error/errorsMiddleware";
import usersRouter from "./src/controller/UserController";
import authRouter from "./src/controller/AuthController";
import dotenv from 'dotenv';

dotenv.config();

const url: string = process.env.MONGO_URL ?? '';

mongoose
    .connect(url)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.log('Error while connecting to MongoDB', err);
    });

const app = express()

app.use(express.json())
app.use(jwt())
app.use(errorHandler)

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.use('/users', usersRouter);
app.use('/auth', authRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
