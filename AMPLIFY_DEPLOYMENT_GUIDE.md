# AWS Amplify Deployment Guide

This guide will help you deploy your renovated Formula Platform to AWS Amplify.

## ⚠️ Important Note: Environment Variables
AWS Amplify restricts environment variables starting with "AWS" prefix. This project uses `BEDROCK_*` variables instead of `AWS_*` to avoid deployment issues.

## Prerequisites

- AWS Account with appropriate permissions
- GitHub/GitLab/Bitbucket repository with your code
- Domain name (optional, for custom domains)

## Environment Variables Setup

Before deploying, ensure you have the following environment variables set up in your deployment environment:

```bash
# AWS Bedrock Configuration
# Note: Variable names avoid "AWS" prefix due to Amplify restrictions
BEDROCK_ACCESS_KEY_ID=your_access_key_here
BEDROCK_SECRET_ACCESS_KEY=your_secret_key_here
BEDROCK_REGION=us-east-1

# Next.js Configuration
NODE_ENV=production
```

## Step-by-Step Deployment Instructions

### Step 1: Prepare Your Repository

1. **Initialize Git Repository** (if not already done):
   ```bash
   cd formula_platform/app
   git init
   git add .
   git commit -m "Initial commit: Formula Platform with AWS Nova integration"
   ```

2. **Push to GitHub/GitLab/Bitbucket**:
   ```bash
   git remote add origin https://github.com/yourusername/formula-platform.git
   git push -u origin main
   ```

### Step 2: Deploy to AWS Amplify

1. **Access AWS Amplify Console**:
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "Create app"

2. **Connect Repository**:
   - Choose "Deploy with Amplify Web Hosting"
   - Select your Git provider (GitHub/GitLab/Bitbucket)
   - Authorize AWS Amplify to access your repository
   - Select your repository and branch (usually `main` or `master`)

3. **Build Settings Configuration**:
   Amplify should auto-detect it's a Next.js app. Use this build specification:

   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

4. **Environment Variables Setup**:
   - In the Amplify console, go to "Environment variables"
   - Add the required environment variables (note: no "AWS" prefix due to Amplify restrictions):
     ```
     BEDROCK_ACCESS_KEY_ID = your_aws_access_key_here
     BEDROCK_SECRET_ACCESS_KEY = your_aws_secret_access_key_here
     BEDROCK_REGION = us-east-1
     NODE_ENV = production
     ```

5. **Deploy**:
   - Click "Save and deploy"
   - Amplify will automatically build and deploy your application
   - Monitor the build logs for any issues

### Step 3: Post-Deployment Configuration

1. **Verify Deployment**:
   - Once deployed, you'll get an Amplify URL like: `https://main.d1234567890abcdef.amplifyapp.com`
   - Test the application in both English and Thai languages
   - Verify AWS Nova Lite text generation works
   - Check AWS Nova Canvas image generation functionality

2. **Custom Domain (Optional)**:
   - In Amplify console, go to "Domain management"
   - Click "Add domain"
   - Follow the wizard to connect your custom domain

3. **HTTPS and Security**:
   - Amplify automatically provides HTTPS certificates
   - All traffic is secured by default

## Build Configuration Details

### package.json Build Commands
Ensure your `package.json` has these scripts:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### Next.js Configuration
Your `next.config.js` should be optimized for production:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['c8.alamy.com'], // Add any external image domains
  },
}

module.exports = nextConfig
```

## AWS Bedrock Permissions

Ensure your AWS credentials have the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": [
        "arn:aws:bedrock:us-east-1::foundation-model/amazon.nova-lite-v1:0",
        "arn:aws:bedrock:us-east-1::foundation-model/amazon.nova-canvas-v1:0"
      ]
    }
  ]
}
```

## Monitoring and Troubleshooting

### Build Issues
- Check Amplify build logs for Node.js version compatibility
- Ensure all dependencies are properly installed
- Verify environment variables are correctly set

### Runtime Issues
- Monitor CloudWatch logs for API errors
- Check AWS Bedrock service limits and quotas
- Verify network connectivity to AWS services

### Performance Optimization
- Enable Amplify's built-in CDN for faster global delivery
- Use Next.js Image Optimization for better performance
- Monitor Core Web Vitals in Amplify Analytics

## Scaling Considerations

### Traffic Scaling
- Amplify automatically scales to handle traffic spikes
- No server management required

### API Rate Limits
- Monitor AWS Bedrock usage and quotas
- Implement client-side caching for repeated requests
- Consider implementing request queuing for high-volume usage

### Cost Optimization
- Monitor AWS billing dashboard for Bedrock usage costs
- Nova Lite: ~$0.06 per 1M input tokens, ~$0.24 per 1M output tokens
- Nova Canvas: ~$0.04 per image generated
- Amplify hosting: $0.15 per GB served

## Security Best Practices

1. **Environment Variables**: Never commit AWS credentials to version control
2. **IAM Policies**: Use least-privilege access for Bedrock resources
3. **CORS**: Configure appropriate CORS policies for API endpoints
4. **Rate Limiting**: Implement rate limiting to prevent abuse

## Backup and Recovery

### Code Backup
- Repository is automatically backed up in Git
- Amplify maintains deployment history

### Session Data
- Current implementation uses in-memory storage
- For production, consider migrating to Redis or DynamoDB
- Implement data export functionality if needed

## Multi-Environment Setup

For staging and production environments:

1. **Create Multiple Branches**:
   ```bash
   git checkout -b staging
   git checkout -b production
   ```

2. **Deploy Each Branch**:
   - Connect each branch to separate Amplify apps
   - Use different environment variable sets
   - Test thoroughly in staging before promoting to production

## Support and Maintenance

### Regular Updates
- Monitor AWS service updates for Nova models
- Update dependencies regularly for security patches
- Review and update build configurations as needed

### Google Nanobanana Migration (Future)
When ready to switch to Google Nanobanana:

1. Update environment variables to include Google API credentials
2. Modify the image generation service configuration
3. Test the switch using feature flags
4. Deploy gradually using Amplify's traffic splitting

## Troubleshooting Common Issues

### Issue: Build Fails with Dependency Errors
**Solution**: Clear Amplify build cache and rebuild
```bash
# In Amplify console, trigger a new build with cache cleared
```

### Issue: AWS Bedrock Access Denied
**Solution**: Verify IAM permissions and region settings
- Check BEDROCK_REGION is set to us-east-1
- Verify IAM user has bedrock:InvokeModel permissions

### Issue: Thai Text Not Displaying
**Solution**: Ensure proper font loading and UTF-8 encoding
- Check browser font fallbacks for Thai characters
- Verify server response headers include proper charset

### Issue: Images Not Generating
**Solution**: Check Nova Canvas service limits and error logs
- Monitor Amplify function logs for timeout errors
- Verify image generation parameters are within limits

---

**Deployment Complete!**

Your Formula Platform should now be live on AWS Amplify with full AWS Nova integration and Thai language support.

Access your application at: `https://[your-amplify-domain].amplifyapp.com`

For support, refer to:
- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)