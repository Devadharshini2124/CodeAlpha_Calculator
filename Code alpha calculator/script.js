// Calculator Configuration
const CALCULATOR_CONFIG = {
    maxDigits: 12,
    decimalPrecision: 10
};

// Calculator Class
class Calculator {
    constructor() {
        this.previousOperandElement = document.getElementById('previousOperand');
        this.currentOperandElement = document.getElementById('currentOperand');
        this.displaySection = document.querySelector('.display-section');
        
        this.clear();
        this.bindEvents();
    }

    // Clear all values
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetDisplay = false;
    }

    // Delete last digit
    delete() {
        if (this.currentOperand === 'Error') {
            this.clear();
            return;
        }

        if (this.currentOperand.length <= 1 || this.currentOperand === '0') {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    // Add number to display
    appendNumber(number) {
        if (this.currentOperand === 'Error') {
            this.clear();
        }

        if (this.shouldResetDisplay) {
            this.currentOperand = '0';
            this.shouldResetDisplay = false;
        }

        // Handle decimal point
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        // Handle leading zero
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            // Check max digits limit
            if (this.currentOperand.replace('.', '').length >= CALCULATOR_CONFIG.maxDigits) {
                return;
            }
            this.currentOperand += number;
        }
    }

    // Choose operation
    chooseOperation(operation) {
        if (this.currentOperand === 'Error') {
            this.clear();
            return;
        }

        if (this.currentOperand === '') return;

        if (this.previousOperand !== '') {
            this.compute();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    // Compute result
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.showError();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // Check for infinity or NaN
        if (!isFinite(computation)) {
            this.showError();
            return;
        }

        // Round to prevent floating point errors
        computation = Math.round(computation * Math.pow(10, CALCULATOR_CONFIG.decimalPrecision)) / Math.pow(10, CALCULATOR_CONFIG.decimalPrecision);

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetDisplay = true;
    }

    // Handle percentage
    percentage() {
        if (this.currentOperand === 'Error') {
            this.clear();
            return;
        }

        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;

        this.currentOperand = (current / 100).toString();
    }

    // Show error state
    showError() {
        this.currentOperand = 'Error';
        this.previousOperand = '';
        this.operation = undefined;
        this.displaySection.classList.add('error');
        
        // Remove error class after animation
        setTimeout(() => {
            this.displaySection.classList.remove('error');
        }, 500);
    }

    // Format number for display
    formatNumber(number) {
        if (number === 'Error') return number;
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];

        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    // Update display
    updateDisplay() {
        this.currentOperandElement.textContent = this.formatNumber(this.currentOperand);
        
        if (this.operation != null) {
            this.previousOperandElement.textContent = 
                `${this.formatNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }

    // Add visual feedback for button press
    animateButton(button) {
        if (button) {
            button.classList.add('pressed');
            setTimeout(() => {
                button.classList.remove('pressed');
            }, 100);
        }
    }

    // Handle button clicks
    handleButtonClick(target) {
        const { action, number, operator } = target.dataset;

        this.animateButton(target);

        if (number !== undefined) {
            this.appendNumber(number);
            this.updateDisplay();
        }

        if (operator !== undefined) {
            this.chooseOperation(operator);
            this.updateDisplay();
        }

        if (action !== undefined) {
            switch (action) {
                case 'clear':
                    this.clear();
                    this.updateDisplay();
                    break;
                case 'delete':
                    this.delete();
                    this.updateDisplay();
                    break;
                case 'equals':
                    this.compute();
                    this.updateDisplay();
                    break;
                case 'decimal':
                    this.appendNumber('.');
                    this.updateDisplay();
                    break;
                case 'percentage':
                    this.percentage();
                    this.updateDisplay();
                    break;
            }
        }
    }

    // Handle keyboard input
    handleKeyboardInput(key) {
        const keyMappings = {
            '0': () => this.findButton('[data-number="0"]'),
            '1': () => this.findButton('[data-number="1"]'),
            '2': () => this.findButton('[data-number="2"]'),
            '3': () => this.findButton('[data-number="3"]'),
            '4': () => this.findButton('[data-number="4"]'),
            '5': () => this.findButton('[data-number="5"]'),
            '6': () => this.findButton('[data-number="6"]'),
            '7': () => this.findButton('[data-number="7"]'),
            '8': () => this.findButton('[data-number="8"]'),
            '9': () => this.findButton('[data-number="9"]'),
            '.': () => this.findButton('[data-action="decimal"]'),
            '+': () => this.findButton('[data-operator="+"]'),
            '-': () => this.findButton('[data-operator="-"]'),
            '*': () => this.findButton('[data-operator="×"]'),
            'x': () => this.findButton('[data-operator="×"]'),
            '/': () => this.findButton('[data-operator="÷"]'),
            'Enter': () => this.findButton('[data-action="equals"]'),
            '=': () => this.findButton('[data-action="equals"]'),
            'Escape': () => this.findButton('[data-action="clear"]'),
            'Backspace': () => this.findButton('[data-action="delete"]'),
            '%': () => this.findButton('[data-action="percentage"]')
        };

        const buttonFinder = keyMappings[key];
        if (buttonFinder) {
            const button = buttonFinder();
            if (button) {
                this.handleButtonClick(button);
            }
        }
    }

    // Find button element
    findButton(selector) {
        return document.querySelector(selector);
    }

    // Bind all events
    bindEvents() {
        // Button click events
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e.target);
            });
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            e.preventDefault(); // Prevent default behavior for calculator keys
            this.handleKeyboardInput(e.key);
        });

        // Prevent context menu on buttons (for better mobile experience)
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });
        });

        // Handle operator button active state
        document.querySelectorAll('.btn-operator').forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all operators
                document.querySelectorAll('.btn-operator').forEach(btn => {
                    btn.classList.remove('active');
                });
                // Add active class to clicked operator
                button.classList.add('active');
            });
        });

        // Remove operator active state when number is clicked or equals is pressed
        document.querySelectorAll('.btn-number, .btn-equals').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.btn-operator').forEach(btn => {
                    btn.classList.remove('active');
                });
            });
        });
    }
}

// Utility Functions
function formatResult(result) {
    // Handle very large or very small numbers
    if (Math.abs(result) >= 1e12 || (Math.abs(result) < 1e-6 && result !== 0)) {
        return result.toExponential(6);
    }
    return result;
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();
    
    // Add some visual enhancements
    setTimeout(() => {
        document.querySelector('.calculator').style.opacity = '1';
    }, 100);

    // Add touch support for better mobile experience
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }

    console.log('Calculator initialized successfully!');
});

// Prevent zoom on double tap for mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Calculator };
}