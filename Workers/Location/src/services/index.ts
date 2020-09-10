import { Application } from '../declarations';
import LocationService from './LocationService';

export default function (app: Application): void {
	// Register our messages service
	app.use('/v1/location', new LocationService());
}
