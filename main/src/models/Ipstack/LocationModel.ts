import LanguageModel from './LanguageModel';

interface  IpStackLocationModel {
	geoname_id: number,
	capital: string,
	languages: LanguageModel[],
	country_flag: string,
	country_flag_emoji: string,
	country_flag_emoji_unicode: string,
	calling_code: string,
	is_eu: false,
}

export default IpStackLocationModel;

