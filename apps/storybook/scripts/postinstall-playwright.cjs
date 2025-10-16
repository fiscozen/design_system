#!/usr/bin/env node

/**
 * Post-install script to handle Playwright installation
 * 
 * This script attempts to install Playwright Chromium browser and provides
 * clear feedback about the installation status.
 */

const { execSync } = require('child_process');
const path = require('path');

const storybookDir = path.join(__dirname, '..');

console.log('📦 Installing Playwright Chromium browser...');

try {
  execSync('pnpm exec playwright install chromium --with-deps', {
    cwd: storybookDir,
    stdio: 'inherit'
  });
  console.log('✅ Playwright Chromium installed successfully');
} catch (error) {
  console.error('⚠️  Warning: Playwright installation failed');
  console.error('   This may cause test failures when running Storybook tests');
  console.error('   Error details:', error.message);
  console.error('');
  console.error('   To fix this, try running manually:');
  console.error('   cd apps/storybook && pnpm exec playwright install chromium --with-deps');
  console.error('');
  
  // Exit with 0 to not block npm install in CI environments
  // but make the warning very visible
  process.exit(0);
}

