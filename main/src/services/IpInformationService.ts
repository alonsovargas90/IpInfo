import logger from '../logger';
import axios from 'axios';
import { Params } from '@feathersjs/feathers';
import feathers from '@feathersjs/feathers';
import configuration from '@feathersjs/configuration';
import DEFAULT_SERVICES from '../constants/DEFAULT_SERVICES';
import ipValidatorHelper from '../utils/ipValidatorHelper';
import ValidationModel from '../models/ValidationModel';
import SERVICES from '../constants/SERVICES';
import ServiceResponseModel from '../models/ServiceResponseModel';
import { BadRequest } from '@feathersjs/errors';
import promiseRecoveryHelper from '../utils/promiseRecoveryHelper';

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
			const model: ValidationModel = await ipValidatorHelper(paramAddres, paramListOfServices);
			logger.info(`Fetching information from the ip: ${model.ip}, from microservices ${model.services}`);

			if (!model.isValid) {
				logger.debug(`Validation failed: ${model.ip}, ${model.services}`);
				throw new BadRequest(model.error);
			}
			logger.debug('Request Information from all Microservices');
			// Fetch the information from the microservices
			const information: Array<ServiceResponseModel> = await this.retrieveInformationHelper(model);
			return information;
		} catch (e) {
			//TODO improve error handling
			if (e.name === 'BadRequest') {
				throw e;
			}
			logger.error('Error: There was a error on finding information for the ip', e);
			throw new Error('There was a error on finding information for the ip');
		}
	}

	async retrieveInformationHelper(model: ValidationModel): Promise<Array<ServiceResponseModel>> {
		try {
			const promises = [];
			for (const service of Object.values(model.services)) {
				switch (service) {
				case SERVICES.LOCATION:
					promises.push(this.retriveLocationInformation(model.ip));
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
				default:
					// NOTE We should never get this
					// Since we are validating on the ipValidatorHelper that all the params
					// Exist on the services array
					break;
				}
			}
			return promiseRecoveryHelper(promises);
		} catch (e) {
			logger.error('Error on Retrive Information helper', e);
			throw e;
		}
	}

	// Microservice calls
	async retriveLocationInformation(ipAddress: string): Promise<ServiceResponseModel> {
		try {
			logger.debug('Retriving information from the location service', ipAddress);
			const response = await axios.get(`${SERVICES_URL.LOCATION}?ip=${ipAddress}`);
			if (response.data?.error) {
				throw new Error(response.data.error.info);
			}
			const serviceResponse = { ...response.data.data } as ServiceResponseModel;
			return serviceResponse;
		} catch (e) {
			logger.error('Requesting information from Location microservice failed', e);
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
			const serviceResponse = { ...response.data.data } as ServiceResponseModel;
			return serviceResponse;
		} catch (e) {
			logger.error('Requesting information from RDAP microservice failed', e);
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
			const serviceResponse = { ...response.data.data } as ServiceResponseModel;
			return serviceResponse;
		} catch (e) {
			logger.error('Requesting information from Reverse DNS microservice failed', e);
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
			const serviceResponse = { ...response.data.data } as ServiceResponseModel;
			return serviceResponse;
		} catch (e) {
			logger.error('Requesting information from Virus total microservice failed', e);
			throw e;
		}
	}
}

export default IpInformationService;
