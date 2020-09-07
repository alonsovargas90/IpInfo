import PayloadModel from '../Payload';

interface RDAPModel extends PayloadModel {
	ip: string
	type: string
}

export default RDAPModel;