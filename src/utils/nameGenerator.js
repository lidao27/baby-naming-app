import baziUtils from './bazi';

// 名字数据库 - 根据五行分类的常用汉字
const nameDatabase = {
  '木': [
    { firstName: '林', meaning: '品德高尚，如林般稳重', wuxingChars: ['木'] },
    { firstName: '森', meaning: '才华出众，如森林般茂盛', wuxingChars: ['木'] },
    { firstName: '杰', meaning: '杰出人才，品德优良', wuxingChars: ['木'] },
    { firstName: '梅', meaning: '美丽如梅，品德高尚', wuxingChars: ['木'] },
    { firstName: '桐', meaning: '稳重可靠，如桐树般坚实', wuxingChars: ['木'] },
    { firstName: '枫', meaning: '才华横溢，如枫叶般美丽', wuxingChars: ['木'] },
    { firstName: '柏', meaning: '坚毅如柏，品德高尚', wuxingChars: ['木'] },
    { firstName: '梓', meaning: '才华出众，稳重可靠', wuxingChars: ['木'] }
  ],
  '火': [
    { firstName: '炎', meaning: '热情如火，才华出众', wuxingChars: ['火'] },
    { firstName: '灿', meaning: '灿烂辉煌，品德优良', wuxingChars: ['火'] },
    { firstName: '煜', meaning: '光明照耀，才华横溢', wuxingChars: ['火'] },
    { firstName: '炜', meaning: '光辉灿烂，品德高尚', wuxingChars: ['火'] },
    { firstName: '炫', meaning: '才华出众，光彩夺目', wuxingChars: ['火'] },
    { firstName: '炅', meaning: '光明磊落，稳重可靠', wuxingChars: ['火'] },
    { firstName: '焱', meaning: '热情洋溢，品德优良', wuxingChars: ['火'] },
    { firstName: '焰', meaning: '才华横溢，热情如火', wuxingChars: ['火'] }
  ],
  '土': [
    { firstName: '坤', meaning: '稳重如坤，品德高尚', wuxingChars: ['土'] },
    { firstName: '培', meaning: '培养成才，稳重可靠', wuxingChars: ['土'] },
    { firstName: '基', meaning: '基础扎实，品德优良', wuxingChars: ['土'] },
    { firstName: '坦', meaning: '坦诚正直，才华出众', wuxingChars: ['土'] },
    { firstName: '城', meaning: '稳重如城，品德高尚', wuxingChars: ['土'] },
    { firstName: '坚', meaning: '坚毅不拔，才华横溢', wuxingChars: ['土'] },
    { firstName: '培', meaning: '培养有方，稳重可靠', wuxingChars: ['土'] },
    { firstName: '垚', meaning: '品德优良，才华出众', wuxingChars: ['土'] }
  ],
  '金': [
    { firstName: '鑫', meaning: '财富丰盈，品德高尚', wuxingChars: ['金'] },
    { firstName: '锋', meaning: '锋芒毕露，才华出众', wuxingChars: ['金'] },
    { firstName: '铭', meaning: '铭记于心，稳重可靠', wuxingChars: ['金'] },
    { firstName: '锐', meaning: '锐意进取，品德优良', wuxingChars: ['金'] },
    { firstName: '钢', meaning: '坚毅如钢，才华横溢', wuxingChars: ['金'] },
    { firstName: '锦', meaning: '锦绣前程，品德高尚', wuxingChars: ['金'] },
    { firstName: '银', meaning: '才华出众，稳重可靠', wuxingChars: ['金'] },
    { firstName: '钰', meaning: '品德优良，才华出众', wuxingChars: ['金'] }
  ],
  '水': [
    { firstName: '淼', meaning: '智慧如水，品德高尚', wuxingChars: ['水'] },
    { firstName: '浩', meaning: '浩然正气，才华出众', wuxingChars: ['水'] },
    { firstName: '清', meaning: '清正廉洁，稳重可靠', wuxingChars: ['水'] },
    { firstName: '润', meaning: '润物无声，品德优良', wuxingChars: ['水'] },
    { firstName: '泽', meaning: '泽被天下，才华横溢', wuxingChars: ['水'] },
    { firstName: '涛', meaning: '才华出众，如涛般澎湃', wuxingChars: ['水'] },
    { firstName: '涵', meaning: '涵养深厚，品德高尚', wuxingChars: ['水'] },
    { firstName: '沛', meaning: '才华横溢，稳重可靠', wuxingChars: ['水'] }
  ]
};

