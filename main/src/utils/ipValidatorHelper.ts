import dns from 'dns';
import util from 'util';
import logger from '../logger';
import validateIpAdress from './validateIpAdress';
import IpInformationModel from '../models/IpInformationModel';
import validateServicesList from './validateServicesList';

/**
	Helper that will be used for standarizing the param into a valid ipv4 address 
	@param value is neither a ipv4 or a domain then it will return false
**/
const lookup = util.promisify(dns.lookup);

export default async function ipValidatorHelper(address: string, services: Array<string>): Promise<IpInformationModel> {
	try {
		const response = {} as IpInformationModel;
		response.isValid = true;
		response.ip = address;
		response.services = services;
		// Validate the ip/domain param
		if (validateIpAdress(address)) {
			//If the param comes as a valid ip address use it directly
			response.ip = address;
		} else {
			// If the params is not a ip check if its a valid domian
			const lookupResponse = await lookup(address);
			if (lookupResponse && lookupResponse.address) {
				response.ip = lookupResponse.address;
			} else {
				response.isValid = false;
				response.error = 'Validation error: invalid ip/domain';
			}
		}
		// Validate the services array
		if (!validateServicesList(services)) {
			response.isValid = false;
			response.error = 'Validation error: One of the requested services doesn\'t exist';
		}
		return response
	} catch (e) {
		logger.error('There was a error validating the ip/domain param', address, services);
		throw e;
	}
}
