# Stripe Integration Setup Guide

## Overview

The cart page has been enhanced with modern UI and Stripe payment integration. This guide will help you set up Stripe for processing payments.

## Frontend Setup

### 1. Environment Variables

Create a `.env` file in the `kch-frontend` directory with your Stripe publishable key:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key_here
```

### 2. Stripe Keys

- **Publishable Key**: Used in the frontend (starts with `pk_test_` for test mode)
- **Secret Key**: Used in the backend (starts with `sk_test_` for test mode)

## Backend Setup

### 1. Environment Variables

Update the `application.properties` file in `kch-backend/src/main/resources/` with your Stripe secret key:

```properties
# Stripe Configuration
stripe.secret.key=sk_test_your_actual_stripe_secret_key_here
stripe.publishable.key=pk_test_your_actual_stripe_publishable_key_here
```

### 2. Dependencies

The Stripe Java SDK has been added to `pom.xml`:

```xml
<dependency>
    <groupId>com.stripe</groupId>
    <artifactId>stripe-java</artifactId>
    <version>24.8.0</version>
</dependency>
```

## Features Implemented

### Modern Cart UI

- **Glassmorphism Design**: Modern glass-like effects with backdrop blur
- **Smooth Animations**: Hover effects, slide animations, and transitions
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Interactive Elements**: Hover states, loading spinners, and success messages

### Cart Functionality

- **Cart Items Display**: Shows vehicle keycodes and subscriptions with pricing
- **Subscription Management**: Add/remove subscription plans
- **Real-time Pricing**: Dynamic calculation with subscription discounts
- **Item Removal**: Smooth removal animations with API integration

### Payment Integration

- **Stripe Elements**: Secure card input with Stripe's pre-built components
- **Payment Intent Creation**: Backend creates payment intents for secure processing
- **Error Handling**: Comprehensive error handling for payment failures
- **Success Flow**: Automatic cart clearing and success messaging

### Subscription Plans

- **Three Tiers**: Basic ($9.99), Professional ($24.99), Enterprise ($99.99)
- **Feature Comparison**: Detailed feature lists for each tier
- **Visual Hierarchy**: Color-coded cards with icons and pricing
- **Add to Cart**: One-click subscription addition

## API Endpoints

### Frontend

- `POST /api/payments/create-payment-intent` - Creates Stripe payment intent
- `POST /api/payments/confirm-payment` - Confirms payment status

### Backend

- `POST /cart/addSubscription` - Adds subscription to cart
- `DELETE /cart/remove/{itemId}` - Removes item from cart
- `GET /cart/items` - Fetches cart items
- `GET /keycode-user/subscription` - Gets user subscription status

## Security Features

### Frontend

- **Stripe Elements**: PCI-compliant card input
- **Client-side Validation**: Form validation before submission
- **Error Boundaries**: Graceful error handling

### Backend

- **JWT Authentication**: Secure API access
- **Stripe Webhooks**: Secure payment processing
- **Input Validation**: Server-side validation of payment data

## Testing

### Test Cards

Use these Stripe test cards for testing:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

### Test Mode

- All payments are processed in test mode
- No real charges will be made
- Use test keys for development

## Production Deployment

### 1. Switch to Live Keys

Replace test keys with live keys:

- `pk_live_...` for publishable key
- `sk_live_...` for secret key

### 2. Environment Configuration

- Set up environment variables in production
- Use secure key management
- Enable HTTPS for all endpoints

### 3. Webhook Setup

- Configure Stripe webhooks for production
- Handle payment confirmations
- Set up error monitoring

## Troubleshooting

### Common Issues

1. **Payment Intent Creation Fails**: Check Stripe secret key
2. **Card Element Not Loading**: Verify publishable key
3. **CORS Errors**: Ensure backend CORS configuration
4. **Authentication Errors**: Check JWT token validity

### Debug Mode

Enable debug logging in the backend:

```properties
logging.level.org.rma.kchbackend=DEBUG
```

## Next Steps

### Potential Enhancements

1. **Webhook Integration**: Real-time payment status updates
2. **Order Management**: Complete order processing workflow
3. **Email Notifications**: Payment confirmation emails
4. **Analytics**: Payment and subscription analytics
5. **Refund Processing**: Handle refunds and disputes

### Security Improvements

1. **Rate Limiting**: Prevent payment abuse
2. **Fraud Detection**: Implement fraud prevention
3. **Audit Logging**: Track all payment activities
4. **PCI Compliance**: Ensure full PCI compliance

## Support

For Stripe-specific issues:

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)

For application issues:

- Check the application logs
- Review the API documentation
- Contact the development team
