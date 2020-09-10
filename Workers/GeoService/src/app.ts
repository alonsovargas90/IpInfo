import compress from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';

import feathers from '@feathersjs/feathers';
import swagger from 'feathers-swagger';
import configuration from '@feathersjs/configuration';
import express from '@feathersjs/express';
import socketio from '@feathersjs/socketio';

import logger from './logger';
import { Application } from './declarations';
import middleware from './middleware';
import services from './services';

const app: Application = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());
// sawgger config
app.configure(swagger({
	docsPath: '/docs',
	uiIndex: true,
	specs: {
		info: {
			title: 'A test',
			description: 'A description',
			version: '1.0.0',
		}
	},
}));

app.configure(middleware);
app.configure(services);


// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger } as any));

export default app;
