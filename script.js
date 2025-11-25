// Select elements
const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const allClearButton = document.querySelector("[data-all-clear]");
const deleteButton = document.querySelector("[data-delete]");
const prevOperandTextElement = document.getElementById("prev-operand");
const currOperandTextElement = document.getElementById("curr-operand");

class Calculator {
  constructor(prevTextElement, currTextElement) {
    this.prevTextElement = prevTextElement;
    this.currTextElement = currTextElement;
    this.clear();
  }

  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
    this.updateDisplay();
  }

  delete() {
    if (this.currentOperand.length === 1) {
      this.currentOperand = "0";
    } else {
      this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }
    this.updateDisplay();
  }

  appendNumber(number) {
    number = number.toString().trim(); // in case ". " from HTML
    if (number === "." && this.currentOperand.includes(".")) return;

    if (this.currentOperand === "0" && number !== ".") {
      this.currentOperand = number;
    } else {
      this.currentOperand = this.currentOperand.toString() + number;
    }
    this.updateDisplay();
  }

  chooseOperation(operation) {
    if (this.currentOperand === "" && this.previousOperand === "") return;

    // If user presses operation again, compute existing result first
    if (this.previousOperand !== "" && this.currentOperand !== "") {
      this.compute();
    } else {
      this.previousOperand = this.currentOperand;
    }

    this.operation = operation;
    this.currentOperand = "";
    this.updateDisplay();
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev)) return;

    // Allow cases like "5 +" then "=" (use prev only)
    const secondValue = isNaN(current) ? prev : current;

    switch (this.operation) {
      case "+":
        computation = prev + secondValue;
        break;
      case "-":
        computation = prev - secondValue;
        break;
      case "*":
        computation = prev * secondValue;
        break;
      case "/":
        computation = secondValue === 0 ? "Error" : prev / secondValue;
        break;
      case "%":
        computation = (prev * secondValue) / 100;
        break;
      default:
        computation = secondValue;
    }

    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = "";
    this.updateDisplay();
  }

  formatNumber(numStr) {
    if (numStr === "Error") return numStr;

    const [integerPart, decimalPart] = numStr.split(".");
    const integerDisplay = Number(integerPart).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });

    if (decimalPart != null && decimalPart !== "") {
      return `${integerDisplay}.${decimalPart}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currTextElement.textContent = this.formatNumber(
      this.currentOperand.toString()
    );

    if (this.operation != null && this.previousOperand !== "") {
      this.prevTextElement.textContent = `${this.formatNumber(
        this.previousOperand.toString()
      )} ${this.operation}`;
    } else {
      this.prevTextElement.textContent = "";
    }
  }
}

// Initialize calculator
const calculator = new Calculator(
  prevOperandTextElement,
  currOperandTextElement
);

// Button events
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.textContent);
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.dataset.operation);
  });
});

equalsButton.addEventListener("click", () => {
  calculator.compute();
});

allClearButton.addEventListener("click", () => {
  calculator.clear();
});

deleteButton.addEventListener("click", () => {
  calculator.delete();
});

// Optional: keyboard support
window.addEventListener("keydown", (e) => {
  if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
    calculator.appendNumber(e.key);
  }

  if (["+", "-", "*", "/"].includes(e.key)) {
    calculator.chooseOperation(e.key);
  }

  if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    calculator.compute();
  }

  if (e.key === "Backspace") {
    calculator.delete();
  }

  if (e.key.toLowerCase() === "c") {
    calculator.clear();
  }
});
