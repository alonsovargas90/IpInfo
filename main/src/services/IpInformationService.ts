import logger from '../logger';
import axios from 'axios';
import { Params } from '@feathersjs/feathers';
import ipValidatorHelper from '../utils/ipValidatorHelper';
import IpStackModel from '../models/Ipstack/IpStackModel';

class IpInformationService {

	/*
		Root Get route that will get all information form the param ip
		@param ipAddress : v4 Ip address that will be used to look up all available information from the microservices
	*/
	async find(params: Params): Promise<any> {
		try {
			// TODO Add param for the type of services we want to get from

			logger.info(`Information Microservice. fetching information form ip: ${params?.query}`);
			const paramAddres = params?.query?.ipAddress ?? '';
			const ipAddress = await ipValidatorHelper(paramAddres);
			if (!ipAddress) {
				throw new Error('Validation error, the input Ip on the parameters is not valid');
			}
			//TODO this will be calling microservices in a promise all manner
			const res = await this.fecthIpCallStack(ipAddress);
			const rdap = await this.fecthRDAP(ipAddress);
			return {res, rdap};
		} catch (e) {
			logger.error('There was a error on finding information for the ip', e);
			throw new Error ('There was a error on finding information for the ip');
		}
	}

	//TODO Call for microservice of ipStack
	async fecthIpCallStack(ipAddress: string): Promise<IpStackModel> {
		try {
			//TODO move this to a micro service
			const response = await axios.get(`http://api.ipstack.com/${ipAddress}?access_key=f554f72017127797b2f492b83e67ec29`);
			if (response.data?.error) {
				throw new Error(response.data.error.info);
			}
			const ipInformation: IpStackModel = { ...response.data };
			return ipInformation;
		} catch (e) {
			logger.error('Requesting information form IpStack microservice failed', e);
			throw e;
		}
	}

	//TODO Call for microservice of rdap
	async fecthRDAP(ipAddress: string): Promise<IpStackModel> {
		try {
			//TODO move this to a micro service
			const response = await axios.get(`https://www.rdap.net/ip/${ipAddress}`);
			if (response.data.error) {
				throw new Error(response.data.error?.info);
			}
			const ipInformation: IpStackModel = { ...response.data };
			return ipInformation;
		} catch (e) {
			logger.error('Requesting information form fecthRDAP microservice failed', e);
			throw e;
		}
	}
}

export default IpInformationService;
