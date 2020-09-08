import { Application } from '../declarations';
import GeoService from './GeoService';

export default function (app: Application): void {
	// Register our messages service
	app.use('/', new GeoService());
}
