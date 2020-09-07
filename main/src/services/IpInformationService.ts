import logger from '../logger';
import axios from 'axios';
import { Params } from '@feathersjs/feathers';
import validateIpAdressParameter from '../utils/validateIpAdressParameter';

class IpInformationService {

	/*
		Root Get route that will get all information form the param ip
		@param ipAddress : v4 Ip address that will be used to look up all available information from the microservices
	*/
	async find(params: Params) {
		try {
			// TODO Add param for the type of services we want to get from
			const ipAddress = params?.query?.ipAddress ?? '';
			logger.info(`Information Microservice. fetching information form ip: ${ipAddress}`);

			if (!ipAddress || !validateIpAdressParameter(ipAddress)) {
				throw new Error('Validation error, the input Ip on the parameters is not valid');
			}
			const res = await this.fecthIpCallStack(ipAddress);
			console.dir(res, {colors: true, depth: 6 });
			return {};
		} catch (e) {
			logger.error(`There was a error on finding information for the ip: ${params.query}`);
			throw e;
		}
	}

	//Call for microservice of ipStack
	async fecthIpCallStack(ipAddress: string): Promise<any> {
		try {
			return await axios.get('http://api.ipstack.com/186.177.152.93?access_key=f554f72017127797b2f492b83e67ec29');
		  } catch (e) {
			logger.error('Requesting information form IpStack microservice failed');
			throw e;
		  }
	}
}

export default IpInformationService;