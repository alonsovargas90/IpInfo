import ipValidatorHelper from '../../src/utils/ipValidatorHelper';

describe('\'utils\' validateServicesList', () => {
	it('validate that the ip and the services are correct and success', async () => {
		const result = await ipValidatorHelper('142.250.64.164', ['LOCATION', 'RDAP']);
		expect(result.isValid).to.be.equals(true);
	});
	it('validate that the domain and the services are correct and success', async () => {
		const result = await ipValidatorHelper('www.google.com', ['LOCATION', 'RDAP']);
		expect(result.isValid).to.be.equals(true);
	});
	it('validate that the domain and the services are correct and success cause bad service', async () => {
		const result = await ipValidatorHelper('142.250.64.164', ['LOCATION', 'NONE EXISTING SERVICE']);
		expect(result.isValid).to.be.equals(false);
	});
	it('validate that the domain and the services are correct and success cause bad ip or domain', async () => {
		let result = await ipValidatorHelper('142x4', ['LOCATION', 'RDAP']);
		expect(result.isValid).to.be.equals(false);
		result = await ipValidatorHelper('142.9-3344', ['LOCATION', 'RDAP']);
		expect(result.isValid).to.be.equals(false);
	});

});