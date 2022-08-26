import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from '../database/connection';
import { Logging } from '../library/logging';

import CombineRouter from '../routes/MainRoute';

const app = express();

// connect to mongoose
mongoose.connect(config.mongo.url, { retryWrites: true, w: 'majority' })
.then(() => {
    Logging.log('Connected to MongoDb')
    startServer();
})
.catch(err => {
    Logging.error('Unable to connect to MongoDb');
    Logging.error(err);
});

//only start the serve if connected to the datebase
const startServer = () => {
    app.use((req, res, next) => {
        //Log the request
        Logging.log(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress }] `);

        //Logg the response
        res.on('finish', () => {
            Logging.log(`Outgoing -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress }] - Status: [${res.statusCode}]`);
        });

        next();
    })

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    //rules of the api
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }
        next();
    })

    //routes
    CombineRouter(app);

    //health check
    app.get('/api/v1/health/check', (req, res) => res.status(200).json({ message: 'Health Check Ok' }));

    //error handling
    app.use((req, res) => {
        const error = new Error('Not Found');
        Logging.error(error);

        return res.status(404).json({ message: error.message });
    });

    //start the server
    http.createServer(app).listen(config.server.port, () => Logging.log(`Server running on port ${config.server.port}`));

}