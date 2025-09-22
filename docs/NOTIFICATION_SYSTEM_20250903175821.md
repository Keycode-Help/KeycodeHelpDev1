# Keycode Help Notification System

## Overview

The Keycode Help notification system provides comprehensive email and SMS notifications for keycode requests. The system automatically sends notifications when:

- A new keycode request is submitted
- A keycode request status is updated (in progress, completed)
- A keycode is completed and ready for pickup
- Admin notifications for new requests

## Features

### 📧 Email Notifications

- **HTML-formatted emails** with professional styling
- **Automatic email sending** via Brevo SMTP
- **Fallback mechanisms** if primary notification fails
- **User preference controls** for email notifications

### 📱 SMS Notifications

- **Twilio integration** for reliable SMS delivery
- **Phone number formatting** and validation
- **Privacy protection** with hashed VIN numbers
- **User preference controls** for SMS notifications

### ⚙️ User Preferences

- **Granular control** over notification types
- **Email and SMS toggles** for each notification type
- **Default preferences** for new users
- **Admin management** of user preferences

## System Architecture

### Core Services

1. **KeycodeNotificationService** - Main orchestration service
2. **SmsNotificationService** - Twilio SMS integration
3. **EmailService** - Enhanced email service with HTML support
4. **NotificationPreferencesService** - User preference management

### Database Models

- **NotificationPreferences** - User notification settings
- **Vehicle** - Keycode request information
- **KeycodeUser** - User information for notifications

## Configuration

### Environment Variables

Add these to your Render environment variables:

```bash
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Admin phone number for notifications
ADMIN_PHONE_NUMBER=+1234567890
```

### Email Configuration

Email notifications use the existing Brevo SMTP configuration:

```bash
MAIL_HOST=smtp-relay.brevo.com
MAIL_USERNAME=your_brevo_username
MAIL_PASSWORD=your_brevo_password
MAIL_PORT=587
```

## API Endpoints

### Notification Management

#### Test Notification System

```http
POST /api/notifications/test
Authorization: Bearer <admin_token>
Content-Type: application/x-www-form-urlencoded

testEmail=test@example.com&testPhone=+1234567890
```

#### Test SMS Only

```http
POST /api/notifications/test-sms
Authorization: Bearer <admin_token>
Content-Type: application/x-www-form-urlencoded

phoneNumber=+1234567890
```

#### Get Notification Status

```http
GET /api/notifications/status
Authorization: Bearer <admin_token>
```

### User Preferences

#### Get User Preferences

```http
GET /api/notification-preferences
Authorization: Bearer <user_token>
```

#### Update User Preferences

```http
PUT /api/notification-preferences
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "emailNotifications": true,
  "smsNotifications": true,
  "keycodeRequestNotifications": true,
  "keycodeStatusNotifications": true,
  "keycodeCompletionNotifications": true,
  "adminNotifications": false,
  "marketingNotifications": false
}
```

#### Reset to Defaults

```http
POST /api/notification-preferences/reset
Authorization: Bearer <user_token>
```

## Notification Types

### 1. Keycode Request Submission

**Triggers:** When a user submits a new keycode request

**Email Content:**

- Professional HTML template
- Vehicle information
- Request confirmation
- Next steps information

**SMS Content:**

- Brief confirmation message
- Vehicle information
- Request ID reference

### 2. Status Updates

**Triggers:** When admin updates request status to "IN PROGRESS"

**Email Content:**

- Status update notification
- Vehicle information
- Expected timeline

**SMS Content:**

- Short status update
- VIN reference (hashed)

### 3. Keycode Completion

**Triggers:** When keycode is ready for pickup

**Email Content:**

- Completion notification
- Instructions for pickup
- Account login reminder

**SMS Content:**

- Completion alert
- Pickup instructions

### 4. Admin Notifications

**Triggers:** When new keycode request is submitted

**Recipients:** Admin users
**Content:** Request details and customer information

## User Experience

### Default Behavior

- **New users** get all notifications enabled by default
- **Email notifications** are always sent (if user has email)
- **SMS notifications** are sent if user has phone number and SMS is enabled
- **Guest users** receive notifications via email only

### Privacy Protection

- **VIN numbers** are hashed in notifications (e.g., "1HGBH41JXMN109186" → "1HGB\*\*\*\*9186")
- **Phone numbers** are formatted and validated
- **Personal information** is protected in all communications

### Error Handling

- **Graceful degradation** - if SMS fails, email still works
- **Fallback mechanisms** - old email system as backup
- **Non-blocking** - notification failures don't affect keycode processing
- **Comprehensive logging** for debugging

## Testing

### Local Development

1. **Email testing** - Uses existing Brevo SMTP
2. **SMS testing** - Requires Twilio account setup
3. **Notification testing** - Use `/api/notifications/test` endpoint

### Production Deployment

1. **Configure Twilio** environment variables
2. **Test notification system** using admin endpoints
3. **Verify email delivery** through Brevo dashboard
4. **Monitor SMS delivery** through Twilio console

## Monitoring

### Logs to Monitor

- `✅ SMS sent successfully` - SMS delivery confirmation
- `✅ Email sent successfully` - Email delivery confirmation
- `⚠️ Failed to send notifications` - Notification failures
- `❌ SMS not configured` - Missing Twilio configuration

### Health Checks

- Use `/api/notifications/status` to check system health
- Monitor Twilio account balance
- Check Brevo email delivery rates

## Troubleshooting

### Common Issues

#### SMS Not Working

1. Check Twilio environment variables
2. Verify phone number format (+1XXXXXXXXXX)
3. Check Twilio account balance
4. Review Twilio logs for errors

#### Email Not Working

1. Verify Brevo SMTP configuration
2. Check email credentials
3. Review Brevo delivery logs
4. Test with `/api/notifications/test` endpoint

#### Notifications Not Sent

1. Check user notification preferences
2. Verify user has email/phone number
3. Review application logs for errors
4. Test notification system status

### Debug Commands

```bash
# Test notification system
curl -X POST "https://your-backend.com/api/notifications/test" \
  -H "Authorization: Bearer <admin_token>" \
  -d "testEmail=test@example.com&testPhone=+1234567890"

# Check notification status
curl -X GET "https://your-backend.com/api/notifications/status" \
  -H "Authorization: Bearer <admin_token>"
```

## Future Enhancements

### Planned Features

- **Push notifications** for mobile app
- **WhatsApp integration** for international users
- **Notification templates** customization
- **Bulk notification** management
- **Notification analytics** and reporting
- **Multi-language support** for notifications

### Integration Opportunities

- **Webhook support** for external systems
- **Slack notifications** for admin team
- **Discord integration** for community updates
- **Email marketing** integration
- **Customer support** ticket creation

## Security Considerations

- **Phone number validation** prevents abuse
- **Rate limiting** on notification endpoints
- **Admin-only access** to notification management
- **User preference validation** prevents unauthorized changes
- **Secure credential storage** for Twilio and email services

## Performance

- **Asynchronous processing** for notifications
- **Connection pooling** for email and SMS services
- **Caching** of user preferences
- **Batch processing** for bulk notifications
- **Error retry mechanisms** with exponential backoff

---

## Quick Start

1. **Add Twilio credentials** to environment variables
2. **Deploy the updated backend** with notification system
3. **Test the system** using admin endpoints
4. **Configure user preferences** through the API
5. **Monitor notifications** in production

The notification system is now fully integrated and ready for production use! 🎉
