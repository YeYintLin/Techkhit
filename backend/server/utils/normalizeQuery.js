// utils/normalizeQuery.js
import keywordMap from "./keywordMap.js";

// Convert Myanmar numbers to English
function myanmarToEnglishNumbers(text) {
  const map = { "၀":"0","၁":"1","၂":"2","၃":"3","၄":"4","၅":"5","၆":"6","၇":"7","၈":"8","၉":"9" };
  return text.replace(/[၀-၉]/g, d => map[d]);
}

// Normalize Myanmar query to English keywords
export function normalizeQuery(text) {
  let result = myanmarToEnglishNumbers(text.toLowerCase());

  for (const myWord in keywordMap) {
    result = result.replaceAll(myWord, keywordMap[myWord]);
  }

  return result;
}
