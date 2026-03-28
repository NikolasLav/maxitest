// ensure app
document.addEventListener('DOMContentLoaded', function() {
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
  const purpose = document.getElementById('paymentPurpose');
  purpose.value = window.WebApp.initDataUnsafe;

  // Находим форму
  const form = document.getElementById('orderForm');
  if (!form) {
    console.error("Форма с id='orderForm' не найдена");
    return;
  }
});

// current date
var today = new Date().toISOString().split('T')[0];
document.getElementById('tdate').value = today;
document.getElementById('tdate').min = today;

// payment purpose
purpose.value = '';
const purpose_length = document.getElementById('purposeLength');
btn = document.getElementById('submit');
//var numberPattern = /\d+/g;
var ensuringType = document.getElementById('ensuringType');
var eis = document.getElementById('contractEIS');
var ikz = document.getElementById('contractIKZ');
var subj = document.getElementById('contractSubj');
var warranty_per = document.getElementById('warranty_per');
var warranty_period_value = this.warranty_period.value;
// for number checking
var bik = document.getElementById('counterpartyBankBic');  //+9+
var ks = document.getElementById('counterpartyAccountNumber');  //+20+
var eks = document.getElementById('counterpartyBankCorrAccount');  //+20+
var inn = document.getElementById('counterpartyINN');  //+10+
var kpp = document.getElementById('counterpartyKPP');  //+9+
var uin = document.getElementById('supplierBillId');  //+4+
var kbk = document.getElementById('taxInfoKBK');  //+1 or 20+
var oktmo = document.getElementById('taxInfoOKATO');  //1, 8 or 11

// forbidden symbols replace function
var counterparty_name = document.getElementById('counterpartyName');
[subj, counterparty_name].forEach(function(element){
    element.addEventListener('change', function(e) {
        element.value = element.value.replace(/[»,«]/g, "\"")
    });
});

// read params from URL
let params = new URLSearchParams(document.location.search);
console.log("params: ", params);
if (params.has('o')) {
    let organizationName = document.getElementById('organizationName');
    let counterpartyName = document.getElementById('counterpartyName');
    let paymentAmount = document.getElementById('paymentAmount');
    let contractSubj = document.getElementById('contractSubj');
    organizationName.value = params.get('o');
    ensuringType.value = params.get('ensure_type');
    warranty_per.value = params.get('wp');
    eis.value = params.get('contract_ies');
    ikz.value = params.get('contract_ikz');
    let eis_val = eis.value
    let ikz_val = ikz.value
    if (eis_val.length > 0) {
        eis_val = 'EИС: ' + eis_val;
        }
    if (ikz_val.length > 0) {
        ikz_val = ' ИКЗ: ' + ikz_val;
        }
    numbers = eis_val + ikz_val
    if (numbers.length > 0) {
        numbers = '(' + numbers + ') ';
        }
    if (ensuringType.value == "Гар.Обесп.") {
            warranty_period.style.display = "block";
            warranty_per.required = true;
            purpose.value = ensuringType.value + ' ' + numbers + subj.value + ' ' + warranty_per.value + 'мес.';
            };
    contractSubj.value = params.get('purpose');
    counterpartyName.value = params.get('cp_name');
    counterpartyINN.value = params.get('cp_inn');
    counterpartyKPP.value = params.get('cp_kpp');
    counterpartyBankBic.value = params.get('cp_bik');
    counterpartyAccountNumber.value = params.get('cp_rs');
    counterpartyBankCorrAccount.value = params.get('cp_ks');
    paymentAmount.value = params.get('amount');
    uin.value = params.get('uin');
    kbk.value = params.get('kbk');
    oktmo.value = params.get('oktmo');

    console.log("organization: ", organizationName, "counterparty: ", counterpartyName);
    };


[counterparty_name].forEach(function(element){
    element.addEventListener('change', function(e) {
        if (element.value.length > 160) {
            element.style.background = "#ebabab";
                        btn.style.background = "#e3292c"
            btn.textContent = "Проверьте форму"
            btn.setAttribute('disabled','disabled');
        } else {
            element.style.background = "#aafac1"

            btn.style.background = "blue"
            btn.textContent = "Отправить на оплату"
            btn.removeAttribute("disabled");
        };
    });
});


// digit input only function
[bik, ks, eks, inn, kpp, ikz, uin, kbk, oktmo].forEach(function(element){
    element.addEventListener('change', function(e) {
        element.value = element.value.replace(/\D/g, '')
    });
});

