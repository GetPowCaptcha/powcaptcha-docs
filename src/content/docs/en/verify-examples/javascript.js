const url = 'https://api.powcaptcha.com/challenges/verify';
const solution = 'received_solution_token_from_frontend';
const secret = 'your_powcaptcha_secret_key';
const payload = { solution, secret };
// if you are a premium user, you can pass the `spamFilter` parameter to filter spam
/* payload.spamFilter = {
	email: requestUser.email,
	text: requestUser.text, // text from the user action, e.g. comment, post, etc.
} */

const res = await fetch(url, {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify(payload),
});
const response = await res.json();
if (response.success) {
	// CAPTCHA verification successful
	const signals = response.data.signals;
	console.log('Signals score:', signals.score);
	// if you are a premium user and you passed the `spamFilter` parameter, you can use it to filter spam
	const spamFilter = response.data.spamFilter;
	console.log('Spam filter score:', spamFilter.score);

	// after here you can decide whether to proceed with the user action or block it depending on the scores
	// for example:
	if (signals.score < 0.5) {
		// signals is not acceptable, block the user action
		console.log('Block user action due to low signals score:', signals.score);
		return;
	}
	if (spamFilter && spamFilter.score < 0.5) {
		// spam filter is not acceptable, block the user action
		console.log('Block user action due to low spam filter score:', spamFilter.score);
		return;
	}

	console.log('Proceed with user action.');
} else {
	console.log('Block user action due to CAPTCHA failure:', response.error || 'Verification failed');
}
