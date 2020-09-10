import PayloadModel from './Payload';

interface ServiceResponseModel {
	data: {
		error: string,
		service: string,
		payload: PayloadModel
	}
}

export default ServiceResponseModel;