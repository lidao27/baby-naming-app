import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import baziUtils from '../utils/bazi';
import nameGenerator from '../utils/nameGenerator';

const ResultScreen = ({ route, navigation }) => {
  const { lastName, birthDate, birthTime, gender, birthPlace } = route.params;
  
  const [xysList, setXysList] = useState([]);
  const [nameList, setNameList] = useState([]);
  const [baZiInfo, setBaZiInfo] = useState({});
  const [trueSolarTime, setTrueSolarTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // 五行对应的颜色类名
  const xysClassMap = {
    '木': styles.mu,
    '火': styles.huo,
    '土': styles.tu,
    '金': styles.jin,
    '水': styles.shui
  };

  // 计算喜用神和推荐姓名
  const calculateXYSAndNames = () => {
    setLoading(true);
    
    // 模拟异步计算过程
    setTimeout(() => {
      try {
        if (!birthDate || !birthTime || !birthPlace) {
          throw new Error('缺少必要的出生信息');
        }

        // 1. 计算真太阳时
        // 2. 排出八字
        const baZiInfo = baziUtils.calculateBaZi(birthDate, birthTime, birthPlace);

        // 3. 根据《穷通宝鉴》算法算出喜用神
        const xiYongShenList = baziUtils.calculateXiYongShen(baZiInfo);

        // 4. 从喜用神里挑出两个相生的五行，如果没有相生的五行，就用最重要的用神
        const selectedWuXing = baziUtils.selectShengCombination(xiYongShenList);

        // 创建喜用神列表，每个元素包含五行和对应的颜色类名
        const xysList = selectedWuXing.map((wuxing) => ({
          wuxing: wuxing,
          class: xysClassMap[wuxing]
        }));

        // 生成推荐姓名列表
        const nameList = nameGenerator.generateNameList(lastName, xysList);

        // 更新页面数据
        setXysList(xysList);
        setNameList(nameList);
        setBaZiInfo(baZiInfo);
        setTrueSolarTime(baZiInfo.trueSolarTime);

      } catch (error) {
        console.error('喜用神计算错误', error);
        // 出错时使用默认值
        setXysList([{ wuxing: '木', class: styles.mu }]);
        setNameList(nameGenerator.generateNameList(lastName, [{ wuxing: '木', class: styles.mu }]));
      }

      setLoading(false);
    }, 2000);
  };

  // 执行重试逻辑
  const executeRetry = () => {
    try {
      if (!xysList || xysList.length === 0) {
        throw new Error('没有可用的喜用神信息');
      }

      // 确保xysList结构正确，提取五行属性
      const wuxingList = xysList.map((item) => item.wuxing || item);

      // 使用第一个喜用神生成新的名字列表
      const newNameList = nameGenerator.generateNameList(lastName, xysList);

      // 更新页面数据
      setNameList(newNameList);

    } catch (error) {
      console.error('生成新名字错误', error);
      // 出错时使用默认值
      setNameList(nameGenerator.generateNameList(lastName, [{ wuxing: '木' }]));
    }
  };

  // 重新测算按钮点击事件
  const onRetry = () => {
    const newRetryCount = retryCount + 1;
    setRetryCount(newRetryCount);

    // 每2次点击显示一次提示
    if (newRetryCount % 2 === 0) {
      Alert.alert(
        '生成新名字',
        '正在为您生成新的名字组合...',
        [
          {
            text: '确定',
            onPress: () => {
              executeRetry();
            }
          }
        ]
      );
    } else {
      // 直接执行重试逻辑
      executeRetry();
    }
  };

  useEffect(() => {
    calculateXYSAndNames();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>正在计算中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* 八字信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>八字信息</Text>
          <View style={styles.baziInfo}>
            <Text style={styles.baziText}>年柱: {baZiInfo.yearPillar}</Text>
            <Text style={styles.baziText}>月柱: {baZiInfo.monthPillar}</Text>
            <Text style={styles.baziText}>日柱: {baZiInfo.dayPillar}</Text>
            <Text style={styles.baziText}>时柱: {baZiInfo.hourPillar}</Text>
            <Text style={styles.baziText}>真太阳时: {trueSolarTime}</Text>
          </View>
        </View>

        {/* 喜用神 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>喜用神</Text>
          <View style={styles.xysContainer}>
            {xysList.map((item, index) => (
              <View key={index} style={[styles.xysItem, item.class]}>
                <Text style={styles.xysText}>{item.wuxing}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.xysDescription}>
            根据八字分析，建议使用以上五行属性的汉字为宝宝起名
          </Text>
        </View>

        {/* 推荐姓名 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>推荐姓名</Text>
          {nameList.map((name, index) => (
            <View key={index} style={styles.nameCard}>
              <Text style={styles.fullName}>
                {lastName}
                <Text style={styles.firstName}>{name.firstName}</Text>
              </Text>
              <Text style={styles.meaning}>{name.meaning}</Text>
              <View style={styles.wuxingContainer}>
                {name.wuxingChars && name.wuxingChars.map((wuxing, idx) => (
                  <View key={idx} style={[styles.wuxingTag, xysClassMap[wuxing]]}>
                    <Text style={styles.wuxingText}>{wuxing}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* 操作按钮 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>再来五个</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>重新输入</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  baziInfo: {
    gap: 8,
  },
  baziText: {
    fontSize: 16,
    color: '#666',
  },
  xysContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  xysItem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  xysText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  mu: {
    backgroundColor: '#4CAF50', // 绿色
  },
  huo: {
    backgroundColor: '#F44336', // 红色
  },
  tu: {
    backgroundColor: '#795548', // 棕色
  },
  jin: {
    backgroundColor: '#FFC107', // 黄色
  },
  shui: {
    backgroundColor: '#2196F3', // 蓝色
  },
  xysDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  nameCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  fullName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  firstName: {
    color: '#4CAF50',
  },
  meaning: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  wuxingContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  wuxingTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  wuxingText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 12,
    marginTop: 20,
  },
  retryButton: {
    padding: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    padding: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ResultScreen;