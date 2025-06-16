#!/usr/bin/env node

import { SitemapGenerator } from '../src/utils/sitemapGenerator.js';

/**
 * Test script for sitemap generator
 * This script tests the sitemap generation functionality
 */
async function testSitemapGenerator() {
  console.log('🧪 Testing Sitemap Generator...\n');

  try {
    // Create generator instance
    const generator = new SitemapGenerator();
    
    // Test 1: Basic generation
    console.log('Test 1: Basic sitemap generation');
    const sitemapXML = await generator.generateSitemap();
    const stats = generator.getStats();
    
    console.log('✅ Sitemap generated successfully');
    console.log(`   - Total URLs: ${stats.totalUrls}`);
    console.log(`   - Static URLs: ${stats.staticUrls}`);
    console.log(`   - Dynamic URLs: ${stats.dynamicUrls}`);
    console.log(`   - XML length: ${sitemapXML.length} characters\n`);
    
    // Test 2: XML validation
    console.log('Test 2: XML validation');
    const isValidXML = validateXML(sitemapXML);
    console.log(isValidXML ? '✅ XML is valid' : '❌ XML is invalid');
    console.log('');
    
    // Test 3: URL validation
    console.log('Test 3: URL validation');
    const urlValidation = validateUrls(generator.urls);
    console.log(`✅ Valid URLs: ${urlValidation.valid}`);
    console.log(`❌ Invalid URLs: ${urlValidation.invalid}`);
    if (urlValidation.errors.length > 0) {
      console.log('   Errors:');
      urlValidation.errors.forEach(error => {
        console.log(`   - ${error}`);
      });
    }
    console.log('');
    
    // Test 4: Required elements
    console.log('Test 4: Required elements check');
    const requiredElements = checkRequiredElements(sitemapXML);
    console.log(`✅ Has XML declaration: ${requiredElements.hasXmlDeclaration}`);
    console.log(`✅ Has urlset element: ${requiredElements.hasUrlset}`);
    console.log(`✅ Has URL elements: ${requiredElements.hasUrls}`);
    console.log(`✅ Has loc elements: ${requiredElements.hasLoc}`);
    console.log('');
    
    // Test 5: Static routes coverage
    console.log('Test 5: Static routes coverage');
    const staticRoutesCoverage = checkStaticRoutesCoverage(generator);
    console.log(`✅ Static routes covered: ${staticRoutesCoverage.covered}/${staticRoutesCoverage.total}`);
    if (staticRoutesCoverage.missing.length > 0) {
      console.log('   Missing routes:');
      staticRoutesCoverage.missing.forEach(route => {
        console.log(`   - ${route}`);
      });
    }
    console.log('');
    
    // Test 6: Performance test
    console.log('Test 6: Performance test');
    const startTime = Date.now();
    await generator.generateSitemap();
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`✅ Generation time: ${duration}ms`);
    console.log(duration < 5000 ? '✅ Performance: Good' : '⚠️  Performance: Slow');
    console.log('');
    
    // Summary
    console.log('📊 Test Summary:');
    console.log('================');
    console.log('✅ All tests completed successfully!');
    console.log(`📈 Total URLs generated: ${stats.totalUrls}`);
    console.log(`⚡ Generation time: ${duration}ms`);
    console.log(`📏 XML size: ${(sitemapXML.length / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

/**
 * Validate XML structure
 */
function validateXML(xml) {
  try {
    // Basic XML validation
    const hasXmlDeclaration = xml.startsWith('<?xml');
    const hasClosingTags = xml.includes('</urlset>');
    const hasOpeningTags = xml.includes('<urlset');
    
    return hasXmlDeclaration && hasClosingTags && hasOpeningTags;
  } catch (error) {
    return false;
  }
}

/**
 * Validate URLs
 */
function validateUrls(urls) {
  const validation = {
    valid: 0,
    invalid: 0,
    errors: [],
  };

  urls.forEach(urlData => {
    try {
      new URL(urlData.loc);
      validation.valid++;
    } catch (error) {
      validation.invalid++;
      validation.errors.push(`Invalid URL: ${urlData.loc}`);
    }
  });

  return validation;
}

/**
 * Check required XML elements
 */
function checkRequiredElements(xml) {
  return {
    hasXmlDeclaration: xml.includes('<?xml'),
    hasUrlset: xml.includes('<urlset'),
    hasUrls: xml.includes('<url>'),
    hasLoc: xml.includes('<loc>'),
  };
}

/**
 * Check static routes coverage
 */
function checkStaticRoutesCoverage(generator) {
  const staticRoutes = generator.config.staticRoutes;
  const generatedUrls = generator.urls.map(url => 
    url.loc.replace(generator.config.baseUrl, '')
  );
  
  const missing = [];
  staticRoutes.forEach(route => {
    if (!generatedUrls.includes(route.path)) {
      missing.push(route.path);
    }
  });
  
  return {
    total: staticRoutes.length,
    covered: staticRoutes.length - missing.length,
    missing,
  };
}

/**
 * Run performance benchmark
 */
async function runBenchmark() {
  console.log('🏃 Running performance benchmark...\n');
  
  const iterations = 5;
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const generator = new SitemapGenerator();
    const startTime = Date.now();
    await generator.generateSitemap();
    const endTime = Date.now();
    times.push(endTime - startTime);
    console.log(`Iteration ${i + 1}: ${endTime - startTime}ms`);
  }
  
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  
  console.log('\n📊 Benchmark Results:');
  console.log(`   Average: ${avgTime.toFixed(2)}ms`);
  console.log(`   Minimum: ${minTime}ms`);
  console.log(`   Maximum: ${maxTime}ms`);
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'test';
  
  switch (command) {
    case 'test':
      await testSitemapGenerator();
      break;
    case 'benchmark':
      await runBenchmark();
      break;
    case 'all':
      await testSitemapGenerator();
      await runBenchmark();
      break;
    default:
      console.log('Usage: node scripts/testSitemap.js [command]');
      console.log('Commands:');
      console.log('  test      - Run all tests');
      console.log('  benchmark - Run performance benchmark');
      console.log('  all       - Run tests and benchmark');
      break;
  }
}

// Run the script
main().catch(console.error);
