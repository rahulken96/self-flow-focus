/**
 * Calculator — Standard, Scientific, and Currency converter logic
 */
const Calculator = (function() {
    'use strict';

    // State variables
    let currentTab = 'standard'; // standard, scientific, currency
    let stdInput = '0';
    let stdHistory = '';
    let sciInput = '0';
    let sciHistory = '';
    let isDegree = true; // Degree or Radian mode

    // Currency rates state
    let exchangeRates = null;
    let lastRatesUpdate = null;

    const FALLBACK_RATES = {
        "USD": 1.0,
        "IDR": 16350.0,
        "EUR": 0.92,
        "JPY": 157.5,
        "SGD": 1.35,
        "MYR": 4.72,
        "GBP": 0.79,
        "AUD": 1.51,
        "SAR": 3.75
    };

    function init() {
        initTabs();
        initStdCalc();
        initSciCalc();
        initCurrencyCalc();
    }

    // ── Tab Management ──
    function initTabs() {
        $('.calc-mode-btn').on('click', function() {
            const tab = $(this).data('calc-tab');
            currentTab = tab;
            $('.calc-mode-btn').removeClass('active');
            $(this).addClass('active');

            $('.calc-tab-content').addClass('d-none');
            $(`#calc-tab-${tab}`).removeClass('d-none');
        });
    }

    // ── Standard Calculator ──
    function initStdCalc() {
        $('#std-calc-buttons button').on('click', function() {
            const val = $(this).data('val');
            const action = $(this).data('action');

            if (action === 'clear') {
                stdInput = '0';
                stdHistory = '';
            } else if (action === 'backspace') {
                if (stdInput.length > 1) {
                    stdInput = stdInput.slice(0, -1);
                } else {
                    stdInput = '0';
                }
            } else if (action === 'equals') {
                try {
                    // Safe evaluation
                    const expression = stdInput;
                    const result = evalBasic(expression);
                    stdHistory = expression + ' =';
                    stdInput = formatResult(result);
                } catch (e) {
                    stdInput = 'Error';
                }
            } else if (val !== undefined) {
                if (stdInput === '0' || stdInput === 'Error') {
                    if (['+', '-', '*', '/'].includes(val)) {
                        stdInput = '0' + val;
                    } else {
                        stdInput = val.toString();
                    }
                } else {
                    stdInput += val;
                }
            }
            updateStdDisplay();
        });
    }

    function updateStdDisplay() {
        $('#stdHistory').text(stdHistory);
        $('#stdInput').text(stdInput);
    }

    function evalBasic(expr) {
        // Replace visual operators if any
        let clean = expr.replace(/×/g, '*').replace(/÷/g, '/');
        // Simple evaluation
        const res = new Function(`return (${clean})`)();
        if (res === undefined || isNaN(res) || !isFinite(res)) {
            throw new Error('Invalid calculation');
        }
        return res;
    }

    // ── Scientific Calculator ──
    function initSciCalc() {
        $('#sci-calc-buttons button').on('click', function() {
            const val = $(this).data('val');
            const action = $(this).data('action');

            if (action === 'clear') {
                sciInput = '0';
                sciHistory = '';
            } else if (action === 'backspace') {
                // If it ends with a function name, remove the function name
                const fnRegex = /(sin\(|cos\(|tan\(|log\(|ln\(|sqrt\()$/;
                if (fnRegex.test(sciInput)) {
                    sciInput = sciInput.replace(fnRegex, '');
                } else if (sciInput.length > 1) {
                    sciInput = sciInput.slice(0, -1);
                } else {
                    sciInput = '0';
                }
                if (sciInput === '') sciInput = '0';
            } else if (action === 'equals') {
                try {
                    const expression = sciInput;
                    const result = evalSci(expression);
                    sciHistory = expression + ' =';
                    sciInput = formatResult(result);
                } catch (e) {
                    sciInput = 'Error';
                }
            } else if (action === 'deg-rad') {
                isDegree = !isDegree;
                $(this).text(isDegree ? 'DEG' : 'RAD');
                $(this).toggleClass('wf-btn-primary').toggleClass('wf-btn-outline');
            } else if (action === 'negate') {
                if (sciInput.startsWith('-')) {
                    sciInput = sciInput.slice(1);
                } else if (sciInput !== '0') {
                    sciInput = '-' + sciInput;
                }
            } else if (val !== undefined) {
                if (sciInput === '0' || sciInput === 'Error') {
                    if (['+', '-', '*', '/', '^', '%'].includes(val)) {
                        sciInput = '0' + val;
                    } else if (val.endsWith('(')) {
                        sciInput = val;
                    } else {
                        sciInput = val.toString();
                    }
                } else {
                    sciInput += val;
                }
            }
            updateSciDisplay();
        });
    }

    function updateSciDisplay() {
        $('#sciHistory').text(sciHistory);
        $('#sciInput').text(sciInput);
    }

    function evalSci(expr) {
        // Order matters: replace function names FIRST, then standalone constants
        let clean = expr
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/π/g, 'Math.PI')
            .replace(/sin\(/g, isDegree ? 'Math.sin(Math.PI/180*' : 'Math.sin(')
            .replace(/cos\(/g, isDegree ? 'Math.cos(Math.PI/180*' : 'Math.cos(')
            .replace(/tan\(/g, isDegree ? 'Math.tan(Math.PI/180*' : 'Math.tan(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/\^/g, '**')
            .replace(/\be\b/g, 'Math.E'); // standalone 'e' only, AFTER function names

        // Close any unclosed parentheses automatically
        let openCount = (clean.match(/\(/g) || []).length;
        let closeCount = (clean.match(/\)/g) || []).length;
        while (openCount > closeCount) {
            clean += ')';
            closeCount++;
        }

        const res = new Function(`return (${clean})`)();
        if (res === undefined || isNaN(res) || !isFinite(res)) {
            throw new Error('Invalid calculation');
        }
        return res;
    }

    function formatResult(val) {
        if (Math.abs(val) < 1e-9 || Math.abs(val) > 1e12) {
            return val.toExponential(6);
        }
        // Round to 10 decimal places to prevent float precision issues (0.1+0.2=0.3)
        return Number(Math.round(+(val + 'e10')) + 'e-10').toString();
    }

    // ── Currency Exchange ──
    function initCurrencyCalc() {
        loadRates();

        $('#currAmount').on('input', calculateExchange);
        $('#currFrom, #currTo').on('change', calculateExchange);

        $('#swapCurrency').on('click', function() {
            const from = $('#currFrom').val();
            const to = $('#currTo').val();
            $('#currFrom').val(to);
            $('#currTo').val(from);
            calculateExchange();
        });

        $('#updateRates').on('click', function() {
            fetchRates(true);
        });
    }

    function loadRates() {
        const cachedRates = Storage.get('currency_rates', null);
        const cachedTime = Storage.get('currency_last_update', null);

        if (cachedRates && cachedTime && (Date.now() - cachedTime < 24 * 60 * 60 * 1000)) {
            // Rates are fresh (under 24h)
            exchangeRates = cachedRates;
            lastRatesUpdate = cachedTime;
            updateRatesUI();
        } else {
            // Fetch fresh rates
            fetchRates(false);
        }
    }

    function fetchRates(manual) {
        const updateBtn = $('#updateRates');
        const originalText = updateBtn.html();
        updateBtn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...').prop('disabled', true);

        $.ajax({
            url: 'https://open.er-api.com/v6/latest/USD',
            method: 'GET',
            timeout: 5000,
            success: function(data) {
                if (data && data.rates) {
                    exchangeRates = data.rates;
                    lastRatesUpdate = Date.now();
                    Storage.set('currency_rates', exchangeRates);
                    Storage.set('currency_last_update', lastRatesUpdate);
                    updateRatesUI();
                    if (manual) showToast('Kurs berhasil diperbarui dari server API.');
                } else {
                    useFallbackRates(manual);
                }
            },
            error: function() {
                useFallbackRates(manual);
            },
            complete: function() {
                updateBtn.html(originalText).prop('disabled', false);
            }
        });
    }

    function useFallbackRates(manual) {
        if (!exchangeRates) {
            exchangeRates = FALLBACK_RATES;
            lastRatesUpdate = Date.now();
        }
        updateRatesUI();
        if (manual) showToast('Gagal memuat kurs online. Menggunakan kurs fallback offline.');
    }

    function updateRatesUI() {
        const dateStr = new Date(lastRatesUpdate).toLocaleString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        $('#ratesLastUpdate').text(`Update terakhir: ${dateStr}`);
        calculateExchange();
    }

    function calculateExchange() {
        if (!exchangeRates) return;

        const amount = parseFloat($('#currAmount').val());
        if (isNaN(amount) || amount <= 0) {
            $('#currResult').val('0.00');
            return;
        }

        const from = $('#currFrom').val();
        const to = $('#currTo').val();

        // Convert to USD base first, then to target currency
        const rateFrom = exchangeRates[from] || FALLBACK_RATES[from] || 1;
        const rateTo = exchangeRates[to] || FALLBACK_RATES[to] || 1;

        const usdAmount = amount / rateFrom;
        const targetAmount = usdAmount * rateTo;

        // Formatter based on currency
        let formatted = targetAmount.toLocaleString('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        $('#currResult').val(formatted);
    }

    return { init };
})();

// Init on ready
$(document).ready(function() {
    Calculator.init();
});
