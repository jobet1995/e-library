# Vercel CI/CD Pipeline Setup Guide

This document explains how to set up the CI/CD pipeline for deploying the e-library project to Vercel.

## Prerequisites

1. GitHub repository for the project
2. Vercel account (https://vercel.com)
3. Vercel project created for your application

## Setup Instructions

### 1. Vercel Setup

1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Link your project: `vercel link` in your project directory

### 2. GitHub Repository Secrets

Add the following secrets to your GitHub repository (Settings > Secrets and variables > Actions):

- `VERCEL_TOKEN`: Your Vercel authentication token
  - Get this by running `vercel token create`
  - Or from Vercel dashboard: Account Settings > Tokens

### 3. CI/CD Workflow

The pipeline includes the following jobs:

1. **Test**: Runs linting and tests
2. **Deploy**: Deploys the application to Vercel (preview for develop branch, production for master branch)

### 4. Deployment Triggers

- Push to `develop` branch: Deploys a preview deployment to Vercel
- Push to `master` branch: Deploys to production on Vercel
- Pull requests: Runs test job

## Customization

### Environment Variables

1. Set up environment variables in your Vercel project:
   - Go to your Vercel project settings
   - Navigate to Environment Variables
   - Add all required environment variables

### Vercel Project Configuration

The workflow uses the following Vercel CLI commands:

- `vercel pull` - Pulls the project settings
- `vercel build` - Builds the project
- `vercel deploy --prebuilt` - Deploys the prebuilt project

## Troubleshooting

1. **Deployment Fails**
   - Check GitHub Actions logs for specific error messages
   - Verify your Vercel token has the correct permissions
   - Ensure all required environment variables are set in Vercel

2. **Build Errors**
   - Test the build locally with `vercel build`
   - Check for any missing dependencies
   - Verify Node.js version compatibility

3. **Vercel CLI Issues**
   - Make sure you're using the latest version of Vercel CLI
   - Try running `vercel logout` and `vercel login` again
   - Verify your project is properly linked with `vercel link`
