# GitHub ile APK Oluşturma - Süper Kolay Yöntem!

## 📱 3 Adımda APK'nız Hazır

### 1️⃣ **GitHub'a Kod Yükleme**

1. **GitHub.com'a gidin** ve hesap oluşturun (ücretsiz)
2. **"New Repository" butonuna** tıklayın
3. **Repository adı**: `eye-rest-app` 
4. **Public seçin** (özel proje için Private)
5. **"Create repository"** tıklayın

### 2️⃣ **Kodları GitHub'a Yükleme**

**Yöntem A - Web Üzerinden (En Kolay):**
1. GitHub'da yeni oluşturduğunuz repository'ye gidin
2. **"uploading an existing file"** linkine tıklayın  
3. **Tüm proje dosyalarını** sürükleyip bırakın
4. **Commit changes** butonuna tıklayın

**Yöntem B - Terminal ile:**
```bash
cd /home/omer/eye-rest-app
git init
git add .
git commit -m "İlk commit - Göz dinlendirme uygulaması"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/eye-rest-app.git
git push -u origin main
```

### 3️⃣ **Otomatik APK Oluşturma**

1. **Actions sekmesine** gidin
2. **"Build Android APK"** workflow'unu göreceksiniz
3. **"Run workflow"** butonuna tıklayın
4. **5-10 dakika bekleyin** ☕
5. **Artifacts bölümünden APK'yı indirin** 📱

---

## 🎯 **Alternatif Yöntemler**

### **Alternatif 1: Replit.com**
- Ücretsiz online coding platformu
- Java ve Android build desteği var
- Tarayıcıdan direkt çalışır

### **Alternatif 2: Gitpod**
- GitHub ile entegre online IDE
- Full Linux environment
- APK build edebilir

### **Alternatif 3: CodeSpaces (GitHub)**
- GitHub'ın kendi online IDE'si
- Aylık 60 saat ücretsiz
- Full development environment

### **Alternatif 4: Local Build (Arkadaş/İş Bilgisayarı)**
- Android Studio kurulu bir bilgisayar bulun
- Kodları kopyalayın
- `gradlew assembleRelease` çalıştırın

---

## 📲 **APK'yı Telefona Yükleme**

### **Yöntem 1: USB ile**
```bash
adb install app-release-unsigned.apk
```

### **Yöntem 2: File Transfer**
1. APK'yı telefona kopyalayın (Google Drive, USB, etc.)
2. File Manager ile APK'yı açın
3. **"Bilinmeyen kaynaklar"** izni verin
4. **"Yükle"** butonuna tıklayın

### **Yöntem 3: QR Code**
- APK'yı Google Drive'a yükleyin
- Link'i QR Code'a çevirin
- Telefonla QR kodu okutup indirin

---

## ⚡ **Hızlı Test için**

APK'nızı test etmeden önce `App.js` dosyasında bu değişikliği yapın:

```javascript
// 30 dakika yerine 10 saniye yapalım test için
const ALARM_INTERVAL = 10 * 1000; // Test için 10 saniye

// Sonra geri değiştirin:
// const ALARM_INTERVAL = 30 * 60 * 1000; // 30 dakika
```

---

## 🏆 **En Kolay Yöntem: GitHub Actions**

1. ✅ Hiçbir şey kurmanıza gerek yok
2. ✅ GitHub otomatik build ediyor
3. ✅ APK'yı direkt indiriyorsunız  
4. ✅ Her kod değişikliğinde yeni APK
5. ✅ Tamamen ücretsiz

**Tahmini süre: 15 dakika** ⏱️