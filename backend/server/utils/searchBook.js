// utils/searchBook.js
export function searchBook(query, bookData) {
  if (!bookData || !bookData.table_of_contents) return null;

  // Convert Myanmar numerals to Arabic numerals
  function myanmarNumberToArabic(str) {
    return str.replace(/[၀-၉]/g, m => String("၀၁၂၃၄၅၆၇၈၉".indexOf(m)));
  }

  const lowerQuery = query.toLowerCase();
  const queryArabic = myanmarNumberToArabic(query);

  // Try to find lesson number
  const numberMatch = queryArabic.match(/\d+/);
  const lessonNumber = numberMatch ? parseInt(numberMatch[0]) : null;

  for (const lesson of bookData.table_of_contents) {
    // 1️⃣ Check lesson ID
    if (lessonNumber && lesson.lesson_id === lessonNumber) return lesson;

    // 2️⃣ Check title
    const titleMatch = (lesson.title_en || "").toLowerCase().includes(lowerQuery) ||
                       (lesson.title_my || "").includes(query);
    if (titleMatch) return lesson;

    // 3️⃣ Check about/description
    const aboutMatch = (lesson.about?.description_en || "").toLowerCase().includes(lowerQuery) ||
                       (lesson.about?.description_my || "").includes(query);
    if (aboutMatch) return lesson;

    // 4️⃣ Optional: subsections
    if (lesson.subsections) {
      for (const sub of lesson.subsections) {
        const subMatch = (sub.title_en || "").toLowerCase().includes(lowerQuery) ||
                         (sub.title_my || "").includes(query);
        if (subMatch) return sub;
      }
    }
  }

  return null;
}
