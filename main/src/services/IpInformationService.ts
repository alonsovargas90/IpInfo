import logger from '../logger';
import axios from 'axios';
import { Params } from '@feathersjs/feathers';
import feathers from '@feathersjs/feathers';
import configuration from '@feathersjs/configuration';
import DEFAULT_SERVICES from '../constants/DEFAULT_SERVICES';
import ipValidatorHelper from '../utils/ipValidatorHelper';
import IpInformationModel from '../models/IpInformationModel';
import SERVICES from '../constants/SERVICES';
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
			logger.debug('Request Information ...');
			const paramAddres = body?.ipAddress ?? '';
			const paramListOfServices = body?.services ?? DEFAULT_SERVICES;
			const model: IpInformationModel = await ipValidatorHelper(paramAddres, paramListOfServices);
			logger.info(`Fetching information from the ip: ${model.ip}, from microservices ${model.services}`);

			if (!model.isValid) {
				logger.debug(`Validation failed: ${model.ip}, ${model.services}`);
				throw new Error(model.error);
			}
			logger.debug('Request Information from all Microservices');
			// Fetch the information from the microservices
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
			// Since we validate preiously all services should have a related case and function to contact the microservice
			for (const service of Object.values(model.services)) {
				switch (service) {
				case SERVICES.GEOIP:
					promises.push(this.retriveGeoInformation(model.ip));
					break;
				case SERVICES.RDAP:
					promises.push(this.retriveRDAPInformation(model.ip));
					break;
				case SERVICES.REVERSE_DNS:
					promises.push(this.retriveReverseDnsInformation(model.ip));
					break;
				case SERVICES.VIRUS_TOTAL:
					promises.push(this.retriveVirusTotalInformation(model.ip));
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
	
	// Microservice calls
	async retriveGeoInformation(ipAddress: string): Promise<ServiceResponseModel> {
		try {
			logger.debug('Retriving information from the GEO ip service', ipAddress);
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
	async retriveRDAPInformation(ipAddress: string): Promise<ServiceResponseModel> {
		try {
			logger.debug('Retriving information from the RDAP service', ipAddress);
			const response = await axios.get(`${SERVICES_URL.RDAP}?ip=${ipAddress}`);
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
			logger.debug('Retriving information from the Reverse DNS service', ipAddress);
			const response = await axios.get(`${SERVICES_URL.REVERSE_DNS}?ip=${ipAddress}`);
			if (response.data.error) {
				throw new Error(response.data.error?.info);
			}
			const serviceResponse = { ...response.data.data} as ServiceResponseModel;
			return serviceResponse;
		} catch (e) {
			logger.error('Requesting information form Reverse DNS microservice failed', e);
			throw e;
		}
	}
	async retriveVirusTotalInformation(ipAddress: string): Promise<ServiceResponseModel> {
		try {
			logger.debug('Retriving information from the Virus total service', ipAddress);
			const response = await axios.get(`${SERVICES_URL.VIRUS_TOTAL}?ip=${ipAddress}`);
			if (response.data.error) {
				throw new Error(response.data.error?.info);
			}
			const serviceResponse = { ...response.data.data} as ServiceResponseModel;
			return serviceResponse;
		} catch (e) {
			logger.error('Requesting information form Virus total microservice failed', e);
			throw e;
		}
	}
}

export default IpInformationService;
