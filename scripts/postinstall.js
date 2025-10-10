#!/usr/bin/env node

/**
 * Post-install script to handle Cypress installation
 * 
 * This script attempts to install Cypress binaries and provides
 * clear feedback about the installation status.
 */

const { execSync } = require('child_process');
const path = require('path');

const storybookDir = path.join(__dirname, '..', 'apps', 'storybook');

console.log('📦 Installing Cypress binaries...');

try {
  execSync('pnpm exec cypress install', {
    cwd: storybookDir,
    stdio: 'inherit'
  });
  console.log('✅ Cypress binaries installed successfully');
} catch (error) {
  console.error('⚠️  Warning: Cypress installation failed');
  console.error('   This may cause test failures when running Cypress tests');
  console.error('   Error details:', error.message);
  console.error('');
  console.error('   To fix this, try running manually:');
  console.error('   cd apps/storybook && pnpm exec cypress install');
  console.error('');
  
  // Exit with 0 to not block npm install in CI environments
  // but make the warning very visible
  process.exit(0);
}

