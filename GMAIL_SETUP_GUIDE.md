# Gmail SMTP Setup Guide for Contact Form

## Overview
This guide will help you set up Gmail SMTP to send emails from your portfolio contact form using your Gmail account: `sibghat.developlogix@gmail.com`

## Step 1: Enable 2-Factor Authentication

1. Go to your Google Account settings: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click on "2-Step Verification"
4. Follow the prompts to enable 2-Factor Authentication if not already enabled

## Step 2: Generate App Password

1. After enabling 2-Factor Authentication, go back to Security settings
2. Under "Signing in to Google", click on "App passwords"
3. Select "Mail" from the dropdown
4. Select "Other (Custom name)" and enter "Portfolio Website"
5. Click "Generate"
6. **IMPORTANT**: Copy the 16-character app password (it will look like: `abcd efgh ijkl mnop`)
7. Save this password securely - you won't be able to see it again

## Step 3: Update PHP Configuration

### Option A: Using Basic PHP mail() function (send-email.php)
- This uses your server's built-in mail function
- May not work on all hosting providers
- No additional setup required
- Less reliable for Gmail

### Option B: Using PHPMailer with SMTP (send-email-smtp.php) - RECOMMENDED
1. Install PHPMailer via Composer:
   ```bash
   composer require phpmailer/phpmailer
   ```

2. Update the password in `send-email-smtp.php`:
   ```php
   $mail->Password = 'YOUR_16_CHAR_APP_PASSWORD_HERE'; // Replace with your app password
   ```

## Step 4: Server Requirements

### For Basic PHP Version:
- PHP 5.4 or higher
- `mail()` function enabled on server

### For PHPMailer Version:
- PHP 7.0 or higher
- OpenSSL extension enabled
- Composer installed (for PHPMailer)

## Step 5: File Structure

Your website should have this structure:
```
your-website/
├── index.html
├── send-email.php (basic version)
├── send-email-smtp.php (advanced version)
├── assets/
│   └── js/
│       └── contact-form.js
├── vendor/ (if using PHPMailer)
│   └── phpmailer/
└── GMAIL_SETUP_GUIDE.md
```

## Step 6: Testing

1. Upload all files to your web server
2. Make sure your server supports PHP
3. Test the contact form on your website
4. Check your Gmail inbox for test messages

## Troubleshooting

### Common Issues:

1. **"Authentication failed" error**
   - Make sure you're using the App Password, not your regular Gmail password
   - Verify 2-Factor Authentication is enabled

2. **"Could not connect to SMTP host" error**
   - Check if your server allows outbound connections on port 587
   - Some shared hosting providers block SMTP

3. **Form not submitting**
   - Check browser console for JavaScript errors
   - Verify all file paths are correct

4. **Emails not received**
   - Check spam folder
   - Verify the email address in the PHP file is correct

### Alternative Solutions:

If Gmail SMTP doesn't work on your hosting:

1. **Use hosting provider's SMTP**
   - Contact your hosting provider for SMTP settings
   - Update the SMTP configuration accordingly

2. **Use email services like SendGrid or Mailgun**
   - These are more reliable for transactional emails
   - Require API keys instead of SMTP

3. **Use form services like Formspree or Netlify Forms**
   - Third-party services that handle form submissions
   - No server-side code required

## Security Notes

1. **Never commit App Passwords to version control**
2. **Use environment variables for sensitive data in production**
3. **Implement rate limiting to prevent spam**
4. **Add CAPTCHA for additional security**

## Production Deployment

For production, consider:
1. Moving sensitive credentials to environment variables
2. Adding input sanitization and validation
3. Implementing rate limiting
4. Adding CAPTCHA verification
5. Using HTTPS for secure transmission

## Support

If you encounter issues:
1. Check your hosting provider's documentation
2. Test with a simple PHP script first
3. Contact your hosting support for SMTP configuration help
