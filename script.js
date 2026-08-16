// Sanalar va Jonli Soat
const today = new Date();
const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
document.getElementById('today-date').innerText = formattedDate;

function updateTime() {
    const now = new Date();
    document.getElementById('current-time').innerText = `Soat: ${now.toLocaleTimeString('uz-UZ')}`;
}
setInterval(updateTime, 1000);
updateTime();

// Toshkent shahri uchun bergan manzilingizdan aniq vaqtlarni olish
let prayerTimes = {
    "Bomdod": "04:15",
    "Quyosh": "05:45",
    "Peshin": "12:30",
    "Asr": "17:15",
    "Shom": "19:30",
    "Xufton": "21:00"
};

async function fetchPrayerTimes() {
    try {
        const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Tashkent&country=Uzbekistan');
        const data = await response.json();
        const timings = data.data.timings;

        prayerTimes = {
            "Bomdod": timings.Fajr,
            "Quyosh": timings.Sunrise,
            "Peshin": timings.Dhuhr,
            "Asr": timings.Asr,
            "Shom": timings.Maghrib,
            "Xufton": timings.Isha
        };

        document.getElementById('fajr-time').innerText = timings.Fajr;
        document.getElementById('sunrise-time').innerText = timings.Sunrise;
        document.getElementById('dhuhr-time').innerText = timings.Dhuhr;
        document.getElementById('asr-time').innerText = timings.Asr;
        document.getElementById('maghrib-time').innerText = timings.Maghrib;
        document.getElementById('isha-time').innerText = timings.Isha;

        document.getElementById('sahar-time').innerText = timings.Fajr;
        document.getElementById('iftor-time').innerText = timings.Maghrib;

    } catch (error) {
        console.log("Vaqtlarni yuklashda xatolik yuz berdi:", error);
    }
}

// Keyingi Namozgacha qolgan vaqtni hisoblovchi taymer
function calculateNextPrayer() {
    const now = new Date();
    let nextPrayerName = "Bomdod";
    let nextPrayerTime = new Date();
    let found = false;

    for (let [name, time] of Object.entries(prayerTimes)) {
        let [h, m] = time.split(':').map(Number);
        let pTime = new Date();
        pTime.setHours(h, m, 0, 0);

        if (pTime > now) {
            nextPrayerName = name;
            nextPrayerTime = pTime;
            found = true;
            break;
        }
    }

    if (!found) {
        let [h, m] = prayerTimes["Bomdod"].split(':').map(Number);
        nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
        nextPrayerTime.setHours(h, m, 0, 0);
    }

    const diff = nextPrayerTime - now;
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    document.getElementById('next-prayer-name').innerText = nextPrayerName;
    document.getElementById('prayer-countdown').innerText =
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
setInterval(calculateNextPrayer, 1000);

// Ramazon va Hayitlar uchun Taymerlar
const targetDates = {
    ramazon: new Date('February 1, 2027 00:00:00').getTime(),
    ramazonHayiti: new Date('March 3, 2027 00:00:00').getTime(),
    qurbonHayiti: new Date('May 10, 2027 00:00:00').getTime()
};

function updateHolidayTimers() {
    const now = new Date().getTime();

    function calcAndSet(target, prefix) {
        const distance = target - now;
        const dEl = document.getElementById(`${prefix}-days`);
        const hEl = document.getElementById(`${prefix}-hours`);
        const mEl = document.getElementById(`${prefix}-mins`);
        const sEl = document.getElementById(`${prefix}-secs`);

        if (!dEl) return;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            dEl.innerText = days.toString().padStart(2, '0');
            hEl.innerText = hours.toString().padStart(2, '0');
            mEl.innerText = minutes.toString().padStart(2, '0');
            sEl.innerText = seconds.toString().padStart(2, '0');
        } else {
            dEl.innerText = "00";
            hEl.innerText = "00";
            mEl.innerText = "00";
            sEl.innerText = "00";
        }
    }

    calcAndSet(targetDates.ramazon, 'ramazon');
    calcAndSet(targetDates.ramazonHayiti, 'r');
    calcAndSet(targetDates.qurbonHayiti, 'q');
}
setInterval(updateHolidayTimers, 1000);

