import requests
import json

url = 'https://api.powcaptcha.com/challenges/verify'
solution = 'received_solution_token_from_frontend'
secret = 'your_powcaptcha_secret_key'

payload = {
	'solution': solution,
	'secret': secret,
}

# If you are a premium user, you can pass the `spamFilter` parameter to filter spam
# payload['spamFilter'] = {
#     'email': request_user['email'],
#     'text': request_user['text'],  # text from the user action, e.g. comment, post, etc.
# }

headers = {
	'Content-Type': 'application/json'
}

try:
	response = requests.post(url, headers=headers, data=json.dumps(payload))
	response.raise_for_status()
except requests.RequestException as e:
	print("Block user action due to CAPTCHA failure: Request failed")
	exit()

result = response.json()

if result.get('success'):
	signals = result['data']['signals']
	print(f"Signals score: {signals['score']}")

	spam_filter = result['data'].get('spamFilter')
	if spam_filter:
		print(f"Spam filter score: {spam_filter['score']}")

	# Decide whether to proceed with the user action or block it depending on the scores
	if signals['score'] < 0.5:
		print(f"Block user action due to low signals score: {signals['score']}")
		exit()
	if spam_filter and spam_filter['score'] < 0.5:
		print(f"Block user action due to low spam filter score: {spam_filter['score']}")
		exit()

	print("Proceed with user action.")
else:
	error = result.get('error', 'Verification failed')
	print(f"Block user action due to CAPTCHA failure: {error}")
