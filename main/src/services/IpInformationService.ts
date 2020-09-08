import logger from '../logger';
import axios from 'axios';
import { Params } from '@feathersjs/feathers';
import feathers from '@feathersjs/feathers';
import configuration from '@feathersjs/configuration';
import DEFAULT_SERVICES from '../constants/DEFAULT_SERVICES';
import ipValidatorHelper from '../utils/ipValidatorHelper';
import IpInformationModel from '../models/IpInformationModel';
import SERVICES from '../constants/SERVICES';
import RDAPModel from '../models/RDAP/RDAPModel';
import ServiceResponseModel from '../models/ServiceResponseModel';

const app = feathers().configure(configuration());
const SERVICES_URL = app.get('services');

class IpInformationService {
	/** 
		** POST route that will get all available information the ip
		@param ipAddress : v4 Ip address that will be used to look up all available information from the microservices
		@param services: List of services that will called if not included a defualt list will be used instead
	**/
	async create(body: Params): Promise<Array<ServiceResponseModel>> {
		try {
			logger.debug('Request Information Microservice');
			const paramAddres = body?.ipAddress ?? '';
			const paramListOfServices = body?.services ?? DEFAULT_SERVICES;
			const model: IpInformationModel = await ipValidatorHelper(paramAddres, paramListOfServices);
			logger.info(`Information Microservice. Fetching information form ip: ${model.ip}, ${model.services}`);

			if (!model.isValid) {
				logger.debug(`Validation failed: ${model.ip}, ${model.services}`);
				throw new Error(model.error);
			}
			// Fetch the information from the workers
			const information: Array<ServiceResponseModel> = await this.retriveAllInformation(model);
			return information;
		} catch (e) {
			logger.error('Error: There was a error on finding information for the ip', e);
			throw new Error('There was a error on finding information for the ip');
		}
	}

	async retriveAllInformation(model: IpInformationModel): Promise<Array<ServiceResponseModel>> {
		try {
			const promises = [];

			for (const service of Object.values(model.services)) {
				switch (service) {
				case SERVICES.GEOIP:
					promises.push(this.retriveGeoInformation(model.ip));
					break;
				case SERVICES.REVERSE_DNS:
					promises.push(this.retriveReverseDnsInformation(model.ip));
					break;
				}
			}
			return Promise.all(promises)
				.catch(function (err) {
					logger.error('Error: one of the services failed', err);
					return err;
				})
				.then(values => {
					return values;
				});
		} catch (e) {
			logger.error('Error: Retriving some of the Services', e);
			throw e;
		}
	}
	
	async retriveGeoInformation(ipAddress: string): Promise<ServiceResponseModel> {
		try {
			const response = await axios.get(`${SERVICES_URL.GEOIP}?ip=${ipAddress}`);
			if (response.data?.error) {
				throw new Error(response.data.error.info);
			}
			const serviceResponse = { ...response.data.data} as ServiceResponseModel;
			return serviceResponse;
		} catch (e) {
			logger.error('Requesting information form IpStack microservice failed', e);
			throw e;
		}
	}
	async retriveReverseDnsInformation(ipAddress: string): Promise<ServiceResponseModel> {
		try {
			//TODO move this to a micro service
			const response = await axios.get(`${SERVICES_URL.REVERSE_DNS}?ip=${ipAddress}`);
			if (response.data.error) {
				throw new Error(response.data.error?.info);
			}
			const serviceResponse = { ...response.data.data} as ServiceResponseModel;
			return serviceResponse;
		} catch (e) {
			logger.error('Requesting information form fecthRDAP microservice failed', e);
			throw e;
		}
	}

	//TODO Call for microservice of rdap
	// async retriveRDAPInformation(ipAddress: string): Promise<ServiceResponseModel> {
	// 	try {
	// 		//TODO move this to a micro service
	// 		const response = await axios.get(`https://www.rdap.net/ip/${ipAddress}`);
	// 		if (response.data.error) {
	// 			throw new Error(response.data.error?.info);
	// 		}
	// 		const rdpaInfo: RDAPModel = { ...response.data };
	// 		const serviceResponse = { payload: rdpaInfo,  service: SERVICES.RDAP } as ServiceResponseModel;
	// 		return serviceResponse;
	// 	} catch (e) {
	// 		logger.error('Requesting information form fecthRDAP microservice failed', e);
	// 		throw e;
	// 	}
	// }
}

export default IpInformationService;