// length input checking function
[bik, kpp].forEach(function(element){
    element.addEventListener('change', function(e) {
        if (element.value.length != 9) {
            element.style.background = "#ebabab";
                        btn.style.background = "#e3292c"
            btn.textContent = "Проверьте форму"
            btn.setAttribute('disabled','disabled');
        } else {
            element.style.background = "#aafac1"

            btn.style.background = "blue"
            btn.textContent = "Отправить на оплату"
            btn.removeAttribute("disabled");
        };
    });
});
[inn].forEach(function(element){
    element.addEventListener('change', function(e) {
        if (element.value.length != 10) {
            element.style.background = "#ebabab";
            btn.style.background = "#e3292c"
            btn.textContent = "Проверьте форму"
            btn.setAttribute('disabled','disabled');
        } else {
            element.style.background = "#aafac1"

            btn.style.background = "blue"
            btn.textContent = "Отправить на оплату"
            btn.removeAttribute("disabled");
        };
    });
});
[uin].forEach(function(element){
    element.addEventListener('change', function(e) {
        if (element.value.length != 1 && element.value.length != 4 && element.value.length != 20 && element.value.length != 25) {
            element.style.background = "#ebabab";
                        btn.style.background = "#e3292c"
            btn.textContent = "Проверьте форму"
            btn.setAttribute('disabled','disabled');
        } else {
            element.style.background = "#aafac1"

            btn.style.background = "blue"
            btn.textContent = "Отправить на оплату"
            btn.removeAttribute("disabled");
        };
    });
});
[ks, eks].forEach(function(element){
    element.addEventListener('change', function(e) {
        if (element.value.length != 20) {
            element.style.background = "#ebabab";
                        btn.style.background = "#e3292c"
            btn.textContent = "Проверьте форму"
            btn.setAttribute('disabled','disabled');
        } else {
            element.style.background = "#aafac1"

            btn.style.background = "blue"
            btn.textContent = "Отправить на оплату"
            btn.removeAttribute("disabled");
        };
    });
});
[kbk].forEach(function(element){
    element.addEventListener('change', function(e) {
        if (element.value.length != 20 && element.value.length != 1) {
            element.style.background = "#ebabab";
                        btn.style.background = "#e3292c"
            btn.textContent = "Проверьте форму"
            btn.setAttribute('disabled','disabled');
        } else {
            element.style.background = "#aafac1"

            btn.style.background = "blue"
            btn.textContent = "Отправить на оплату"
            btn.removeAttribute("disabled");
        };
    });
});
[oktmo].forEach(function(element){
    element.addEventListener('change', function(e) {
        if (element.value.length != 11 && element.value.length != 8 && element.value.length != 1) {
            element.style.background = "#ebabab";
            btn.style.background = "#e3292c"
            btn.textContent = "Проверьте форму"
            btn.setAttribute('disabled','disabled');
        } else {
            element.style.background = "#aafac1"
            btn.style.background = "blue"
            btn.textContent = "Отправить на оплату"
            btn.removeAttribute("disabled");
        };
    });
});

// purpose text forming and its length checking function
[warranty_per, ensuringType, eis, ikz, subj].forEach(function(element){
    element.addEventListener('change', function(e) {
        let eis_val = eis.value
        let ikz_val = ikz.value
        if (eis_val.length > 0) {
            eis_val = 'EИС: ' + eis_val;
            }
        if (ikz_val.length > 0) {
            ikz_val = ' ИКЗ: ' + ikz_val;
            }
        numbers = eis_val + ikz_val
        if (numbers.length > 0) {
            numbers = '(' + numbers + ') ';
            }
        purpose.value = ensuringType.value + ' ' + numbers + subj.value;
        if (purpose.value.length > 210) {
            purpose_length.style.display = "block";
            btn.style.background = "#e3292c";
            btn.textContent = "Проверьте форму";
            btn.setAttribute('disabled','disabled');
        } else {
            purpose_length.style.display = "None";
            btn.style.background = "blue";
            btn.textContent = "Отправить на оплату";
            btn.removeAttribute("disabled");
        let warranty = ensuringType.value
        if (ensuringType.value == "Гар.Обесп.") {
            warranty_period.style.display = "block";
            warranty_per.required = true;
            purpose.value = ensuringType.value + ' ' + numbers + subj.value + ' ' + warranty_per.value + 'мес.';
        } else {
            warranty_period.style.display = "None";
            warranty_per.required = false;
        }
        };
    });
});


// sending data
document.getElementById("tg").addEventListener("submit", function(e){
    e.preventDefault();
    warranty_period_value = this.warranty_period.value;
    if (this.ensuringType.value != "Гар.Обесп.") {
        warranty_period_value = "NULL";
    };

    let data = {
        organizationName: this.organizationName.value,
        ensuringType: this.ensuringType.value,
        counterpartyBankBic: this.counterpartyBankBic.value,
        counterpartyAccountNumber: this.counterpartyAccountNumber.value,
        counterpartyBankCorrAccount: this.counterpartyBankCorrAccount.value,
        counterpartyINN: this.counterpartyINN.value,
        counterpartyKPP: this.counterpartyKPP.value,
        counterpartyName: this.counterpartyName.value,
        paymentAmount: this.paymentAmount.value,
        paymentDate: this.paymentDate.value,
        contractEIS: this.contractEIS.value,
        contractIKZ: this.contractIKZ.value,
        contractSubj: this.contractSubj.value,
        supplierBillId: this.supplierBillId.value,
        taxInfoKBK: this.taxInfoKBK.value,
        taxInfoOKATO: this.taxInfoOKATO.value,
        paymentPurpose: this.paymentPurpose.value,
        warranty_period: warranty_period_value,
    };

try {
    const result = window.WebApp.shareContent({text: "JSON.stringify(data, null, 4)"});
    console.log("Данные успешно отправлены в MAX:", result);
    window.WebApp.close();
      } catch (error) {
    console.error("Ошибка при отправке через shareContent:", error);
    alert("Не удалось отправить данные. Попробуйте ещё раз.");
  }
});
