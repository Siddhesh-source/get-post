# Simple Cloud Run deployment script

Write-Host "Enabling Cloud Run API..."
gcloud services enable run.googleapis.com

Write-Host "`nDeploying to Cloud Run..."
gcloud run deploy solutions-api `
  --source . `
  --region us-central1 `
  --allow-unauthenticated `
  --platform managed `
  --project crypto-isotope-483913-f4

Write-Host "`nDeployment complete! Your API URL will be shown above."
