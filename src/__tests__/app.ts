test('setup', () => {
	const i = true;

	expect.assertions(2);

	expect(i).toBeDefined();
	expect(i).toBeTruthy();
});
