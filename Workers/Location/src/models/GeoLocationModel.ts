import LocationModel from './LocationModel';
import PayloadModel from './Payload';

interface GeoLocationModel extends PayloadModel{
	ip: string
	type: string
	continent_code: string
	continent_name: string
	country_code: string
	country_name: string
	region_code: string
	region_name: string
	city: string
	zip: string
	latitude: number
	longitude: number
	location: LocationModel
}

export default GeoLocationModel;