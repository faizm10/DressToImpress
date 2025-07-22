# GitHub Workflows Documentation

This document explains the GitHub Actions workflows set up for automated testing, building, and deployment of your Next.js frontend application.

## 📋 Available Workflows

### 1. CI/CD Pipeline (`ci.yml`)

**Purpose**: Main workflow that runs on every push and pull request to `main` and `develop` branches.

**What it does**:
- ✅ Lints code with ESLint
- ✅ Checks TypeScript types
- ✅ Runs Jest tests with coverage
- ✅ Builds the application
- ✅ Runs security audit
- ✅ Uploads build artifacts and coverage reports

**Triggers**:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Only runs when files in `frontend/` directory are changed

### 2. Test Matrix (`test-matrix.yml`)

**Purpose**: Tests the application across different Node.js versions and operating systems.

**What it does**:
- ✅ Runs tests on Node.js 16.x, 18.x, and 20.x
- ✅ Tests on Ubuntu and Windows
- ✅ Uploads coverage reports for each combination

**Matrix Strategy**:
- Node.js versions: 16.x, 18.x, 20.x
- Operating systems: Ubuntu, Windows
- Excludes Node 16.x on Windows (not supported)

### 3. Deploy (`deploy.yml`)

**Purpose**: Deploys the application after successful CI/CD pipeline completion.

**What it does**:
- ✅ Builds the application
- ✅ Provides examples for various deployment platforms
- ✅ Only runs after successful CI/CD pipeline

**Deployment Options** (commented examples):
- Vercel
- Netlify
- AWS S3 + CloudFront

## 🚀 How to Use

### 1. Automatic Triggers

The workflows run automatically when you:
- Push code to `main` or `develop` branches
- Create pull requests to `main` or `develop` branches
- Only when files in the `frontend/` directory are modified

### 2. Manual Triggers

You can also run workflows manually:

1. Go to your GitHub repository
2. Click on the "Actions" tab
3. Select the workflow you want to run
4. Click "Run workflow"
5. Choose the branch and click "Run workflow"

### 3. Viewing Results

- **Workflow Status**: Check the Actions tab in your GitHub repository
- **Test Results**: View detailed test results in the workflow logs
- **Coverage Reports**: Download coverage artifacts from the workflow run
- **Build Artifacts**: Download build files from successful builds

## 🔧 Configuration

### Environment Variables

For deployment workflows, you'll need to set up secrets in your GitHub repository:

1. Go to your repository settings
2. Click on "Secrets and variables" → "Actions"
3. Add the following secrets as needed:

#### For Vercel Deployment:
```
VERCEL_TOKEN=your_vercel_token
ORG_ID=your_org_id
PROJECT_ID=your_project_id
```

#### For Netlify Deployment:
```
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_site_id
```

#### For AWS Deployment:
```
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
CLOUDFRONT_DISTRIBUTION_ID=your_distribution_id
```

### Customizing Workflows

#### Adding New Test Scripts

If you add new test scripts to `package.json`, update the workflows:

```yaml
- name: Run new tests
  run: |
    cd frontend
    npm run your-new-test-script
```

#### Changing Node.js Versions

Update the `node-version` in the workflow files:

```yaml
with:
  node-version: '22.x'  # Change this
```

#### Adding New Deployment Platforms

Copy and modify the deployment examples in `deploy.yml`:

```yaml
- name: Deploy to Your Platform
  uses: your-deployment-action@v1
  with:
    your-config: ${{ secrets.YOUR_SECRET }}
```

## 📊 Monitoring and Alerts

### Workflow Status Badges

Add these badges to your README.md:

```markdown
![CI/CD Pipeline](https://github.com/{username}/{repo}/workflows/CI%2FCD%20Pipeline/badge.svg)
![Test Matrix](https://github.com/{username}/{repo}/workflows/Test%20Matrix/badge.svg)
![Deploy](https://github.com/{username}/{repo}/workflows/Deploy/badge.svg)
```

### Coverage Badges

If you use Codecov, add:

```markdown
![Codecov](https://codecov.io/gh/{username}/{repo}/branch/main/graph/badge.svg)
```

## 🚨 Troubleshooting

### Common Issues

1. **Workflow not triggering**
   - Check if files in `frontend/` directory were changed
   - Verify the branch name matches the workflow triggers

2. **Tests failing**
   - Check the workflow logs for specific error messages
   - Run tests locally with `npm test` to reproduce issues

3. **Build failures**
   - Ensure all dependencies are properly installed
   - Check for TypeScript errors with `npx tsc --noEmit`

4. **Deployment issues**
   - Verify all required secrets are set in GitHub
   - Check deployment platform logs for specific errors

### Debugging Workflows

1. **Enable debug logging**:
   Add this secret to your repository:
   ```
   ACTIONS_STEP_DEBUG=true
   ```

2. **View detailed logs**:
   - Go to the Actions tab
   - Click on a workflow run
   - Click on a job
   - Click on a step to see detailed logs

## 📈 Best Practices

### 1. Workflow Organization

- Keep workflows focused on specific tasks
- Use descriptive names and comments
- Separate concerns (testing, building, deploying)

### 2. Performance

- Use caching for dependencies
- Run jobs in parallel when possible
- Use matrix strategies for comprehensive testing

### 3. Security

- Never commit secrets to the repository
- Use GitHub secrets for sensitive data
- Run security audits regularly

### 4. Monitoring

- Set up notifications for workflow failures
- Monitor coverage trends over time
- Track deployment success rates

## 🔄 Workflow Lifecycle

1. **Push/PR Created** → Triggers workflows
2. **Lint & Test** → Runs ESLint, TypeScript check, and Jest tests
3. **Build** → Creates production build (only if tests pass)
4. **Security Audit** → Checks for vulnerabilities
5. **Deploy** → Deploys to production (only on main branch)

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Jest Testing Framework](https://jestjs.io/)
- [ESLint Configuration](https://eslint.org/)
- [TypeScript Configuration](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

When contributing to this project:

1. Create a feature branch from `develop`
2. Make your changes
3. Add tests for new functionality
4. Ensure all workflows pass
5. Create a pull request to `develop`

The workflows will automatically run and provide feedback on your changes! 