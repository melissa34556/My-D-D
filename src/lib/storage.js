const STORAGE_KEY = "my-dd-library-v2";
export function loadCharacterLibrary() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (Array.isArray(value)) return value;
  } catch {}
  return null;
}
export function saveCharacterLibrary(characters) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error?.name || "storage-error" };
  }
}
