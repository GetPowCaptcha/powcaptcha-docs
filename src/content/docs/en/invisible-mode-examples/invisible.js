const formDocsExample = document.getElementById('form-docs-example');
const widgetDocsExample = formDocsExample.querySelector('powcaptcha-widget');
const submitButton = formDocsExample.querySelector("input[type='submit']");

widgetDocsExample.addEventListener('@powcaptcha/widget/solving/progress', function (event) {
	const { progress } = event.detail;
	submitButton.value = `Loading... ${progress}%`;
	submitButton.disabled = true;
});

widgetDocsExample.addEventListener('@powcaptcha/widget/solved', function () {
	submitButton.value = 'Submit';
	submitButton.disabled = false;
});

widgetDocsExample.addEventListener('@powcaptcha/widget/error', function () {
	submitButton.value = 'Submit';
	submitButton.disabled = false;
});

let signalsReady = false;
const timeoutMs = 5000; // 5 seconds timeout to get signals

setTimeout(() => {
	signalsReady = true;
	console.log('Signals are ready');
}, timeoutMs);

formDocsExample.addEventListener('submit', async (event) => {
	event.preventDefault();
	const token = await widgetDocsExample.execute();
	console.log('Widget executed, ready to submit', token);
	// submit your form
	widgetDocsExample.submit();
});

async function resolveIfSignalsAreReady() {
	if (!signalsReady || widgetDocsExample.isLoading() || widgetDocsExample.isValidated()) {
		return;
	}
	await widgetDocsExample.execute();
}

// watch form fields
const fields = formDocsExample.querySelectorAll('input, textarea, select');
fields.forEach((field) => {
	field.addEventListener('focus', resolveIfSignalsAreReady);
	field.addEventListener('keydown', resolveIfSignalsAreReady);
});