// 名字多样性评分函数
const getNameScore = (char1, char2) => {
  let score = 0;

  // 1. 音律美加分（主要考虑因素）
  const initial1 = char1.firstName.charAt(0);
  const initial2 = char2.firstName.charAt(0);
  if (initial1 !== initial2) {
    score += 8;
  }

  // 韵母不同加分
  if (char1.firstName.length !== char2.firstName.length ||
      char1.firstName.charAt(char1.firstName.length - 1) !== char2.firstName.charAt(char2.firstName.length - 1)) {
    score += 8;
  }

  // 2. 语义配合加分
  const meaning1 = char1.meaning;
  const meaning2 = char2.meaning;

  // 相同主题加分
  const themes = ['品德', '才华', '健康', '志向', '稳重', '美丽', '智慧', '勤奋'];
  themes.forEach((theme) => {
    if (meaning1.includes(theme) && meaning2.includes(theme)) {
      score += 4;
    }
  });

  // 互补意义加分
  const complementaryPairs = [
    ['志向高远', '脚踏实地'], ['才华出众', '品德高尚'], ['思维敏捷', '稳重可靠']
  ];

  complementaryPairs.forEach((pair) => {
    if ((meaning1.includes(pair[0]) && meaning2.includes(pair[1])) ||
        (meaning1.includes(pair[1]) && meaning2.includes(pair[0]))) {
      score += 4;
    }
  });

  // 3. 随机性加分
  score += Math.random() * 10;

  // 将分数映射到50-99范围
  const maxPossibleScore = 40;
  const normalizedScore = 50 + score / maxPossibleScore * 49;

  return Math.min(99, Math.max(50, Math.round(normalizedScore)));
};

// 智能组合双字名函数
const generateDoubleNameFromSingle = (singleNameDatabase, xysList) => {
  // 获取喜用神对应的五行组合
  const allowedCombinations = getAllowedWuxingCombinations(xysList);
  const doubleCombinations = allowedCombinations.filter((comb) => comb.length === 2);

  if (doubleCombinations.length === 0) {
    return [];
  }

  // 改进的随机函数
  const betterRandomSort = (array) => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };

  const doubleNames = [];
  const usedCombinations = new Set();

  // 使用改进的随机算法打乱双字组合的顺序
  const shuffledCombinations = betterRandomSort([...doubleCombinations]);

  // 遍历所有双字组合
  for (const combination of shuffledCombinations) {
    const [wuxing1, wuxing2] = combination;
    const chars1 = singleNameDatabase[wuxing1] || [];
    const chars2 = singleNameDatabase[wuxing2] || [];

    if (chars1.length === 0 || chars2.length === 0) {
      continue;
    }

    const combinationKey = `${wuxing1}-${wuxing2}`;
    if (!usedCombinations.has(combinationKey)) {
      usedCombinations.add(combinationKey);

      const shuffledChars1 = betterRandomSort([...chars1]);
      const shuffledChars2 = betterRandomSort([...chars2]);

      const possibleNames = [];
      const maxCombinations = Math.min(50, shuffledChars1.length * shuffledChars2.length);

      for (let i = 0; i < maxCombinations; i++) {
        const randomIndex1 = Math.floor(Math.random() * shuffledChars1.length);
        const randomIndex2 = Math.floor(Math.random() * shuffledChars2.length);

        const char1 = chars1[randomIndex1];
        const char2 = chars2[randomIndex2];

        if (char1.firstName !== char2.firstName) {
          const nameScore = getNameScore(char1, char2);
          const combinationKey = `${char1.firstName}-${char2.firstName}`;
          
          if (!possibleNames.some((n) => n.char1.firstName === char1.firstName && n.char2.firstName === char2.firstName)) {
            possibleNames.push({
              char1: char1,
              char2: char2,
              score: nameScore
            });
          }
        }
      }

      const sortedNames = possibleNames.sort((a, b) => b.score - a.score);
      const topNames = sortedNames.slice(0, Math.min(sortedNames.length, 15));
      const shuffledTopNames = betterRandomSort([...topNames]);

      for (let i = 0; i < Math.min(shuffledTopNames.length, 2); i++) {
        if (doubleNames.length >= 3) break;

        const { char1, char2 } = shuffledTopNames[i];
        const combinedName = char1.firstName + char2.firstName;

        let combinedMeaning;
        if (char1.meaning.includes('品德') && char2.meaning.includes('品德')) {
          const virtueVariations = ['品德优良', '品格高尚', '德性美好', '品行端正', '道德高尚'];
          const randomVirtue = virtueVariations[Math.floor(Math.random() * virtueVariations.length)];
          const char2Meaning = char2.meaning.replace(/^品德(高尚|优良)/, '').trim();
          combinedMeaning = `${randomVirtue}，${char2Meaning || char2.meaning}`;
        } else if (char1.meaning.includes('才华') && char2.meaning.includes('才华')) {
          combinedMeaning = `才华${char1.meaning.includes('出众') ? '出众' : '横溢'}，${char2.meaning}`;
        } else {
          combinedMeaning = `${char1.meaning}，${char2.meaning}`;
        }

        const combinedWuxing = [...char1.wuxingChars, ...char2.wuxingChars];

        doubleNames.push({
          firstName: combinedName,
          meaning: combinedMeaning,
          wuxingChars: combinedWuxing
        });
      }
    }
  }

  return doubleNames;
};

