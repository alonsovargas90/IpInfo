import PayloadModel from './PayloadModel';

interface ServiceResponseModel {
	data: {
		error: string,
		service: string,
		payload: PayloadModel
	}
}

export default ServiceResponseModel;