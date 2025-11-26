import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const HomeScreen = ({ navigation }) => {
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [gender, setGender] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // 省份数据
  const provinces = [
    '北京市', '天津市', '河北省', '山西省', '内蒙古自治区',
    '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省',
    '浙江省', '安徽省', '福建省', '江西省', '山东省',
    '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区',
    '海南省', '重庆市', '四川省', '贵州省', '云南省',
    '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区',
    '新疆维吾尔自治区', '台湾省', '香港特别行政区', '澳门特别行政区'
  ];

  // 处理姓氏输入
  const handleLastNameChange = (text) => {
    // 限制姓氏长度为1-2个字符
    if (text.length > 2) {
      Alert.alert('提示', '姓氏最多2个字');
      return;
    }
    
    // 检查是否为纯汉字
    const chineseCharRegex = /^[\u4e00-\u9fa5]*$/;
    if (!chineseCharRegex.test(text)) {
      Alert.alert('提示', '请输入汉字姓氏');
      return;
    }
    
    setLastName(text);
  };

  // 处理日期选择
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(moment(selectedDate).format('YYYY-MM-DD'));
    }
  };

  // 处理时间选择
  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setBirthTime(moment(selectedTime).format('HH:mm'));
    }
  };

  // 获取当前日期
  const getCurrentDate = () => {
    return birthDate ? new Date(birthDate) : new Date();
  };

  // 获取当前时间
  const getCurrentTime = () => {
    return birthTime ? new Date(`1970-01-01T${birthTime}`) : new Date();
  };

  // 验证表单
  const validateForm = () => {
    if (!lastName) {
      Alert.alert('提示', '请输入姓氏');
      return false;
    }

    // 姓氏安全验证
    if (lastName.length > 2) {
      Alert.alert('提示', '请输入1-2个字的姓氏');
      return false;
    }

    // 防止恶意输入领导人完整姓名作为姓氏
    const leaderFullNames = ['习近平', '毛泽东', '邓小平', '江泽民', '胡锦涛', '温家宝'];
    if (leaderFullNames.includes(lastName)) {
      Alert.alert('提示', '请输入正确的姓氏');
      return false;
    }

    // 检查是否为纯汉字
    const chineseCharRegex = /^[\u4e00-\u9fa5]+$/;
    if (!chineseCharRegex.test(lastName)) {
      Alert.alert('提示', '请输入纯汉字姓氏');
      return false;
    }

    if (!birthDate) {
      Alert.alert('提示', '请选择出生日期');
      return false;
    }

    if (!birthTime) {
      Alert.alert('提示', '请选择出生时间');
      return false;
    }

    if (!gender) {
      Alert.alert('提示', '请选择性别');
      return false;
    }

    if (!birthPlace) {
      Alert.alert('提示', '请选择出生地');
      return false;
    }

    return true;
  };

  // 处理提交
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // 跳转到结果页面
    navigation.navigate('Result', {
      lastName,
      birthDate,
      birthTime,
      gender,
      birthPlace
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        {/* 姓氏输入 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>姓氏</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入宝宝的姓氏"
            value={lastName}
            onChangeText={handleLastNameChange}
            maxLength={2}
          />
        </View>

        {/* 出生日期选择 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>出生日期</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => {
              if (Platform.OS === 'ios') {
                setShowDatePicker(true);
              } else {
                // Android使用文本输入方式
                Alert.alert(
                  '输入出生日期',
                  '请输入格式：YYYY-MM-DD',
                  [
                    {
                      text: '取消',
                      style: 'cancel',
                    },
                    {
                      text: '确定',
                      onPress: () => {
                        // 这里需要实现文本输入逻辑
                        // 暂时先显示日期选择器
                        setShowDatePicker(true);
                      },
                    },
                  ]
                );
              }
            }}
          >
            <Text style={styles.pickerText}>
              {birthDate || '请选择出生日期'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={getCurrentDate()}
              mode="date"
              display="spinner"
              onChange={onDateChange}
            />
          )}
        </View>

        {/* 出生时间选择 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>出生时间</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => {
              if (Platform.OS === 'ios') {
                setShowTimePicker(true);
              } else {
                // Android使用文本输入方式
                Alert.alert(
                  '输入出生时间',
                  '请输入格式：HH:mm (24小时制)',
                  [
                    {
                      text: '取消',
                      style: 'cancel',
                    },
                    {
                      text: '确定',
                      onPress: () => {
                        // 这里需要实现文本输入逻辑
                        // 暂时先显示时间选择器
                        setShowTimePicker(true);
                      },
                    },
                  ]
                );
              }
            }}
          >
            <Text style={styles.pickerText}>
              {birthTime || '请选择出生时间'}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={getCurrentTime()}
              mode="time"
              display="spinner"
              onChange={onTimeChange}
            />
          )}
        </View>

        {/* 性别选择 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>性别</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderButton, gender === '男' && styles.genderButtonSelected]}
              onPress={() => setGender('男')}
            >
              <Text style={[styles.genderText, gender === '男' && styles.genderTextSelected]}>
                男
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, gender === '女' && styles.genderButtonSelected]}
              onPress={() => setGender('女')}
            >
              <Text style={[styles.genderText, gender === '女' && styles.genderTextSelected]}>
                女
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 出生地选择 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>出生地</Text>
          <View style={styles.provinceContainer}>
            {provinces.map((province) => (
              <TouchableOpacity
                key={province}
                style={[
                  styles.provinceButton,
                  birthPlace === province && styles.provinceButtonSelected
                ]}
                onPress={() => setBirthPlace(province)}
              >
                <Text style={[
                  styles.provinceText,
                  birthPlace === province && styles.provinceTextSelected
                ]}>
                  {province}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 提交按钮 */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>开始起名</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  genderButtonSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  genderText: {
    fontSize: 16,
    color: '#666',
  },
  genderTextSelected: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  provinceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  provinceButton: {
    width: '48%',
    marginBottom: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  provinceButtonSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  provinceText: {
    fontSize: 14,
    color: '#666',
  },
  provinceTextSelected: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 30,
    padding: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen;