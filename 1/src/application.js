// BEGIN
export default function (){
    const form = document.querySelector('form');
    
    const elements = {
        input: form.querySelector('input[name="number"]'),
        result: document.getElementById('result'),
        resetButton: form.querySelector('button[type="button"]')
    };

    const calculator = {
        _sum: 0,
        
        get sum() {
            return this._sum;
        },
        
        set sum(value) {
            this._sum = value;
            this.updateUI();
        },
        
        add(value) {
            if (!Number.isNaN(value)) {
                this._sum += value;
                this.updateUI();
            }
        },
        
        reset() {
            this._sum = 0;
            this.updateUI();
        },
        
        updateUI() {
            elements.result.textContent = this._sum;
            this.clearInput();
        },
        
        clearInput() {
            elements.input.value = '';
            elements.input.focus();
        },
        
        validateInput() {
            const value = parseInt(elements.input.value, 10);
            const isValid = !Number.isNaN(value);
            return isValid ? value : null;
        }
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        const value = calculator.validateInput();
        
        if (value !== null) {
            calculator.add(value);
        }
    };

    const handleReset = () => {
        calculator.reset();
    };


    form.addEventListener('submit', handleSubmit);
    elements.resetButton.addEventListener('click', handleReset);
    elements.input.addEventListener('input', () => 
        elements.input.classList.remove('invalid')
    );

    calculator.updateUI();
};


// END