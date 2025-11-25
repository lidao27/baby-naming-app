// 八字计算工具 - 基于《穷通宝鉴》专业算法
const baziUtils = {
  // 天干地支常量
  TIAN_GAN: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
  DI_ZHI: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],

  // 五行常量
  WU_XING: ['木', '火', '土', '金', '水'],

  // 天干五行对应
  TIAN_GAN_WUXING: {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
    '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
  },

  // 地支五行对应
  DI_ZHI_WUXING: {
    '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
    '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水'
  },

  // 地支藏干（简化版）
  DI_ZHI_CANG_GAN: {
    '子': ['癸'], '丑': ['己', '癸', '辛'], '寅': ['甲', '丙', '戊'],
    '卯': ['乙'], '辰': ['戊', '乙', '癸'], '巳': ['丙', '戊', '庚'],
    '午': ['丁', '己'], '未': ['己', '丁', '乙'], '申': ['庚', '壬', '戊'],
    '酉': ['辛'], '戌': ['戊', '辛', '丁'], '亥': ['壬', '甲']
  },

  // 五行相生关系
  WUXING_SHENG: {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  },

  // 五行相克关系
  WUXING_KE: {
    '木': '土', '土': '水', '水': '火', '火': '金', '金': '木'
  },

  // 季节对应地支
  SEASON_MAP: {
    '寅': '春', '卯': '春', '辰': '春', // 春季
    '巳': '夏', '午': '夏', '未': '夏', // 夏季
    '申': '秋', '酉': '秋', '戌': '秋', // 秋季
    '亥': '冬', '子': '冬', '丑': '冬' // 冬季
  },

  // 《穷通宝鉴》调候用神规则
  QIONG_TONG_RULES: {
    // 甲木日主
    '甲': {
      '春': ['庚', '丙', '丁'], // 春木需金制，火暖
      '夏': ['癸', '壬', '庚'], // 夏木需水润，金生水
      '秋': ['庚', '丁', '丙'], // 秋木需金制，火暖
      '冬': ['丙', '丁', '庚'] // 冬木需火暖，金制
    },
    // 乙木日主
    '乙': {
      '春': ['丙', '癸'], // 春木需火暖，水润
      '夏': ['癸', '丙'], // 夏木需水润，火暖
      '秋': ['丙', '癸'], // 秋木需火暖，水润
      '冬': ['丙'] // 冬木需火暖
    },
    // 丙火日主
    '丙': {
      '春': ['壬', '庚'], // 春火需水制，金生水
      '夏': ['壬', '癸'], // 夏火需水制
      '秋': ['壬', '甲'], // 秋火需水制，木生火
      '冬': ['甲', '壬'] // 冬火需木生，水制
    },
    // 丁火日主
    '丁': {
      '春': ['甲', '庚'], // 春火需木生，金制
      '夏': ['壬', '癸', '庚'], // 夏火需水制，金生水
      '秋': ['甲', '庚'], // 秋火需木生，金制
      '冬': ['甲', '庚'] // 冬火需木生，金制
    },
    // 戊土日主
    '戊': {
      '春': ['丙', '甲'], // 春土需火暖，木疏
      '夏': ['癸', '丙'], // 夏土需水润，火暖
      '秋': ['丙', '癸'], // 秋土需火暖，水润
      '冬': ['丙', '甲'] // 冬土需火暖，木疏
    },
    // 己土日主
    '己': {
      '春': ['丙', '癸'], // 春土需火暖，水润
      '夏': ['癸', '丙'], // 夏土需水润，火暖
      '秋': ['丙', '癸'], // 秋土需火暖，水润
      '冬': ['丙', '甲'] // 冬土需火暖，木疏
    },
    // 庚金日主
    '庚': {
      '春': ['丁', '甲'], // 春金需火炼，木生火
      '夏': ['壬', '癸'], // 夏金需水润
      '秋': ['丁', '甲'], // 秋金需火炼，木生火
      '冬': ['丙', '丁'] // 冬金需火暖
    },
    // 辛金日主
    '辛': {
      '春': ['壬', '己'], // 春金需水润，土生金
      '夏': ['壬', '癸'], // 夏金需水润
      '秋': ['壬', '甲'], // 秋金需水润，木生火
      '冬': ['丙', '壬'] // 冬金需火暖，水润
    },
    // 壬水日主
    '壬': {
      '春': ['庚', '丙'], // 春水需金生，火暖
      '夏': ['辛', '癸'], // 夏水需金生，水助
      '秋': ['戊', '丙'], // 秋水需土制，火暖
      '冬': ['丙', '戊'] // 冬水需火暖，土制
    },
    // 癸水日主
    '癸': {
      '春': ['辛', '丙'], // 春水需金生，火暖
      '夏': ['辛', '庚'], // 夏水需金生
      '秋': ['辛', '甲'], // 秋水需金生，木疏
      '冬': ['丙', '辛'] // 冬水需火暖，金生
    }
  },

  /**
   * 计算真太阳时
   */
  calculateTrueSolarTime(birthDate, birthTime, birthPlace) {
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = birthTime.split(':').map(Number);

    // 简化的时差计算
    let timeDiff = 0;
    if (birthPlace.includes('新疆') || birthPlace.includes('西藏')) {
      timeDiff = -120;
    } else if (birthPlace.includes('黑龙江') || birthPlace.includes('吉林')) {
      timeDiff = 30;
    }

    const totalMinutes = hour * 60 + minute + timeDiff;
    const trueHour = Math.floor(totalMinutes / 60) % 24;
    const trueMinute = totalMinutes % 60;

    return `${trueHour.toString().padStart(2, '0')}:${trueMinute.toString().padStart(2, '0')}`;
  },

  /**
   * 计算年柱
   */
  calculateYearPillar(year) {
    const ganIndex = (year - 4) % 10;
    const zhiIndex = (year - 4) % 12;
    return this.TIAN_GAN[ganIndex] + this.DI_ZHI[zhiIndex];
  },

  /**
   * 计算月柱
   */
  calculateMonthPillar(year, month) {
    const yearGanIndex = (year - 4) % 10;
    const monthGanIndex = (yearGanIndex * 2 + month) % 10;
    const monthZhiIndex = (month + 1) % 12;
    return this.TIAN_GAN[monthGanIndex] + this.DI_ZHI[monthZhiIndex];
  },

  /**
   * 计算日柱
   */
  calculateDayPillar(year, month, day) {
    const baseDate = new Date(1900, 0, 31);
    const targetDate = new Date(year, month - 1, day);
    const diffDays = Math.floor((targetDate - baseDate) / (24 * 60 * 60 * 1000));

    const ganIndex = diffDays % 10;
    const zhiIndex = diffDays % 12;

    return this.TIAN_GAN[ganIndex] + this.DI_ZHI[zhiIndex];
  },

  /**
   * 计算时柱
   */
  calculateHourPillar(hour, dayGan) {
    const shiChen = Math.floor((hour + 1) / 2) % 12;
    const dayGanIndex = this.TIAN_GAN.indexOf(dayGan);
    if (dayGanIndex === -1) {
      return '甲子'; // 默认时柱
    }
    const hourGanIndex = (dayGanIndex * 2 + shiChen) % 10;
    return this.TIAN_GAN[hourGanIndex] + this.DI_ZHI[shiChen];
  },

  /**
   * 排八字
   */
  calculateBaZi(birthDate, birthTime, birthPlace) {
    const trueSolarTime = this.calculateTrueSolarTime(birthDate, birthTime, birthPlace);
    const [trueHour, trueMinute] = trueSolarTime.split(':').map(Number);

    const [year, month, day] = birthDate.split('-').map(Number);

    const yearPillar = this.calculateYearPillar(year);
    const monthPillar = this.calculateMonthPillar(year, month);
    const dayPillar = this.calculateDayPillar(year, month, day);
    const hourPillar = this.calculateHourPillar(trueHour, dayPillar[0]);

    return {
      yearPillar,
      monthPillar,
      dayPillar,
      hourPillar,
      trueSolarTime
    };
  },

  /**
   * 计算八字旺衰（考虑地支藏干）
   */
  calculateBaZiStrength(baZi) {
    const { yearPillar, monthPillar, dayPillar, hourPillar } = baZi;
    const riZhu = dayPillar[0];
    const riZhuWuXing = this.TIAN_GAN_WUXING[riZhu];

    // 统计五行力量（考虑地支藏干）
    const wuXingStrength = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };

    const pillars = [yearPillar, monthPillar, dayPillar, hourPillar];
    pillars.forEach((pillar) => {
      // 天干力量
      const ganWuXing = this.TIAN_GAN_WUXING[pillar[0]];
      wuXingStrength[ganWuXing] += 1;

      // 地支力量（考虑藏干）
      const zhiCangGan = this.DI_ZHI_CANG_GAN[pillar[1]] || [];
      zhiCangGan.forEach((gan) => {
        const cangGanWuXing = this.TIAN_GAN_WUXING[gan];
        wuXingStrength[cangGanWuXing] += 0.5; // 藏干力量较弱
      });
    });

    // 判断日主旺衰
    const riZhuStrength = wuXingStrength[riZhuWuXing];
    const totalStrength = Object.values(wuXingStrength).reduce((a, b) => a + b, 0);

    if (riZhuStrength >= totalStrength * 0.4) {
      return '旺';
    } else if (riZhuStrength >= totalStrength * 0.25) {
      return '中和';
    } else {
      return '弱';
    }
  },

  /**
   * 根据《穷通宝鉴》计算喜用神
   */
  calculateXiYongShen(baZi) {
    const { monthPillar, dayPillar } = baZi;
    const riZhu = dayPillar[0];
    const monthZhi = monthPillar[1];
    const season = this.SEASON_MAP[monthZhi];

    // 获取《穷通宝鉴》调候规则
    const qiongTongRule = this.QIONG_TONG_RULES[riZhu];
    if (!qiongTongRule || !season) {
      return ['金', '水']; // 默认用神
    }

    // 根据季节获取调候用神
    const tiaoHouYongShen = qiongTongRule[season] || [];

    // 将天干转换为五行
    const xiYongShen = [];
    tiaoHouYongShen.forEach((gan) => {
      const wuXing = this.TIAN_GAN_WUXING[gan];
      if (wuXing && !xiYongShen.includes(wuXing)) {
        xiYongShen.push(wuXing);
      }
    });

    // 判断旺衰，补充用神
    const strength = this.calculateBaZiStrength(baZi);
    if (strength === '旺') {
      // 旺则克泄耗
      const keShen = this.WUXING_KE[this.TIAN_GAN_WUXING[riZhu]];
      if (keShen && !xiYongShen.includes(keShen)) {
        xiYongShen.push(keShen);
      }
    } else if (strength === '弱') {
      // 弱则生扶
      const shengShen = this.WUXING_SHENG[this.TIAN_GAN_WUXING[riZhu]];
      if (shengShen && !xiYongShen.includes(shengShen)) {
        xiYongShen.push(shengShen);
      }
      xiYongShen.push(this.TIAN_GAN_WUXING[riZhu]); // 扶
    }

    return [...new Set(xiYongShen)];
  },

  /**
   * 从喜用神中挑选相生的五行 - 核心原则：五行喜用神是首要，不能有相克
   * 如果两个喜用神相克，舍弃掉一个，选择最需要补的那个
   */
  selectShengCombination(xiYongShen) {
    // 如果喜用神只有一个，直接返回
    if (xiYongShen.length === 1) {
      return [xiYongShen[0]];
    }

    // 第一优先级：寻找相生且不相克的组合
    for (let i = 0; i < xiYongShen.length; i++) {
      for (let j = i + 1; j < xiYongShen.length; j++) {
        const wuXing1 = xiYongShen[i];
        const wuXing2 = xiYongShen[j];

        // 检查是否相生
        const isSheng1 = this.WUXING_SHENG[wuXing1] === wuXing2;
        const isSheng2 = this.WUXING_SHENG[wuXing2] === wuXing1;

        // 检查是否相克（绝对避免相克组合）
        const isKe1 = this.WUXING_KE[wuXing1] === wuXing2;
        const isKe2 = this.WUXING_KE[wuXing2] === wuXing1;

        // 优先选择相生且不相克的组合
        if ((isSheng1 || isSheng2) && !isKe1 && !isKe2) {
          return [wuXing1, wuXing2];
        }
      }
    }

    // 第二优先级：寻找不相克的组合（确保不会出现火水、金木等相克组合）
    for (let i = 0; i < xiYongShen.length; i++) {
      for (let j = i + 1; j < xiYongShen.length; j++) {
        const wuXing1 = xiYongShen[i];
        const wuXing2 = xiYongShen[j];

        // 检查是否相克
        const isKe1 = this.WUXING_KE[wuXing1] === wuXing2;
        const isKe2 = this.WUXING_KE[wuXing2] === wuXing1;

        // 选择不相克的组合
        if (!isKe1 && !isKe2) {
          return [wuXing1, wuXing2];
        }
      }
    }

    // 第三优先级：如果所有组合都相克，遵循核心原则：舍弃一个，选择最需要补的那个
    // 根据八字旺衰和调候需求，确定哪个五行是最重要的

    // 如果所有组合都相克，说明喜用神列表中有相克的五行
    // 例如：火和水同时存在，金和木同时存在等

    // 在这种情况下，我们选择第一个喜用神作为最重要的用神
    // 因为根据《穷通宝鉴》算法，第一个喜用神通常是调候用神，是最重要的
    console.warn('警告：喜用神组合存在相克关系，已舍弃相克五行，选择最重要的用神');
    return [xiYongShen[0]];
  }
};

module.exports = baziUtils;