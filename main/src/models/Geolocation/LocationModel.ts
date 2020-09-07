interface  LocationModel {
	geoname_id: number,
	capital: string,
	languages: { 
		code: string
		name: string,
		native: string 
	}[],
	country_flag: string,
	country_flag_emoji: string,
	country_flag_emoji_unicode: string,
	calling_code: string,
	is_eu: false,
}

export default LocationModel;

