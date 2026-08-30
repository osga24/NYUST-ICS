let cache: Record<string, string> | null = null;

export const loadClassroomMap = async (): Promise<Record<string, string>> => {
  if (cache) return cache;
  try {
    const res = await fetch('/config/classroom-map.json');
    if (!res.ok) return {};
    const data = await res.json();
    const { _comment: _, ...map } = data as Record<string, string>;
    cache = map;
    return cache;
  } catch {
    return {};
  }
};

/**
 * 將教室代碼解析為實際地點字串。
 * 先做完整比對（如 MA101），找不到再用英文字母前綴比對（如 MA），
 * 並自動附上房號數字（如「管理一館 101」）。
 */
export const resolveLocation = (code: string, map: Record<string, string>): string => {
  if (!code) return '';

  // 完整代碼直接比對
  if (map[code]) return map[code];

  // 前綴（字母部分）比對，數字部分當房號
  const prefix = code.match(/^[A-Za-z]+/)?.[0] ?? '';
  const room = code.slice(prefix.length);
  if (prefix && map[prefix]) {
    return room ? `${map[prefix]} ${room}` : map[prefix];
  }

  return code;
};
