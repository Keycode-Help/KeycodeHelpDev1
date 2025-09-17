// Test the fixed utility function
import { getOptimizedImageUrl } from './src/utils/fileUtils.js';

// Test with the problematic base64 string that starts with /9j/
const testBase64 = '/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQA...';

console.log('Testing base64 string that starts with /9j/:');
console.log('Input:', testBase64.substring(0, 50) + '...');
console.log('Length:', testBase64.length);

const result = getOptimizedImageUrl(testBase64);
console.log('Result:', result ? result.substring(0, 50) + '...' : 'null');
console.log('Is blob URL:', result ? result.startsWith('blob:') : false);
console.log('Is data URL:', result ? result.startsWith('data:') : false);

// Test with a large base64 string
const largeBase64 = '/9j/' + 'A'.repeat(150000);
console.log('\nTesting large base64 string:');
console.log('Length:', largeBase64.length);
const largeResult = getOptimizedImageUrl(largeBase64);
console.log('Result type:', largeResult ? (largeResult.startsWith('blob:') ? 'blob URL' : 'data URL') : 'null');

console.log('\nTest completed!');
