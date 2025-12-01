#!/bin/bash

# Exit on error
set -e

# Load environment variables
GITHUB_TOKEN=${GITHUB_TOKEN}
GITHUB_USER=${GITHUB_USER}
REPO_NAME=${REPO_NAME}
BRANCH=${BRANCH:-main}

# Validate required variables
if [ -z "$GITHUB_TOKEN" ] || [ -z "$GITHUB_USER" ] || [ -z "$REPO_NAME" ]; then
    echo "Error: Missing required environment variables:"
    echo "  GITHUB_TOKEN: $([[ -z "$GITHUB_TOKEN" ]] && echo 'NOT SET' || echo 'SET')"
    echo "  GITHUB_USER: $([[ -z "$GITHUB_USER" ]] && echo 'NOT SET' || echo 'SET')"
    echo "  REPO_NAME: $([[ -z "$REPO_NAME" ]] && echo 'NOT SET' || echo 'SET')"
    exit 1
fi

echo "📦 Uploading to GitHub..."
echo "  Repository: $GITHUB_USER/$REPO_NAME"
echo "  Branch: $BRANCH"

# Configure git
git config --global user.email "replit@example.com"
git config --global user.name "Replit Upload"

# Check if remote already exists
if git remote | grep -q origin; then
    echo "Updating existing remote..."
    git remote remove origin
fi

# Add remote with token authentication
git remote add origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

# Ensure we're on the correct branch
git branch -M $BRANCH

# Stage all changes
git add .

# Commit if there are changes
if git diff --cached --quiet; then
    echo "No changes to commit."
else
    git commit -m "Deploy from Replit"
fi

# Push to GitHub
echo "Pushing code to GitHub..."
git push -u origin $BRANCH --force

echo "✅ Upload complete!"
echo "🔗 View your repository: https://github.com/${GITHUB_USER}/${REPO_NAME}"
