let cache: Record<string, string> | null = null;

export const loadClassroomMap = async (): Promise<Record<string, string>> => {
  if (cache) return cache;
  try {
    const res = await fetch('/config/classroom-map.json');
    if (!res.ok) return {};
    const data = await res.json();
    // Strip the comment key if present
    const { _comment: _, ...map } = data as Record<string, string>;
    cache = map;
    return cache;
  } catch {
    return {};
  }
};

export const resolveLocation = (code: string, map: Record<string, string>): string =>
  map[code] || code;
