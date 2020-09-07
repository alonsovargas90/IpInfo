import dns from 'dns';
import util from 'util';
import logger from '../logger';
import validateIpAdress from './validateIpAdress';

/* 
Helper that will be used for standarizing the param into a valid ipv4 address 
if the @param value is neither a ipv4 or a domain then it will return false
*/
const lookup = util.promisify(dns.lookup);

export default async function ipValidatorHelper(value: string): Promise<any> {
	try {
		if (validateIpAdress(value)) {
			//If the param comes as a valid ip address use it directly
			return value;
		}
		// If the params is not a ip check if its a valid domian
		const result = await lookup(value);
		return result.address || false;
	} catch (e){
		logger.error('There was a error validating the ip/domain param', value);
		throw e;
	}
}
