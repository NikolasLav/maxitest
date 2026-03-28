// ensure app
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM загружен");

    // Проверяем наличие WebApp
    if (typeof window.WebApp === 'undefined') {
        console.error("window.WebApp не найден! Проверьте подключение библиотеки max-web-app.js");
        alert("Ошибка: библиотека MAX не загружена");
        return;
    }

    // Инициализация WebApp
    window.WebApp.ready();
    console.log("WebApp инициализирован, версия:", window.WebApp.version);
    console.log("Данные пользователя:", window.WebApp.initDataUnsafe);

    // current date
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('tdate').value = today;
    document.getElementById('tdate').min = today;

    // payment purpose
    const purpose = document.getElementById('paymentPurpose');
    const purposeLength = document.getElementById('purposeLength');
    const btn = document.getElementById('submit');

    var ensuringType = document.getElementById('ensuringType');
    var eis = document.getElementById('contractEIS');
    var ikz = document.getElementById('contractIKZ');
    var subj = document.getElementById('contractSubj');
    var warranty_per = document.getElementById('warranty_per');

    // for number checking
    var bik = document.getElementById('counterpartyBankBic');
    var ks = document.getElementById('counterpartyAccountNumber');
    var eks = document.getElementById('counterpartyBankCorrAccount');
    var inn = document.getElementById('counterpartyINN');
    var kpp = document.getElementById('counterpartyKPP');
    var uin = document.getElementById('supplierBillId');
    var kbk = document.getElementById('taxInfoKBK');
    var oktmo = document.getElementById('taxInfoOKATO');
    var counterpartyName = document.getElementById('counterpartyName');

    // forbidden symbols replace function
    [subj, counterpartyName].forEach(function (element) {
        element.addEventListener('input', function (e) {
            element.value = element.value.replace(/[»,«]/g, '"');
        });
    });

    // read params from URL
    let params = new URLSearchParams(document.location.search);
    console.log("params: ", Object.fromEntries(params));

    if (params.has('o')) {
        document.getElementById('organizationName').value = params.get('o') || '';
        ensuringType.value = params.get('ensure_type') || '';
        warranty_per.value = params.get('wp') || '';
        eis.value = params.get('contract_ies') || '';
        ikz.value = params.get('contract_ikz') || '';
        subj.value = params.get('purpose') || '';
        counterpartyName.value = params.get('cp_name') || '';
        inn.value = params.get('cp_inn') || '';
        kpp.value = params.get('cp_kpp') || '';
        bik.value = params.get('cp_bik') || '';
        ks.value = params.get('cp_rs') || '';
        eks.value = params.get('cp_ks') || '';
        document.getElementById('paymentAmount').value = params.get('amount') || '';
        uin.value = params.get('uin') || '';
        kbk.value = params.get('kbk') || '';
        oktmo.value = params.get('oktmo') || '';

        // Формирование назначения
        let eisVal = eis.value ? 'EИС: ' + eis.value : '';
        let ikzVal = ikz.value ? ' ИКЗ: ' + ikz.value : '';
        let numbers = eisVal + ikzVal;
        if (numbers) numbers = '(' + numbers + ') ';

        if (ensuringType.value === "Гар.Обесп.") {
            warranty_per.required = true;
            purpose.value = `${ensuringType.value} ${numbers}${subj.value} ${warranty_per.value}мес.`;
        } else {
            purpose.value = `${ensuringType.value} ${numbers}${subj.value}`;
        }
    }

    // Только цифры
    [bik, ks, eks, inn, kpp, ikz, uin, kbk, oktmo].forEach(el => {
        el.addEventListener('input', () => {
            el.value = el.value.replace(/\D/g, '');
        });
    });

    // Валидация длины
    function validateField(el, validLengths) {
        const value = el.value;
        const isValid = Array.isArray(validLengths)
            ? validLengths.includes(value.length)
            : value.length === validLengths;

        el.classList.toggle('invalid', !isValid);
        el.classList.toggle('valid', isValid);

        updateButtonState();
    }

    function updateButtonState() {
        const isPurposeLong = purpose.value.length > 210;
        const isCounterpartyLong = counterpartyName.value.length > 160;
        const hasInvalidField = [bik, kpp, inn, uin, ks, eks, kbk, oktmo].some(
            el => el.classList.contains('invalid')
        );

        btn.disabled = isPurposeLong || isCounterpartyLong || hasInvalidField;
        btn.textContent = btn.disabled ? "Проверьте форму" : "Отправить на оплату";
        btn.style.background = btn.disabled ? "#e3292c" : "blue";
    }

    // Применяем валидацию
    bik.addEventListener('input', () => validateField(bik, 9));
    kpp.addEventListener('input', () => validateField(kpp, 9));
    inn.addEventListener('input', () => validateField(inn, 10));
    uin.addEventListener('input', () => validateField(uin, [1, 4, 20, 25]));
    [ks, eks].forEach(el => el.addEventListener('input', () => validateField(el, 20)));
    kbk.addEventListener('input', () => validateField(kbk, [1, 20]));
    oktmo.addEventListener('input', () => validateField(oktmo, [1, 8, 11]));

    counterpartyName.addEventListener('input', () => {
        counterpartyName.classList.toggle('invalid', counterpartyName.value.length > 160);
        updateButtonState();
    });

    // Обновление назначения платежа
    [ensuringType, eis, ikz, subj, warranty_per].forEach(el => {
        el.addEventListener('input', () => {
            let eisVal = eis.value ? 'EИС: ' + eis.value : '';
            let ikzVal = ikz.value ? ' ИКЗ: ' + ikz.value : '';
            let numbers = eisVal + ikzVal;
            if (numbers) numbers = '(' + numbers + ') ';

            if (ensuringType.value === "Гар.Обесп.") {
                warranty_per.required = true;
                purpose.value = `${ensuringType.value} ${numbers}${subj.value} ${warranty_per.value}мес.`;
            } else {
                warranty_per.required = false;
                purpose.value = `${ensuringType.value} ${numbers}${subj.value}`;
            }

            purposeLength.style.display = purpose.value.length > 210 ? "block" : "none";
            updateButtonState();
        });
    });

    // Отправка данных на сервер
    async function sendDataToServer(data) {
        const url = 'https://b96rc1-81-200-8-152.ru.tuna.am/webhook';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Данные успешно отправлены:', result);
                return true;
            } else {
                console.error('❌ Ошибка сервера:', response.status, await response.text());
                return false;
            }
        } catch (error) {
            console.error('❌ Ошибка сети:', error);
            return false;
        }
    }

    // Обработчик отправки формы
    document.getElementById("tg").addEventListener("submit", async function (e) {
        e.preventDefault();

        const warrantyPeriodValue = ensuringType.value === "Гар.Обесп." ? warranty_per.value : "NULL";

        const data = {
            organizationName: this.organizationName.value,
            ensuringType: this.ensuringType.value,
            counterpartyBankBic: bik.value,
            counterpartyAccountNumber: ks.value,
            counterpartyBankCorrAccount: eks.value,
            counterpartyINN: inn.value,
            counterpartyKPP: kpp.value,
            counterpartyName: counterpartyName.value,
            paymentAmount: this.paymentAmount.value,
            paymentDate: this.paymentDate.value,
            contractEIS: eis.value,
            contractIKZ: ikz.value,
            contractSubj: subj.value,
            supplierBillId: uin.value,
            taxInfoKBK: kbk.value,
            taxInfoOKATO: oktmo.value,
            paymentPurpose: purpose.value,
            warranty_period: warrantyPeriodValue,
        };

        console.log('🔍 Отправляю на сервер:', data);

        const success = await sendDataToServer(data);

        if (success) {
            alert('Данные отправлены!');
            window.WebApp.close();
        } else {
            alert('Ошибка отправки. Проверьте подключение.');
        }
    });
});
