import validateServicesList from '../../src/utils/validateServicesList';

describe('\'utils\' validateServicesList', () => {
	it('validate that all rquired services are on the services list', () => {
		const mock = ['LOCATION','RDAP']
		const result = validateServicesList(mock);
		expect(result).to.be.equals(true);
	});
	it('registered one of the required services is not on the list', () => {
		const mock = ['LOCATION','SOMETHING THAT WILL BREAK']
		const result = validateServicesList(mock);
		expect(result).to.be.equals(false);
	});
});