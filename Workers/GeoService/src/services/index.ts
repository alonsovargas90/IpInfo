import { Application } from '../declarations';
import GeoService from './GeoService';

const geoService = new GeoService();

export default function (app: Application): void {
	// swagger spec for this service, see http://swagger.io/specification/
	geoService.docs = {
		description: 'A service that gets a ip and send all the information of the location',
		definition: {
			type: 'object',
			required: [
				'text'
			],
			properties: {
			}
		}
	};
	app.use('/v1/api/location', geoService);
}
