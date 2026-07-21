# Brevo Email Setup - Quick Start (5 Minutes)

## ⚡ TL;DR

1. Get API key from [brevo.com](https://brevo.com)
2. Add to Vercel: `BREVO_API_KEY=your_key` and `EMAIL_FROM=noreply@domain.com`
3. Deploy
4. Done ✅

## Step-by-Step

### 1. Create Brevo Account
```
Visit https://brevo.com → Sign Up (Free)
```

### 2. Get API Key
```
Dashboard → SMTP & API → Copy API Key
```

### 3. Set Environment Variables in Vercel
```
Project Settings → Environment Variables

Add:
BREVO_API_KEY=paste_your_api_key_here
EMAIL_FROM=noreply@yourdomain.com
```

### 4. Deploy
```
git push origin main
```

## Environment Variables

| Variable | Value | Example |
|----------|-------|---------|
| `BREVO_API_KEY` | Your Brevo API key | From Brevo dashboard |
| `EMAIL_FROM` | Sender email address | noreply@careerpilot.ai |

**Legacy Support:**
- Can also use `SENDINBLUE_API_TOKEN` (both are supported)

## Verify It Works

Check Brevo dashboard:
```
SMTP & API → Logs → View email delivery status
```

## Features

✅ Resume analysis emails  
✅ Job match notifications  
✅ Weekly digest emails  
✅ Email reminders  
✅ Full error handling  

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Emails not sending | Check `BREVO_API_KEY` is set |
| Wrong sender | Check `EMAIL_FROM` is set |
| 401 error | Verify API key is correct |
| Emails to spam | Add SPF/DKIM records |

## Documentation

- **Full guide:** `DEPLOYMENT.md`
- **Email setup:** `EMAIL_SETUP.md`
- **Migration details:** `BREVO_MIGRATION_FINAL.md`

## Support

- [Brevo Docs](https://developers.brevo.com/docs)
- [Project README](README.md)
