// utils/searchBook.js
export function searchBook(query, bookData) {
  if (!bookData || !bookData.table_of_contents) return null;

  // Convert Myanmar numbers to English
  const myNumMap = { "၀":"0","၁":"1","၂":"2","၃":"3","၄":"4","၅":"5","၆":"6","၇":"7","၈":"8","၉":"9" };
  query = query.replace(/[၀-၉]/g, d => myNumMap[d]);
  query = query.toLowerCase();

  for (const part of bookData.table_of_contents) {
    for (const section of part.sections) {
      const titleMatch = (section.title_en || "").toLowerCase().includes(query) ||
                         (section.title_my || "").includes(query);
      const numberMatch = query.includes(section.lesson_id.toString());

      // If query contains "ဘာတွေပါလဲ" or similar, treat as a full lesson request
      const contentRequest = /ဘာတွေ|အကြောင်းအရာ|contents/.test(query);

      if (titleMatch || numberMatch) {
        return {
          lesson_id: section.lesson_id,
          title_en: section.title_en,
          title_my: section.title_my,
          about: section.about || {},
          subsections: contentRequest ? section.subsections || [] : []
        };
      }
    }
  }

  return null; // no match
}
