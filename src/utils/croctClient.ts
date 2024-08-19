import croct from '@croct/plug';

croct.plug({
	appId: import.meta.env.PUBLIC_CROCT_APP_ID,
	// debug: import.meta.env.DEV,
	// cidAssignerEndpointUrl: new URL('/api/cid-assigner', window.location.href).toString(),

	token: null,
	// track: false,
	// baseEndpointUrl: 'https://beta.api.croct.io',
});

window.croct = croct;

// setTimeout(async () => {
// 	const currentTag = Date();
//
// 	await croct.user
// 		.edit()
// 		.set('custom.tag', currentTag)
// 		// .unset('custom.tag')
// 		.save();
//
// 	let counter = 0;
//
// 	const interval = setInterval(async () => {
// 		if (++counter > 5) {
// 			clearInterval(interval);
// 		}
//
// 		try {
// 			const { content } = await croct.fetch('home-intro@2', { timeout: 2000 });
// 			const location = await croct.evaluate('location', { timeout: 2000 });
//
// 			console.log(content, location);
// 		} catch (err) {
// 			console.error(err);
// 		}
// 	}, 500);
// }, 2000);

const delay = (time: number) =>
	new Promise<void>((resolve) => {
		setTimeout(() => {
			resolve();
		}, time);
	});

setTimeout(async () => {
	console.log('Initiating test of new Croct SDK');

	const now = Date();

	console.log(`Setting the property "testTime" on the user to "${now}"`);

	await croct.user.edit().set('custom.testTime', now).save();

	await delay(3000);

	console.log('Reading the property "testTime" from the user');

	const value = await croct.evaluate('user.testTime');

	if (now === value) {
		console.log('Values match, tracking is working correctly.');
	} else {
		console.log(`Received value "${value}". Tracking is misbehaving.`);
	}
}, 2000);

export { croct };
