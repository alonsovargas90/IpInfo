import { Application } from '../declarations';
import VirusTotalService from './VirusTotalService';

export default function (app: Application): void {
	// Register our messages service
	app.use('/', new VirusTotalService());
}
