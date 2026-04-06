# GigSphere One-Click Deployment Script
# This script automates GitHub push and Vercel deployment.

Write-Host "🚀 Starting GigSphere Proper Deployment..." -ForegroundColor Cyan

# 1. GitHub Setup
$repoName = "gig-sphere"
Write-Host "`nStep 1: GitHub Repository" -ForegroundColor Yellow
$githubUser = Read-Host "Enter your GitHub Username"
if (-not $githubUser) { Write-Host "Error: Username required."; exit }

Write-Host "Initializing Git and committing files..." -ForegroundColor Gray
git init
git add .
git commit -m "Production ready: GigSphere AI Marketplace"
git branch -M main
$remoteUrl = "https://github.com/$githubUser/$repoName.git"
git remote add origin $remoteUrl 2>$null
git remote set-url origin $remoteUrl

Write-Host "Attempting to push to GitHub ($remoteUrl)..." -ForegroundColor Gray
Write-Host "NOTE: You may be prompted for your GitHub password or PAT." -ForegroundColor Magenta
git push -u origin main

# 2. Vercel Setup
Write-Host "`nStep 2: Vercel Frontend Deployment" -ForegroundColor Yellow
Write-Host "Deploying the frontend to Vercel..." -ForegroundColor Gray
cd frontend
npx vercel deploy --name $repoName --prod
cd ..

Write-Host "`n✅ Deployment process initiated!" -ForegroundColor Green
Write-Host "1. Check your GitHub: https://github.com/$githubUser/$repoName"
Write-Host "2. Check your Vercel Dashboard for the Production Link."
Write-Host "3. Remember to set VITE_API_BASE_URL in Vercel to your Backend URL."
