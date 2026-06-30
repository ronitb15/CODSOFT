const display = document.getElementById('display');
const historyEl = document.getElementById('history');
const buttons = document.querySelectorAll('.btn');

let currentInput = '';
let previousInput = '';
let operator = null;
let resetDisplay = false;
let historyText = '';

buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
        const value = btn.textContent;
        const type = getButtonType(btn);

        if (type === 'number' || type === 'decimal') {
            handleNumber(value);
        } else if (type === 'operator') {
            handleOperator(value);
        } else if (type === 'clear') {
            handleClear();
        } else if (type === 'delete') {
            handleDelete();
        } else if (type === 'equals') {
            handleEquals();
        }
    });
});

function getButtonType(btn) {
    if (btn.classList.contains('number')) return 'number';
    if (btn.classList.contains('operator')) return 'operator';
    if (btn.classList.contains('clear')) return 'clear';
    if (btn.classList.contains('del')) return 'delete';
    if (btn.classList.contains('equals')) return 'equals';
    if (btn.textContent === '.') return 'decimal';
    return 'number';
}

function handleNumber(value) {
    if (resetDisplay) {
        currentInput = '';
        resetDisplay = false;
    }

    if (value === '.' && currentInput.includes('.')) return;

    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else {
        currentInput += value;
    }

    updateDisplay(currentInput);
}

function handleOperator(op) {
    if (operator && !resetDisplay) {
        const result = calculate(parseFloat(previousInput), parseFloat(currentInput), operator);
        currentInput = String(result);
        updateDisplay(currentInput);
        historyText = currentInput + ' ' + op;
        historyEl.textContent = historyText;
    } else {
        historyText = currentInput + ' ' + op;
        historyEl.textContent = historyText;
    }

    previousInput = currentInput;
    operator = op;
    resetDisplay = true;
}

function handleEquals() {
    if (!operator || resetDisplay) {
        if (operator && resetDisplay) {
            const result = calculate(parseFloat(previousInput), parseFloat(currentInput), operator);
            currentInput = String(result);
            updateDisplay(currentInput);
        }
        return;
    }

    const result = calculate(parseFloat(previousInput), parseFloat(currentInput), operator);
    historyText = previousInput + ' ' + operator + ' ' + currentInput + ' =';
    historyEl.textContent = historyText;
    currentInput = String(result);
    operator = null;
    resetDisplay = true;
    updateDisplay(currentInput);
}

function handleClear() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    resetDisplay = false;
    historyText = '';
    historyEl.textContent = '';
    updateDisplay('0');
}

function handleDelete() {
    if (resetDisplay) return;
    if (currentInput.length <= 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay(currentInput);
}

function calculate(a, b, op) {
    let result;
    if (op === '+') {
        result = a + b;
    } else if (op === '-') {
        result = a - b;
    } else if (op === '*') {
        result = a * b;
    } else if (op === '/') {
        result = b !== 0 ? a / b : 'Error';
    } else if (op === '%') {
        result = a % b;
    } else {
        result = b;
    }

    if (typeof result === 'number' && !Number.isInteger(result)) {
        result = parseFloat(result.toFixed(8));
    }

    return result;
}

function updateDisplay(value) {
    display.textContent = value;
}