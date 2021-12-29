import { useReducer } from 'react';
import './styles.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  OPERATION: 'operation',
  DELETE_DIGIT: 'delete-digit',
  EQUAL: 'equal'
}

function reducer(state, {type, payload}) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentInput: payload.digit,
          overwrite: false
        }
      }
      if (payload.digit === '0' && state.currentInput === '0') {
        return state;
      }
      if (payload.digit === '.' && state.currentInput.includes('.')) {
        return state;
      }
      
      return {
        ...state,
        currentInput: `${state.currentInput || ""}${payload.digit}`
      };
    case ACTIONS.OPERATION:
      if (state.currentInput == null && state.previousInput == null) {
        return state;
      }
      if (state.currentInput == null) return {
        ...state,
        operation: payload.operation
      }
      if (state.previousInput == null) { 
        return {
          ...state,
          operation: payload.operation,
          previousInput: state.currentInput,
          currentInput: null
        }
      }

      return {
        ...state,
        previousInput: evaluate(state),
        operation: payload.operation,
        currentInput: null
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentInput: null,
          overwrite: false
        }
      }
      if (state.currentInput == null) {
        return state;
      }
      if (state.currentInput.length === 1) {
          return {
          ...state,
          currentInput: null
        }
      }

      return {
        ...state,
        currentInput: state.currentInput.slice(0, -1)
      }
    case ACTIONS.EQUAL:
      if (state.currentInput == null || state.previousInput == null || state.operation == null) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousInput: null,
        operation: null,
        currentInput: evaluate(state)
      }
    default:
      return state;
  }
}

function evaluate({previousInput, currentInput, operation}) {
  const prev = parseFloat(previousInput);
  const curr = parseFloat(currentInput);
  if (isNaN(prev) || isNaN(curr)) {
    return "";
  }
  let computation = "";
  switch(operation) {
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "*":
      computation = prev * curr;
      break;
    case "÷":
      computation = prev / curr;
      break;
    default:
      return "";
  }

  return computation.toString();
}

const FORMATTER = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0
})

function formatInput(input) {
  if (input == null) return "";
  const [int, dec] = input.split('.');
  if (dec == null) return FORMATTER.format(int);
  return `${FORMATTER.format(int)}.${dec}`;
}

function App() {
  const [{ currentInput, previousInput, operation }, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-input">{formatInput(previousInput)} {operation}</div>
        <div className="current-input">{formatInput(currentInput)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch}/>
      <DigitButton digit="1" dispatch={dispatch}/>
      <DigitButton digit="2" dispatch={dispatch}/>
      <DigitButton digit="3" dispatch={dispatch}/>
      <OperationButton operation="*" dispatch={dispatch}/>
      <DigitButton digit="4" dispatch={dispatch}/>
      <DigitButton digit="5" dispatch={dispatch}/>
      <DigitButton digit="6" dispatch={dispatch}/>
      <OperationButton operation="-" dispatch={dispatch}/>
      <DigitButton digit="7" dispatch={dispatch}/>
      <DigitButton digit="8" dispatch={dispatch}/>
      <DigitButton digit="9" dispatch={dispatch}/>
      <OperationButton operation="+" dispatch={dispatch}/>
      <DigitButton digit="." dispatch={dispatch}/>
      <DigitButton digit="0" dispatch={dispatch}/>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EQUAL })}>=</button>
    </div>
  );
}

export default App;
