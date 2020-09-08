import axios from 'axios';
import logger from '../logger';
import { Params } from '@feathersjs/feathers';
import feathers from '@feathersjs/feathers';
import configuration from '@feathersjs/configuration';
import ServiceResponseModel from '../models/ServiceResponseModel';
import GeoLocationModel from '../models/GeoLocationModel';

const app = feathers().configure(configuration());
const API_KEY = app.get('API_key');
const API_URL = app.get('API_URL');

class GeoService {
	async find(params: Params ): Promise<ServiceResponseModel> {
		try {
			const ipAddress = params?.query?.ip || '';
			const response = await axios.get(`${API_URL}/${ipAddress}?access_key=${API_KEY}`);
			if (response.data?.error) {
				throw new Error(response.data.error.info);
			}
			const geoInfo: GeoLocationModel = { ...response.data };
			const serviceResponse =  { data: { payload: geoInfo,  service: 'GEOIP', error: ''} } as ServiceResponseModel;
			return serviceResponse;
		} catch (e) {
			logger.error('Requesting information form IpStack microservice failed', e);
			throw e;
		}
	}
}

export default GeoService;