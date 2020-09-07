import SERVICES from '../constants/SERVICES';

/**
	Validate that the list of param is contained in the complete list of all services available
	All services in the param list should be on the SERVICES else returns false
**/
export default  function validateServicesList(services:Array<string>): boolean {
	const servicesMap = Object.values(SERVICES);
	return services.every((v: string) => servicesMap.includes(v));
}