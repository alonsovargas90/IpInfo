import axios from 'axios';
import logger from '../logger';
import { Params } from '@feathersjs/feathers';
import feathers from '@feathersjs/feathers';
import configuration from '@feathersjs/configuration';
import ServiceResponseModel from '../models/ServiceResponseModel';
import RDAPModel from '../models/RDAPModel';

const app = feathers().configure(configuration());
const API_URL = app.get('API_URL');

class RDAPService {
	async find(params: Params ): Promise<ServiceResponseModel> {
		try {
			logger.debug('Request Information for the RDAP API ...');
			const ipAddress = params?.query?.ip || '';
			const response = await axios.get(`${API_URL}${ipAddress}`);
			if (response.data?.error) {
				throw new Error(response.data.error.info);
			}
			const geoInfo: RDAPModel = { ...response.data };
			const serviceResponse =  { data: { payload: geoInfo,  service: 'RDAP', error: ''} } as ServiceResponseModel;
			return serviceResponse;
		} catch (e) {
			logger.error('Requesting information form IpStack microservice failed', e);
			throw e;
		}
	}
}

export default RDAPService;