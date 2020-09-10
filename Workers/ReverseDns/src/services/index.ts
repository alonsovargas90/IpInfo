import { Application } from '../declarations';
import ReverseDnsService from './ReverseDnsService';

export default function (app: Application): void {
	// Register our messages service
	app.use('/v1/reverse-dns', new ReverseDnsService());
}
