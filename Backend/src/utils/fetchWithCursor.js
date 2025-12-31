export async function fetchWithCursor(cursor) {
  const result = [];
  for await (const doc of cursor) {
    result.push(doc);
  }
  return result;
}
