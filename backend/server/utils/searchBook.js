// utils/searchBook.js
export function searchBook(query, bookData) {
  if (!bookData || !bookData.table_of_contents) return null;

  // Convert Myanmar numbers to English
  const myNumMap = { "၀":"0","၁":"1","၂":"2","၃":"3","၄":"4","၅":"5","၆":"6","၇":"7","၈":"8","၉":"9" };
  const convertedQuery = query.replace(/[၀-၉]/g, d => myNumMap[d]);

  const lowerQuery = convertedQuery.toLowerCase();

  // Try to find a lesson number in the query
  const numberMatch = convertedQuery.match(/\d+/); // extract numbers
  const lessonNumber = numberMatch ? parseInt(numberMatch[0]) : null;

  for (const part of bookData.table_of_contents) {
    for (const section of part.sections) {
      // Check if lesson number matches
      if (lessonNumber && section.lesson_id === lessonNumber) {
        return section;
      }

      // Check if title matches
      const titleMatch = (section.title_en || "").toLowerCase().includes(lowerQuery) ||
                         (section.title_my || "").includes(query);

      if (titleMatch) {
        return section;
      }
    }
  }

  return null; // no match
}
