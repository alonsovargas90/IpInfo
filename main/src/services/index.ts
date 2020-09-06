import { Application } from '../declarations';
import MessageService from './MessageService';

export default function (app: Application): void {
	// Register our messages service
	app.use('/messages', new MessageService());
}
