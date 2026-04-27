document.addEventListener('DOMContentLoaded', async () => {
    // Supabase Konfigürasyonu (PRODUCTION Ortamı)
    const supabaseUrl = 'https://porty.rubeeks.co';
    const supabaseKey = 'sb_publishable_3VkBX42-PwH8FzdducPzLA__XbNwclM';
    const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

    const universalLink = "https://onelink.to/kndpzw";
    const iosLink = "https://apps.apple.com/tr/app/porty-finance/id6761659554";
    const androidLink = universalLink;

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
            { platform: platform, user_agent: userAgent }
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

    // Linkleri Güncelle
    const iosBtn = document.getElementById('ios-link');
    const androidBtn = document.getElementById('android-link');
    if (iosBtn) iosBtn.href = iosLink;
    if (androidBtn) androidBtn.href = androidLink;

    // Otomatik Yönlendirme (Mobil ise)
    if (isIOS) {
        setTimeout(() => { window.location.href = iosLink; }, 500);
    } else if (isAndroid) {
        setTimeout(() => { window.location.href = androidLink; }, 500);
    }
});
