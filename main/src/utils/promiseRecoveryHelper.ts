import ServiceResponseModel from '../models/ServiceResponseModel';

export default async function promiseRecoveryHelper(promises: Promise<ServiceResponseModel>[]): Promise<Array<ServiceResponseModel>>  {
	// Basically we are catching if a promise to a micro service fails
	// Create a new obj of the ServiceResponseModel with the error
	// And contining to return all the services that completed
	return Promise.all(
		promises.map(p => p.catch((error: any) => {
			return { data: { error: error.message}} as ServiceResponseModel;
		}))
	);
}