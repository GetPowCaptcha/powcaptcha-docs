<?php

$url = 'https://api.powcaptcha.com/challenges/verify';
$solution = 'received_solution_token_from_frontend';
$secret = 'your_powcaptcha_secret_key';

$payload = [
	'solution' => $solution,
	'secret' => $secret,
];

// If you are a premium user, you can pass the `spamFilter` parameter to filter spam
/*
$payload['spamFilter'] = [
	'email' => $requestUser['email'],
	'text' => $requestUser['text'], // text from the user action, e.g. comment, post, etc.
];
*/

$options = [
	'http' => [
		'header'  => "Content-Type: application/json\r\n",
		'method'  => 'POST',
		'content' => json_encode($payload),
		'ignore_errors' => true,
	],
];

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

if ($result === FALSE) {
	// Handle error
	echo "Block user action due to CAPTCHA failure: Request failed";
	return;
}

$response = json_decode($result, true);

if (!empty($response['success'])) {
	// CAPTCHA verification successful
	$signals = $response['data']['signals'];
	echo 'Signals score: ' . $signals['score'] . PHP_EOL;

	// If you are a premium user and you passed the `spamFilter` parameter, you can use it to filter spam
	$spamFilter = isset($response['data']['spamFilter']) ? $response['data']['spamFilter'] : null;
	if ($spamFilter) {
		echo 'Spam filter score: ' . $spamFilter['score'] . PHP_EOL;
	}

	// Decide whether to proceed with the user action or block it depending on the scores
	if ($signals['score'] < 0.5) {
		echo 'Block user action due to low signals score: ' . $signals['score'] . PHP_EOL;
		return;
	}
	if ($spamFilter && $spamFilter['score'] < 0.5) {
		echo 'Block user action due to low spam filter score: ' . $spamFilter['score'] . PHP_EOL;
		return;
	}

	echo 'Proceed with user action.' . PHP_EOL;
} else {
	$error = isset($response['error']) ? $response['error'] : 'Verification failed';
	echo 'Block user action due to CAPTCHA failure: ' . $error . PHP_EOL;
}
