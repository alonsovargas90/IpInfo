import axios from 'axios';
import logger from '../logger';
import { Params } from '@feathersjs/feathers';
import feathers from '@feathersjs/feathers';
import configuration from '@feathersjs/configuration';
import ServiceResponseModel from '../models/ServiceResponseModel';
import VirusTotalModel from '../models/VirusTotalModel';

const app = feathers().configure(configuration());
const API_KEY = app.get('API_key');
const API_URL = app.get('API_URL');

class VirusTotalService {
	async find(params: Params ): Promise<ServiceResponseModel> {
		try {
			const config = {
				headers: {
					'x-apikey': API_KEY
				}
			};
			const ipAddress = params?.query?.ip || '';
			logger.info(`Request Information for the VirusTotalAPI ... ip:${ipAddress}`);
			const response = await axios.get(`${API_URL}/${ipAddress}`, config);
			const payload: VirusTotalModel = { ...response.data.data };
			const serviceResponse =  { data: { payload,  service: 'VIRUS_TOTAL', error: ''} } as ServiceResponseModel;
			return serviceResponse;
		} catch (e) {
			logger.error('Requesting information from VirusTotal microservice failed', e);
			throw e;
		}
	}
}

export default VirusTotalService;