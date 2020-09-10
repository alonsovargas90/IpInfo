import { Application } from '../declarations';
import RDAPService from './RDAPService';

export default function (app: Application): void {
	// Register our messages service
	app.use('/v1/rdap', new RDAPService());
}
