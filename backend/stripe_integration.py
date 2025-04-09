import stripe
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# Set your secret key. Remember to switch to your live secret key in production!
# See your keys here: https://dashboard.stripe.com/apikeys
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

@app.route('/create-payment-intent', methods=['POST'])
def create_payment_intent():
    try:
        # Create a PaymentIntent with the order amount and currency
        payment_intent = stripe.PaymentIntent.create(
            amount=1000,  # Amount in cents
            currency='usd',
        )
        return jsonify({'clientSecret': payment_intent['client_secret']})
    except Exception as e:
        return jsonify(error=str(e)), 403

@app.route('/webhook', methods=['POST'])
def stripe_webhook():
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get('Stripe-Signature')
    endpoint_secret = os.getenv('STRIPE_ENDPOINT_SECRET')

    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        return jsonify({'error': 'Invalid payload'}), 400
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return jsonify({'error': 'Invalid signature'}), 400

    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        # Send booking confirmation notification
        print('PaymentIntent was successful!')
    else:
        print('Unhandled event type {}'.format(event['type']))

    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(port=4242) 