// Tahorat va Namoz Qo'llanma ma'lumotlari
const prayerData = {
    tahorat: {
        title: "💧 TAHORAT OLISH TARTIBI",
        steps: [
            "1-Bosqich (Niyat): “Alloh roziligi uchun bugungi (Namoz nomi) namozini oqish uchun tahorat olmoqlikni niyat qildim” deb niyat qilinadi va “Bismillohir rohmanir rohiym” deyiladi.",
            "2-Bosqich (Qo'llar): Qo'llar bilaklari bilan birga 3 marta, barmoq oralarini ishqalab yuviladi.",
            "3-Bosqich (Og'iz va burun): O'ng qo'l bilan og'izga 3 marta suv olib chayiladi. Burunga 3 marta suv tortilib, chap qo'l bilan tozalanadi.",
            "4-Bosqich (Yuz va qo'llar): Yuz soch chiqqan joyidan iyak ostigacha va ikki quloq yumshoqigacha 3 marta yuviladi. So'ng o'ng va chap qo'l tirsaklar bilan 3 martadan yuviladi.",
            "5-Bosqich (Mash tortish): Ho'llangan qo'l bilan boshning hamma qismiga, ko'rsatkich barmoq bilan quloq ichiga, bosh barmoq bilan quloq orqasiga mash tortiladi.",
            "6-Bosqich (Oyoqlar): Oyoqlar to'piqlari bilan birga 3 martadan avval o'ng, keyin chap oyoq barmoq orasidan boshlab yuviladi."
        ]
    },
    bomdod: {
        title: "🌅 BOMDOD NAMOZI (2 rakat sunnat, 2 rakat farz)",
        steps: [
            "2 rakat sunnat: Niyat qilinadi, Fotiha va sura o'qilib ruku va sajda qilinadi. Ikkinchi rakatda o'tirilib Tahiyyat, Salavot va Duo o'qilib salom beriladi.",
            "2 rakat farz: Xuddi sunnat kabi o'qiladi, faqat iqomat aytilib boshlanishi bilan farqlanadi."
        ]
    },
    peshin: {
        title: "☀️ PESHIN NAMOZI (4 rakat sunnat, 4 rakat farz, 2 rakat sunnat)",
        steps: [
            "4 rakat sunnat: Har bir rakatda Fotiha va sura o'qiladi. 2-rakatdan keyin o'tirib faqat Attahiyyat o'qilib, 3-rakatga turiladi.",
            "4 rakat farz: 1 va 2-rakatda Fotiha va sura, 3 va 4-rakatlarda esa faqat Fotiha surasi o'qiladi.",
            "2 rakat sunnat: Bomdodning 2 rakat sunnatidek o'qib tugatiladi."
        ]
    },
    asr: {
        title: " عصر ASR NAMOZI (4 rakat sunnat, 4 rakat farz)",
        steps: [
            "4 rakat sunnat: Peshinning sunnatiga o'xshash tarzda o'qiladi.",
            "4 rakat farz: Peshinning farzi kabi 4 rakat o'qilib salom beriladi."
        ]
    },
    shom: {
        title: "🌇 SHOM NAMOZI (3 rakat farz, 2 rakat sunnat)",
        steps: [
            "3 rakat farz: Dastlabki 2 rakatda Fotiha va sura o'qilib o'tiriladi, 3-rakatda faqat Fotiha o'qilib qadimgi o'tirish va salom bilan tugallanadi.",
            "2 rakat sunnat: Odatiy 2 rakatlik sunnat kabi o'qiladi."
        ]
    },
    xufton: {
        title: "🌙 XUFTON VA VITR NAMOZI (4 sunnat, 4 farz, 2 sunnat, 3 rakat Vitr)",
        steps: [
            "4 rakat sunnat va 4 rakat farz: Peshin va Asr tartibiga o'xshash o'qiladi.",
            "2 rakat sunnat: Oddiy sunnat kabi.",
            "3 rakat Vitr wajib: Uchala rakatida ham Fotiha va sura o'qiladi. 3-rakatda ruku oldidan 'Qunut' duosi o'qilib sajda qilinadi."
        ]
    }
};

function showPrayerInfo(key) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active-tab'));
    event.target.classList.add('active-tab');

    const data = prayerData[key];
    let html = `<h3 class="text-gold">${data.title}</h3>`;
    data.steps.forEach((step, index) => {
        html += `<div class="step-box"><h4 class="text-gold">${index + 1}-Bosqich</h4><p>${step}</p></div>`;
    });

    document.getElementById('namoz-details-box').innerHTML = html;
}

// Boshlang'ich ishga tushirish
fetchPrayerTimes();
showPrayerInfo('tahorat');
updateHolidayTimers();