// 获取喜用神允许的五行组合
const getAllowedWuxingCombinations = (xysList) => {
  const xys = xysList.map((item) => item.wuxing);
  const combinations = [];

  for (let i = 0; i < xys.length; i++) {
    combinations.push([xys[i]]);
    for (let j = 0; j < xys.length; j++) {
      combinations.push([xys[i], xys[j]]);
    }
  }

  return combinations;
};

// 生成名字列表
const generateNameList = (lastName, xysList) => {
  // 精准防护：防止生成包含敏感词汇的名字组合
  const preventNames = ['近平', '习近', '习近平'];
  const isSensitiveCombination = (name) => {
    const fullName = lastName + name;
    return preventNames.some(sensitiveName => fullName.includes(sensitiveName));
  };

  const TARGET_NAME_COUNT = 5;
  const names = [];

  // 生成单字名
  xysList.forEach((xysItem) => {
    const wuxing = xysItem.wuxing;
    const chars = nameDatabase[wuxing] || [];
    
    if (chars.length > 0) {
      const randomChar = chars[Math.floor(Math.random() * chars.length)];
      if (!isSensitiveCombination(randomChar.firstName)) {
        names.push({
          firstName: randomChar.firstName,
          meaning: randomChar.meaning,
          wuxingChars: randomChar.wuxingChars
        });
      }
    }
  });

  // 生成双字名
  const doubleNames = generateDoubleNameFromSingle(nameDatabase, xysList);
  doubleNames.forEach((name) => {
    if (!isSensitiveCombination(name.firstName) && names.length < TARGET_NAME_COUNT) {
      names.push(name);
    }
  });

  // 如果名字不足，补充随机名字
  while (names.length < TARGET_NAME_COUNT) {
    const allWuxing = Object.keys(nameDatabase);
    const randomWuxing = allWuxing[Math.floor(Math.random() * allWuxing.length)];
    const chars = nameDatabase[randomWuxing] || [];
    
    if (chars.length > 0) {
      const randomChar = chars[Math.floor(Math.random() * chars.length)];
      if (!isSensitiveCombination(randomChar.firstName)) {
        names.push({
          firstName: randomChar.firstName,
          meaning: randomChar.meaning,
          wuxingChars: randomChar.wuxingChars
        });
      }
    }
  }

  return names.slice(0, TARGET_NAME_COUNT);
};

export default {
  generateNameList,
  nameDatabase
};