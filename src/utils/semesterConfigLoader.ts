// src/utils/semesterConfigLoader.ts
import { SemesterConfig, SemesterConfigJSON } from './types';
import { defaultSemesterConfig } from './courseProcessor';

export const convertJsonToSemesterConfig = (json: SemesterConfigJSON): SemesterConfig => ({
  spring: {
    start: json.spring?.start ? new Date(`${json.spring.start}T00:00:00+08:00`) : null,
    end: json.spring?.end ? new Date(`${json.spring.end}T23:59:59+08:00`) : null,
  },
  fall: {
    start: json.fall?.start ? new Date(`${json.fall.start}T00:00:00+08:00`) : null,
    end: json.fall?.end ? new Date(`${json.fall.end}T23:59:59+08:00`) : null,
  },
  schoolHolidays: json.schoolHolidays?.map(h => h.date) ?? [],
});

export const loadSemesterConfig = async (): Promise<{
  semesterConfig: SemesterConfig;
  json: SemesterConfigJSON | null;
}> => {
  try {
    const response = await fetch('/config/semester-config.json');
    if (!response.ok) {
      return { semesterConfig: defaultSemesterConfig, json: null };
    }

    const json: SemesterConfigJSON = await response.json();
    return { semesterConfig: convertJsonToSemesterConfig(json), json };
  } catch {
    return { semesterConfig: defaultSemesterConfig, json: null };
  }
};
