const translations = {
    en: {
        title: "Porty - Take a Step Toward Financial Freedom",
        meta: "Track your investments in one place, reach your goals. Manage your financial future with Porty.",
        heading: "Download Now",
        description: "Track your investments in one place, reach your goals. Start managing your financial future with Porty now.",
        qrText: "Scan the QR code to download the app",
        footer: "&copy; Porty Finance. All rights reserved.",
        appStoreAlt: "Download on the App Store",
        playStoreAlt: "Get it on Google Play",
        appStoreBadge: "https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83",
        playStoreBadge: "https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
    },
    tr: {
        title: "Porty - Finansal Özgürlüğe Adım At",
        meta: "Yatırımlarını tek bir yerden takip et, hedeflerine ulaş. Porty ile finansal geleceğini yönet.",
        heading: "Hemen İndir",
        description: "Yatırımlarını tek bir yerden takip et, hedeflerine ulaş. Porty ile finansal geleceğini yönetmeye hemen başla.",
        qrText: "Uygulamayı indirmek için QR kodu taratın",
        footer: "&copy; Porty Finance. Tüm hakları saklıdır.",
        appStoreAlt: "App Store'dan İndirin",
        playStoreAlt: "Google Play'den Alın",
        appStoreBadge: "https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/tr-tr?size=250x83",
        playStoreBadge: "https://play.google.com/intl/en_us/badges/static/images/badges/tr_badge_web_generic.png"
    },
    de: {
        title: "Porty - Machen Sie einen Schritt in Richtung finanzielle Freiheit",
        meta: "Verfolgen Sie Ihre Investitionen an einem Ort, erreichen Sie Ihre Ziele. Verwalten Sie Ihre finanzielle Zukunft mit Porty.",
        heading: "Jetzt herunterladen",
        description: "Verfolgen Sie Ihre Investitionen an einem Ort, erreichen Sie Ihre Ziele. Beginnen Sie jetzt mit Porty, Ihre finanzielle Zukunft zu verwalten.",
        qrText: "Scannen Sie den QR-Code, um die App herunterzuladen",
        footer: "&copy; Porty Finance. Alle Rechte vorbehalten.",
        appStoreAlt: "Im App Store laden",
        playStoreAlt: "JETZT BEI Google Play",
        appStoreBadge: "https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/de-de?size=250x83",
        playStoreBadge: "https://play.google.com/intl/en_us/badges/static/images/badges/de_badge_web_generic.png"
    }
};

let currentLang = 'en';

window.setLanguage = (lang) => {
    currentLang = lang;
    const t = translations[lang];
    
    // Update text content
    document.title = t.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', t.meta);
    
    document.getElementById('heading').innerText = t.heading;
    document.getElementById('description').innerText = t.description;
    document.getElementById('qr-text').innerText = t.qrText;
    document.getElementById('footer-text').innerHTML = t.footer;
    
    // Update badges
    const iosBadge = document.getElementById('ios-badge');
    const androidBadge = document.getElementById('android-badge');
    if (iosBadge) {
        iosBadge.src = t.appStoreBadge;
        iosBadge.alt = t.appStoreAlt;
    }
    if (androidBadge) {
        androidBadge.src = t.playStoreBadge;
        androidBadge.alt = t.playStoreAlt;
    }

    // Update buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase() === lang);
    });

    // Update html lang attribute
    document.documentElement.lang = lang;
    
    localStorage.setItem('preferredLang', lang);
};

document.addEventListener('DOMContentLoaded', async () => {
    // Supabase Konfigürasyonu (PRODUCTION Ortamı)
    const supabaseUrl = 'https://porty.rubeeks.co';
    const supabaseKey = 'sb_publishable_3VkBX42-PwH8FzdducPzLA__XbNwclM';
    const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

    const iosLink = "https://apps.apple.com/app/porty-finance/id6761659554";
    const androidLink = "https://play.google.com/store/apps/details?id=com.porty.app&hl=en";
    const universalLink = "https://portyfinance.rubeeks.co";

    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroid = /android/i.test(userAgent);

    // Platform Tesbiti
    let platform = 'desktop';
    if (isIOS) platform = 'ios';
    else if (isAndroid) platform = 'android';

    // Ziyareti Kaydet
    try {
        await supabaseClient.from('landing_page_visits').insert([
            { platform: platform, user_agent: userAgent, language: currentLang }
        ]);
    } catch (error) {
        console.error('Tracking error:', error);
    }

    // QR Kod Oluşturma
    const qrElement = document.getElementById("qrcode");
    if (qrElement) {
        new QRCode(qrElement, {
            text: universalLink,
            width: 180,
            height: 180,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    // Language Initialization
    const savedLang = localStorage.getItem('preferredLang');
    const browserLang = navigator.language.split('-')[0];
    const initialLang = savedLang || (translations[browserLang] ? browserLang : 'en');
    setLanguage(initialLang);

    // Otomatik Yönlendirme (Mobil ise)
    if (isIOS) {
        setTimeout(() => { window.location.href = iosLink; }, 2000); // 2 sn bekle ki dil seçebilsin
    } else if (isAndroid) {
        setTimeout(() => { window.location.href = androidLink; }, 2000);
    }
});
