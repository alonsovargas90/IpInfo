import { Application } from '../declarations';
import IpInformationService from './IpInformationService';

export default function (app: Application): void {
	// Register our messages service
	app.use('ip', new IpInformationService());
}
