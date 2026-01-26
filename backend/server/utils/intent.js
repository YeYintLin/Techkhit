export function detectIntent(query) {
  if (query.includes("explain") || query.includes("what")) return "EXPLAIN";
  if (query.includes("where") || query.includes("page") || query.includes("find")) return "LOCATE";
  return "LIST";
}
