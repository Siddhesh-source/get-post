# Google Cloud Deployment Guide

## Prerequisites
- Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
- Login: `gcloud auth login`
- Set project: `gcloud config set project crypto-isotope-483913-f4`

## Option 1: Deploy to Cloud Run (Recommended)

```bash
# Build and deploy
# Note: Set FIREBASE_SERVICE_ACCOUNT_KEY as a secret in Google Cloud Secret Manager
# Then reference it in your deployment
gcloud run deploy solutions-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --update-secrets FIREBASE_SERVICE_ACCOUNT_KEY=firebase-service-account:latest
```

## Option 2: Deploy to App Engine

```bash
gcloud app deploy
```

## Option 3: Deploy with Cloud Build

```bash
gcloud builds submit --config cloudbuild.yaml
```

## Your API will be available at:
- Cloud Run: https://solutions-api-[hash]-uc.a.run.app
- App Engine: https://crypto-isotope-483913-f4.uc.r.appspot.com

## API Endpoints:
- POST /api/solutions - Create/update solution
- GET /api/solutions?problemId=X - Get solutions by problem ID

## Test after deployment:
```bash
curl -X POST https://YOUR-URL/api/solutions \
  -H "Content-Type: application/json" \
  -d '{"problemId":1,"username":"test","solutionLink":"https://github.com/test/solution"}'

curl https://YOUR-URL/api/solutions?problemId=1
```
