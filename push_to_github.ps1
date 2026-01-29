# Smart Canteen - GitHub Push Script
# Run this once you have Git installed (https://git-scm.com/)

Write-Host "Initializing Git..." -ForegroundColor Cyan
git init

Write-Host "Adding remote origin..." -ForegroundColor Cyan
git remote add origin https://github.com/siddharth2003sd/Smart-canteen

Write-Host "Committing files..." -ForegroundColor Cyan
git add .
git commit -m "Initial commit: Smart Canteen Management System (Web Application)"

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git branch -M main
git push -u origin main

Write-Host "Done! Check your repository at https://github.com/siddharth2003sd/Smart-canteen" -ForegroundColor Green
