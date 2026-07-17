const oldKey = 'sk_test_51TrD3F8MubGBCKHSwmvveHVQUdvCoYsflcbaePVaQwE24e8GCHvtj5QJWrHwDtiC6rSiBrjrnqV2Dqpq8atC3KVA00kf1ru4N2';
const newKey = 'sk_test_51TrD3F8MubGBCKHSwmvveHVQUdvCoYsf1cbaePVaQwE24e8GCHvtj5QJWrHwDtIc6rSiBrjrnQV2Dqpq8atC3KVA00kf1ru4N2';

console.log('Old length:', oldKey.length);
console.log('New length:', newKey.length);

const maxLen = Math.max(oldKey.length, newKey.length);
for (let i = 0; i < maxLen; i++) {
  if (oldKey[i] !== newKey[i]) {
    console.log(`Difference at index ${i}:`);
    console.log(`  Old: '${oldKey[i]}'`);
    console.log(`  New: '${newKey[i]}'`);
  }
}
