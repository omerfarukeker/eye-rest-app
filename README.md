# Göz Dinlendirme Uygulaması

Android telefon için her 30 dakikada bir göz dinlendirme alarmı çalan uygulama.

## Özellikler

- 30 dakika aralıklarla alarm çalar
- Uygulama kapalıyken bile çalışır
- Herhangi bir tuş (volume, power, vs.) ile alarm kapatılabilir
- Görsel geri sayım
- Kullanıcı dostu arayüz

## Kurulum

### Gereksinimler

- Node.js (16 veya üzeri)
- React Native CLI
- Android Studio
- Android SDK

### Adımlar

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. Android bağımlılıklarını yükleyin:
   ```bash
   cd android
   ./gradlew build
   cd ..
   ```

3. USB Debug açık bir Android telefon bağlayın veya emulator başlatın

4. Uygulamayı çalıştırın:
   ```bash
   npm run android
   ```

### APK Oluşturma

Release APK oluşturmak için:

```bash
cd android
./gradlew assembleRelease
```

APK dosyası `android/app/build/outputs/apk/release/` klasöründe oluşacak.

## Kullanım

1. Uygulamayı açın
2. "BAŞLAT" butonuna basın
3. Her 30 dakikada alarm çalacak
4. Alarm çaldığında herhangi bir tuş ile kapatın
5. Durdurmak için "DURDUR" butonuna basın

## Göz Dinlendirme Kuralı (20-20-20)

- Her 20 dakikada (bizim uygulamamızda 30 dakika)
- 20 adım uzaktaki bir noktaya bakın
- 20 saniye boyunca uzağa bakın
- Gözlerinizi birkaç kez kırpıştırın

## Sorun Giderme

### Alarm çalmıyor
- Battery optimization'dan uygulamayı çıkarın
- Notification izinlerinin açık olduğunu kontrol edin
- "Do Not Disturb" modunu kapatın

### Uygulama kapanıyor
- Background app limits'i kapatın
- Auto-start izni verin

## Lisans

Bu uygulama kişisel kullanım içindir.