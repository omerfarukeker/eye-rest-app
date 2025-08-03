import React, {useState, useEffect, useRef} from 'react';
import {
  Alert,
  AppState,
  BackHandler,
  DeviceEventEmitter,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  VolumeManager,
} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import Sound from 'react-native-sound';
import PushNotification from 'react-native-push-notification';

// 30 dakika = 1800000 milisaniye
const ALARM_INTERVAL = 30 * 60 * 1000; // 30 dakika
// Test için 10 saniye kullanın: const ALARM_INTERVAL = 10 * 1000;

const App = () => {
  const [isActive, setIsActive] = useState(false);
  const [nextAlarmTime, setNextAlarmTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const alarmSound = useRef(null);

  useEffect(() => {
    // Push notification yapılandırması
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      requestPermissions: Platform.OS === 'ios',
    });

    // Ses dosyası yükleme
    Sound.setCategory('Alarm');
    alarmSound.current = new Sound('alarm.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Alarm ses dosyası yüklenemedi, varsayılan ses kullanılacak');
        // Varsayılan sistem alarmı kullan
        alarmSound.current = null;
      }
    });

    // Hardware tuş dinleyicileri
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleKeyPress);
    const volumeUpHandler = DeviceEventEmitter.addListener('volumeUp', handleKeyPress);
    const volumeDownHandler = DeviceEventEmitter.addListener('volumeDown', handleKeyPress);

    // App state değişiklik dinleyicisi
    const appStateHandler = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      if (timerRef.current) {
        BackgroundTimer.clearInterval(timerRef.current);
      }
      if (countdownRef.current) {
        BackgroundTimer.clearInterval(countdownRef.current);
      }
      if (alarmSound.current) {
        alarmSound.current.release();
      }
      backHandler.remove();
      volumeUpHandler.remove();
      volumeDownHandler.remove();
      appStateHandler?.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    // Uygulama background'a geçtiğinde timer'ı korumaya devam et
    console.log('App state değişti:', nextAppState);
  };

  const handleKeyPress = () => {
    if (isAlarmPlaying) {
      stopAlarm();
      return true; // Prevent default behavior
    }
    return false;
  };

  const startTimer = () => {
    if (isActive) return;

    const now = Date.now();
    const nextAlarm = now + ALARM_INTERVAL;
    
    setIsActive(true);
    setNextAlarmTime(nextAlarm);
    setRemainingTime(ALARM_INTERVAL);

    // Ana timer - 30 dakikada bir alarm çal
    timerRef.current = BackgroundTimer.setInterval(() => {
      playAlarm();
      scheduleNextAlarm();
    }, ALARM_INTERVAL);

    // Geri sayım timer - her saniye güncelle
    countdownRef.current = BackgroundTimer.setInterval(() => {
      const now = Date.now();
      const remaining = nextAlarmTime - now;
      
      if (remaining <= 0) {
        setRemainingTime(0);
      } else {
        setRemainingTime(remaining);
      }
    }, 1000);

    // İlk alarm için notification schedule et
    scheduleNotification(ALARM_INTERVAL);
  };

  const stopTimer = () => {
    setIsActive(false);
    setNextAlarmTime(null);
    setRemainingTime(0);

    if (timerRef.current) {
      BackgroundTimer.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (countdownRef.current) {
      BackgroundTimer.clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    // Bekleyen bildirimleri iptal et
    PushNotification.cancelAllLocalNotifications();
    
    if (isAlarmPlaying) {
      stopAlarm();
    }
  };

  const scheduleNextAlarm = () => {
    const nextAlarm = Date.now() + ALARM_INTERVAL;
    setNextAlarmTime(nextAlarm);
    setRemainingTime(ALARM_INTERVAL);
    scheduleNotification(ALARM_INTERVAL);
  };

  const scheduleNotification = (delay) => {
    PushNotification.localNotificationSchedule({
      title: 'Göz Dinlendirme Zamanı! 👁️',
      message: 'Gözlerinizi dinlendirme vakti geldi. Birkaç dakika mola verin.',
      date: new Date(Date.now() + delay),
      playSound: true,
      soundName: 'default',
      importance: 'high',
      vibrate: true,
      vibration: 3000,
    });
  };

  const playAlarm = () => {
    setIsAlarmPlaying(true);

    if (alarmSound.current) {
      alarmSound.current.setNumberOfLoops(-1); // Sürekli çal
      alarmSound.current.play();
    }

    // Anında bildirim göster
    PushNotification.localNotification({
      title: '⏰ Göz Dinlendirme Alarmı',
      message: 'Gözlerinizi dinlendirme zamanı! Herhangi bir tuşa basarak alarmı kapatabilirsiniz.',
      playSound: true,
      soundName: 'default',
      importance: 'max',
      vibrate: true,
      vibration: 3000,
      ongoing: true, // Kapatılamaz bildirim
    });

    // Alert dialog göster
    Alert.alert(
      '👁️ Göz Dinlendirme Zamanı!',
      'Gözlerinizi dinlendirme vakti geldi.\\n\\n• Uzak bir noktaya bakın (20 adım uzakta)\\n• 20 saniye boyunca uzağa bakın\\n• Göz kapaklarınızı birkaç kez kırpıştırın\\n\\nHerhangi bir tuşa basarak alarmı kapatabilirsiniz.',
      [
        {
          text: 'Alarmı Kapat',
          onPress: stopAlarm,
        },
      ],
      {cancelable: false}
    );
  };

  const stopAlarm = () => {
    setIsAlarmPlaying(false);

    if (alarmSound.current) {
      alarmSound.current.stop();
    }

    // Ongoing bildirimi temizle
    PushNotification.cancelAllLocalNotifications();
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatNextAlarmTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2E7D32" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>👁️ Göz Dinlendirme</Text>
        <Text style={styles.subtitle}>Her 30 dakikada sağlığınız için</Text>
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, {backgroundColor: isActive ? '#4CAF50' : '#9E9E9E'}]}>
          <Text style={styles.statusText}>
            {isActive ? '✅ AKTİF' : '⏸️ DURDURULDU'}
          </Text>
        </View>

        {isActive && (
          <View style={styles.timerInfo}>
            <Text style={styles.timerLabel}>Sonraki alarm:</Text>
            <Text style={styles.nextAlarmTime}>
              {formatNextAlarmTime(nextAlarmTime)}
            </Text>
            
            <Text style={styles.timerLabel}>Kalan süre:</Text>
            <Text style={styles.countdown}>
              {formatTime(remainingTime)}
            </Text>
          </View>
        )}

        {isAlarmPlaying && (
          <View style={styles.alarmStatus}>
            <Text style={styles.alarmText}>🔔 ALARM ÇALIYOR</Text>
            <Text style={styles.alarmInstruction}>
              Herhangi bir tuşa basarak kapatın
            </Text>
          </View>
        )}
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.startButton, isActive && styles.disabledButton]}
          onPress={startTimer}
          disabled={isActive}>
          <Text style={styles.buttonText}>
            🟢 {isActive ? 'ÇALIŞIYOR' : 'BAŞLAT'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.stopButton, !isActive && styles.disabledButton]}
          onPress={stopTimer}
          disabled={!isActive}>
          <Text style={styles.buttonText}>
            🔴 DURDUR
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>ℹ️ Nasıl Çalışır?</Text>
        <Text style={styles.infoText}>
          • Başlat'a bastıktan sonra her 30 dakikada alarm çalar{'\n'}
          • Uygulama kapanır veya telefon kilitlense bile çalışmaya devam eder{'\n'}
          • Alarm çaldığında herhangi bir tuşa (volume, power, etc.) basarak kapatabilirsiniz{'\n'}
          • Gözlerinizi dinlendirmek için 20-20-20 kuralını uygulayın
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E8',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 5,
    textAlign: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  statusIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 20,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timerInfo: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  nextAlarmTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15,
  },
  countdown: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
    fontFamily: 'monospace',
  },
  alarmStatus: {
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  alarmText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  alarmInstruction: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
    elevation: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default App;