// src/utils/semesterConfigLoader.ts
import { SemesterConfig } from './types';
import { defaultSemesterConfig } from './courseProcessor';

/**
 * 從簡化的JSON配置加載學期配置
 */
export const loadSemesterConfig = async (): Promise<SemesterConfig> => {
  try {
    // 加載配置文件
    const response = await fetch('/config/semester-config.json');
    if (!response.ok) {
      console.error('無法加載學期配置文件，使用默認配置');
      return defaultSemesterConfig;
    }

    const config = await response.json();
    console.log('配置文件載入成功:', config);

    // 提取學期時間
    const semesterConfig: SemesterConfig = {
      spring: {
        start: config.spring?.start ? new Date(`${config.spring.start}T00:00:00+08:00`) : null,
        end: config.spring?.end ? new Date(`${config.spring.end}T23:59:59+08:00`) : null
      },
      fall: {
        start: null,
        end: null
      }
    };

    console.log('學期配置已載入:', {
      spring: {
        start: semesterConfig.spring.start?.toISOString(),
        end: semesterConfig.spring.end?.toISOString()
      }
    });

    return semesterConfig;
  } catch (error) {
    console.error('加載學期配置時出錯:', error);
    return defaultSemesterConfig;
  }
};
