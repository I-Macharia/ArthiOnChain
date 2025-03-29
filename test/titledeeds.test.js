const { expect } = require('chai');
const TitleDeeds = artifacts.require('TitleDeeds');

contract('TitleDeeds', (accounts) => {
	let titleDeeds;

	beforeEach(async () => {
		titleDeeds = await TitleDeeds.new();
	});

	it('should create a new title deed', async () => {
		await titleDeeds.createDeed('Property 1', accounts[1]);
		const deed = await titleDeeds.getDeed(1);
		expect(deed.owner).to.equal(accounts[1]);
		expect(deed.propertyName).to.equal('Property 1');
	});

	it('should transfer ownership of a title deed', async () => {
		await titleDeeds.createDeed('Property 2', accounts[2]);
		await titleDeeds.transferDeed(1, accounts[3], { from: accounts[2] });
		const deed = await titleDeeds.getDeed(1);
		expect(deed.owner).to.equal(accounts[3]);
	});

	it('should not allow non-owners to transfer a title deed', async () => {
		await titleDeeds.createDeed('Property 3', accounts[4]);
		try {
			await titleDeeds.transferDeed(1, accounts[5], { from: accounts[6] });
			assert.fail('Expected error not received');
		} catch (error) {
			expect(error.reason).to.equal('Only the owner can transfer the deed');
		}
	});
});