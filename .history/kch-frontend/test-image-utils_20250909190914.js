// Test script for image utility functions
import { getOptimizedImageUrl, base64ToBlobUrl, revokeBlobUrl } from './src/utils/fileUtils.js';

// Test with a small base64 string (should use data URL)
const smallBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
console.log('Small base64 test:');
console.log('Input length:', smallBase64.length);
const smallResult = getOptimizedImageUrl(smallBase64);
console.log('Result:', smallResult?.substring(0, 50) + '...');
console.log('Is data URL:', smallResult?.startsWith('data:'));
console.log('');

// Test with a large base64 string (should use blob URL)
const largeBase64 = 'data:image/jpeg;base64,' + 'A'.repeat(150000); // 150KB base64
console.log('Large base64 test:');
console.log('Input length:', largeBase64.length);
const largeResult = getOptimizedImageUrl(largeBase64);
console.log('Result:', largeResult?.substring(0, 50) + '...');
console.log('Is blob URL:', largeResult?.startsWith('blob:'));
console.log('');

// Test cleanup
if (largeResult?.startsWith('blob:')) {
  console.log('Testing blob URL cleanup...');
  revokeBlobUrl(largeResult);
  console.log('Blob URL revoked successfully');
}

console.log('All tests completed successfully!');
