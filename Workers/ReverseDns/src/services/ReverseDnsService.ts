import dns from 'dns';
import logger from '../logger';
import { Params } from '@feathersjs/feathers';
import ServiceResponseModel from '../models/ServiceResponseModel';
import ReverseDnsModel from '../models/ReverseDnsModel';
const dnsPromises = dns.promises;

class ReverseDnsService {
	async find(params: Params ): Promise<ServiceResponseModel> {
		try {
			let payload:any;
			const ipAddress = params?.query?.ip || '';
			logger.info(`Request Information for the Reverse DNS lookup ... ip:${ipAddress}`);
			try{
				const response = await dnsPromises.reverse(ipAddress);
				payload = { domain: response } as ReverseDnsModel;
			} catch(err){
				// I decided that we don't want to fail this everytime that the ip doesn't have a dns record
				// Most ips won't have a dns so Im sending the response of the error back in the payload instead
				// So this service will differ from the other in that regard 
				payload = { domain: [''], error: err } as ReverseDnsModel;
			}
			const serviceResponse =  { data: { payload: payload,  service: 'REVERSE_DNS', error: ''} } as ServiceResponseModel;
			return serviceResponse;
		} catch (e) {
			logger.error('Requesting information from Reverse DNS microservice failed', e);
			throw e;
		}
	}
}

export default ReverseDnsService;