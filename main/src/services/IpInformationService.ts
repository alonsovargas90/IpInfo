import logger from '../logger';
import axios from 'axios';
import { Params } from '@feathersjs/feathers';
import DEFAULT_SERVICES from '../constants/DEFAULT_SERVICES';
import ipValidatorHelper from '../utils/ipValidatorHelper';
import GeoLocationModel from '../models/Geolocation/GeoLocationModel';
import IpInformationModel from '../models/IpInformationModel';

class IpInformationService {
	/** 
		** POST route that will get all information the ip
		@param ipAddress : v4 Ip address that will be used to look up all available information from the microservices
		@param services: List of services that will called if not included a defualt list will be used instead
	**/
	async create(body: Params): Promise<any> {
		try {
			logger.debug('Request Information Microservice');
			const paramAddres = body?.ipAddress ?? '';
			const paramListOfServices = body?.services ?? DEFAULT_SERVICES;
			const model:IpInformationModel = await ipValidatorHelper(paramAddres, paramListOfServices);
			logger.info(`Information Microservice. fetching information form ip: ${model.ip}, ${model.services}`);

			if (!model.isValid) {
				logger.debug(`Validation failed: ${model.ip}, ${model.services}`);
				throw new Error(model.error);
			}

			// Fetch the information from the workers
			//TODO this will be calling microservices in a promise all manner
			// Promise.all(promises)
			// .then((results) => {
			// 	// ...
			// })
			// .catch((err) => {
			// 	// At least one of the Promises rejected (or an error was thrown inside the `.then`)
			// });
			const res:GeoLocationModel = await this.retriveGeoInformation(model.ip);
			const rdap:GeoLocationModel = await this.retriveRDAPInformation(model.ip);
			return {res, rdap};
		} catch (e) {
			logger.error('There was a error on finding information for the ip', e);
			throw new Error ('There was a error on finding information for the ip');
		}
	}

	//TODO Call for microservice of ipStack
	async retriveGeoInformation(ipAddress: string): Promise<GeoLocationModel> {
		try {
			//TODO move this to a micro service
			const response = await axios.get(`http://api.ipstack.com/${ipAddress}?access_key=f554f72017127797b2f492b83e67ec29`);
			if (response.data?.error) {
				throw new Error(response.data.error.info);
			}
			const ipInformation: GeoLocationModel = { ...response.data };
			return ipInformation;
		} catch (e) {
			logger.error('Requesting information form IpStack microservice failed', e);
			throw e;
		}
	}

	//TODO Call for microservice of rdap
	async retriveRDAPInformation(ipAddress: string): Promise<GeoLocationModel> {
		try {
			//TODO move this to a micro service
			const response = await axios.get(`https://www.rdap.net/ip/${ipAddress}`);
			if (response.data.error) {
				throw new Error(response.data.error?.info);
			}
			//return response.data as GeoLocationModel;
			const ipInformation: GeoLocationModel = { ...response.data };
			return ipInformation;
		} catch (e) {
			logger.error('Requesting information form fecthRDAP microservice failed', e);
			throw e;
		}
	}
}

export default IpInformationService;
