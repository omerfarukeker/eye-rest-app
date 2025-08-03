# Göz Dinlendirme Uygulaması - Build Talimatları

## Gerekli Kurulumlar

### 1. Node.js Kurulumu
```bash
# Ubuntu/Debian için:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Alternatif olarak NodeSource repository'den:
sudo apt-get update
sudo apt-get install nodejs npm
```

### 2. Java Development Kit (JDK) Kurulumu
```bash
# OpenJDK 11 kurulumu (Android için önerilen)
sudo apt-get install openjdk-11-jdk

# JAVA_HOME environment variable ayarlama
echo 'export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$PATH:$JAVA_HOME/bin' >> ~/.bashrc
source ~/.bashrc
```

### 3. Android Studio ve SDK Kurulumu

1. **Android Studio İndirme:**
   - https://developer.android.com/studio adresinden indirin
   - .tar.gz dosyasını açın ve `/opt/android-studio` klasörüne kopyalayın

2. **Android Studio Kurulumu:**
   ```bash
   sudo tar -xzf android-studio-*.tar.gz -C /opt/
   sudo /opt/android-studio/bin/studio.sh
   ```

3. **Android SDK Kurulumu:**
   - Android Studio açıldığında SDK Manager'dan şunları yükleyin:
   - Android SDK Platform 33 (API Level 33)
   - Android SDK Build-Tools 33.0.0
   - Android SDK Platform-Tools
   - Android Emulator (isteğe bağlı)

4. **Environment Variables:**
   ```bash
   echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
   echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.bashrc
   echo 'export PATH=$PATH:$ANDROID_HOME/tools' >> ~/.bashrc
   echo 'export PATH=$PATH:$ANDROID_HOME/tools/bin' >> ~/.bashrc
   echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc
   source ~/.bashrc
   ```

### 4. React Native CLI Kurulumu
```bash
npm install -g @react-native-community/cli
```

## Projeyi Build Etme

### 1. Bağımlılıkları Yükleme
```bash
cd eye-rest-app
npm install
```

### 2. Android Bağımlılıklarını Yükleme
```bash
cd android
./gradlew clean
cd ..
```

### 3. Debug APK Oluşturma
```bash
cd android
./gradlew assembleDebug
```

APK dosyası şurada oluşacak: `android/app/build/outputs/apk/debug/app-debug.apk`

### 4. Release APK Oluşturma (İmzasız)
```bash
cd android
./gradlew assembleRelease
```

APK dosyası şurada oluşacak: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

### 5. Telefona Yükleme

**USB Debug Modu ile:**
```bash
# Telefonu USB ile bağlayın ve USB debugging'i açın
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**APK dosyasını telefona kopyalayarak:**
- APK dosyasını telefona kopyalayın
- File manager ile APK'yı açın
- "Unknown sources" (Bilinmeyen kaynaklar) izni verin
- Uygulamayı yükleyin

## Sorun Giderme

### Gradle Wrapper Problemi
Eğer gradle wrapper dosyası eksikse:
```bash
cd android
# Gradle wrapper'ı yeniden oluştur
gradle wrapper --gradle-version=7.5.1
```

### Permission Denied Hatası
```bash
chmod +x android/gradlew
```

### JAVA_HOME Hatası
```bash
# Java kurulumunu kontrol edin
java -version
javac -version

# JAVA_HOME'u kontrol edin
echo $JAVA_HOME
```

### Android SDK Hatası
```bash
# Android SDK path'ini kontrol edin
echo $ANDROID_HOME
ls $ANDROID_HOME/platforms
```

## Test Etme

### Emulator ile Test
```bash
# Android Studio'dan emulator başlatın
# Sonra proje klasöründe:
npx react-native run-android
```

### Fiziksel Cihaz ile Test
```bash
# USB debugging açık telefonu bağlayın
adb devices  # Telefonu görmeli
npx react-native run-android
```

## Optimizasyon İpuçları

1. **Test için süreyi kısaltın**: `App.js` dosyasında `ALARM_INTERVAL` değerini 10 saniye yapabilirsiniz
2. **Debug build kullanın**: İlk testler için debug APK yeterli
3. **Battery optimization kapatın**: Telefonda uygulama için battery optimization'ı kapatın
4. **Notification izinleri**: Android 13+ için notification izinlerini açmayı unutmayın

## İletişim

Herhangi bir sorun yaşarsanız, hata loglarını kontrol edin:
```bash
adb logcat | grep EyeRestApp
```