
  const Model = (() => {
    class State {
      #num1 = '';
      #operation;
      #num2 = '';
      #currentNumber = '';
      #onChangeCb;
      constructor() {
        this.#onChangeCb = () => {};
      }
      get currentNumber() {
        return this.format(this.#currentNumber);
      }

      format(str) {
        if (str.length < 30) return str;
        const digits = str.split('.')[0];
        const decimals = str.split('.')[1];
        if (digits.length >= 30) return 'ERR';
        const diff = 30 - digits.length;
        decimals = decimals.slice(0, diff);
        return `${digits}.${decimals}`;
      }

      appendToCurrentNumber(number) {
       if (this.#operation) {
        this.#num2 += number;
        this.#currentNumber = this.#num2;
       } else {
        this.#num1 += number;
        this.#currentNumber = this.#num1;
       }
        this.#onChangeCb();
      }
    
       setOperation(operation) {
        if (!this.#operation){
            this.#operation = operation;
            this.#onChangeCb();
        }
     
       }

       calculate() {
        if (this.#num1 && this.#num2 && this.#operation) {
            const num1 = this.parseStrToNum(this.#num1);
            const num2 = this.parseStrToNum(this.#num2);
            let result;
            switch (this.#operation) {
                case 'add':
                    result = num1 + num2;
                    break;
                case 'subtract':
                    result = num1 - num2;
                    break;
                case 'multiply':
                    result = num1 * num2;
                    break;
                case 'divide':
                    result = num2 ? num1 / num2 : 0;
                    break;
            }
            result = result.toString();
            this.#currentNumber = result;
            this.#num1 = result;
            this.#operation = '';
            this.#num2 = '';
            this.#onChangeCb();
        }
       }

       clear() {
        this.#operation = '';
        this.#num1 = '';
        this.#num2 = '';
        this.#currentNumber = '';
        this.#onChangeCb();
       }

       parseStrToNum(str) {
        let digits = str.split('.')[0];
        let decimals = str.split('.')[1];
        if (digits[0] === '0') digits = digits.slice(1);
        digits = parseInt(digits);
        if (decimals && decimals.length) {
            decimals = parseInt(decimals);
            const fraction = decimals / (10 ^ decimals.length);
            return digits += fraction;
        } else {
            return digits;
        }
       }
  
      subscribe = (cb) => {
        this.#onChangeCb = cb;
      };
    }
    return {
      State,
    };
  })();

  
  const View = (() => {
    const elements = {
        'add': document.getElementById('add'),
        'subtract': document.getElementById('subtract'),
        'multiply': document.getElementById('multiply'),
        'divide': document.getElementById('divide'),
        'add': document.getElementById('add'),
        'decimal': document.getElementById('decimal'),
        'calculate': document.getElementById('calculate'),
        'clear': document.getElementById('clear'),
    };
    for (let i = 0; i <= 9; i++) {
        const numElement = document.getElementById(i.toString());
        elements[i] = numElement;
    }

   const renderCurrentNum = (num) => {
    const currentNum = document.getElementById('currentNum');
    currentNum.innerHTML = `<span>${num || '0'}</span>`
   }
  
    return {
      elements,
      renderCurrentNum
    };
  })();
  
  const ViewModel = ((Model, View) => {
    const state = new Model.State();

    const addButtonEventListeners = () => {
        for (const key of Object.keys(View.elements)) {
            const element = View.elements[key];
            element.addEventListener('click', event => {
                event.preventDefault();
                if (isNumber(key)) {
                    state.appendToCurrentNumber(key);
                } else if (key === 'calculate') {
                    state.calculate();
                } else if (key === 'clear') {
                    state.clear();
                } else {
                    state.setOperation(key);
                }
            })
        }
    }

    const isNumber = (str) => {
        return str.length === 1;
    }

    const init = () => {
     addButtonEventListeners(),
      state.subscribe(() => {
        View.renderCurrentNum(state.currentNumber);
      });
    };
    return {
      init,
    };
  })(Model, View);
  
  ViewModel.init();