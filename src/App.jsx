import React, { useEffect, useRef, useReducer } from "react";

const initialState = {
  current: "",
  previous: "",
  operator: null,
  isCalculated: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_NUMBER":
      if (state.isCalculated) {
        return {
          ...state,
          current: action.payload,
          isCalculated: false,
        };
      }
      return {
        ...state,
        current: state.current + action.payload,
      };

    case "SET_OPERATOR":
      if (!state.current && state.previous) {
        return {
          ...state,
          operator: action.payload,
        };
      }

      if (!state.current) return state;

      if (state.previous && state.operator) {
        const a = Number(state.previous);
        const b = Number(state.current);
        let result;

        switch (state.operator) {
          case "+":
            result = a + b;
            break;
          case "-":
            result = a - b;
            break;
          case "*":
            result = a * b;
            break;
          case "/":
            result = b !== 0 ? a / b : "Error";
            break;
          default:
            return state;
        }

        return {
          previous: result.toString(),
          current: "",
          operator: action.payload,
        };
      }

      return {
        previous: state.current,
        current: "",
        operator: action.payload,
      };
    case "PERCENT":
      return {
        ...state,
        current: (Number(state.current) / 100).toString(),
      };

    case "TOGGLE_SIGN":
      if (!state.current) return state;

      return {
        ...state,
        current: state.current.startsWith("-")
          ? state.current.slice(1)
          : "-" + state.current,
      };

    case "CLEAR":
      return {
        current: "",
        previous: "",
        operator: null,
      };
    case "DELETE":
      return {
        ...state,
        current: state.current.slice(0, -1),
      };

    case "CALCULATE":
      if (!state.previous || !state.current) return state;

      const a = Number(state.previous);
      const b = Number(state.current);
      let result;
      switch (state.operator) {
        case "+":
          result = a + b;
          break;
        case "-":
          result = a - b;
          break;
        case "*":
          result = a * b;
          break;
        case "/":
          result = b !== 0 ? a / b : "Error";
          break;
        case "%":
          break;
        default:
          return state;
      }
      return {
        current: result.toString(),
        previous: "",
        operator: null,
        isCalculated: true,
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const displayRef = useRef(null);
  const intervalRef = useRef(null);

  const startDelete = () => {
    dispatch({ type: "DELETE" });

    intervalRef.current = setInterval(() => {
      dispatch({ type: "DELETE" });
    }, 300);
  };

  const stopDelete = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = displayRef.current.scrollWidth;
    }
  }, [state]);

  return (
    <div className="w-full flex flex-col gap-2.5 justify-end items-center h-screen pb-10 overflow-x-auto whitespace-nowrap hide-scroll">
      {" "}
      <div
        ref={displayRef}
        className="w-[320px] text-white text-right pr-4 overflow-x-auto whitespace-nowrap hide-scroll transition-all duration-300"
        style={{
          fontSize:
            (state.previous && state.operator
              ? (state.previous + state.operator + state.current).length
              : state.current.length) > 12
              ? "32px"
              : (state.previous && state.operator
                    ? (state.previous + state.operator + state.current).length
                    : state.current.length) > 9
                ? "48px"
                : "64px",
        }}
      >
        {state.previous && state.operator
          ? state.previous + state.operator + state.current
          : state.current || "0"}
      </div>
      <div className="flex gap-2.5">
        <button
          onMouseDown={startDelete}
          onMouseUp={stopDelete}
          onMouseLeave={stopDelete}
          onTouchStart={startDelete}
          onTouchEnd={stopDelete}
        >
          {state.isCalculated ? "AC" : "⌫"}
        </button>
        <button id="fristBtn" onClick={() => dispatch({ type: "TOGGLE_SIGN" })}>
          ±
        </button>
        <button id="fristBtn" onClick={() => dispatch({ type: "PERCENT" })}>
          %
        </button>
        <button
          id="lastBtn"
          onClick={() => dispatch({ type: "SET_OPERATOR", payload: "/" })}
        >
          ÷
        </button>
      </div>
      <div className="flex gap-2.5">
        <button onClick={() => dispatch({ type: "ADD_NUMBER", payload: "7" })}>
          7
        </button>
        <button onClick={() => dispatch({ type: "ADD_NUMBER", payload: "8" })}>
          8
        </button>
        <button onClick={() => dispatch({ type: "ADD_NUMBER", payload: "9" })}>
          9
        </button>
        <button
          id="lastBtn"
          onClick={() => dispatch({ type: "SET_OPERATOR", payload: "*" })}
        >
          ×
        </button>
      </div>
      <div className="flex gap-2.5">
        <button onClick={() => dispatch({ type: "ADD_NUMBER", payload: "4" })}>
          4
        </button>
        <button onClick={() => dispatch({ type: "ADD_NUMBER", payload: "5" })}>
          5
        </button>
        <button onClick={() => dispatch({ type: "ADD_NUMBER", payload: "6" })}>
          6
        </button>
        <button
          id="lastBtn"
          onClick={() => dispatch({ type: "SET_OPERATOR", payload: "-" })}
        >
          -
        </button>
      </div>
      <div className="flex gap-2.5">
        <button onClick={() => dispatch({ type: "ADD_NUMBER", payload: "1" })}>
          1
        </button>
        <button onClick={() => dispatch({ type: "ADD_NUMBER", payload: "2" })}>
          2
        </button>
        <button onClick={() => dispatch({ type: "ADD_NUMBER", payload: "3" })}>
          3
        </button>
        <button
          id="lastBtn"
          onClick={() => dispatch({ type: "SET_OPERATOR", payload: "+" })}
        >
          +
        </button>
      </div>
      <div className="flex gap-2.5">
        <button
          id="zero"
          onClick={() => dispatch({ type: "ADD_NUMBER", payload: "0" })}
        >
          0
        </button>
        <button onClick={() => dispatch({ type: "ADD_NUMBER", payload: "." })}>
          .
        </button>
        <button id="lastBtn" onClick={() => dispatch({ type: "CALCULATE" })}>
          =
        </button>
      </div>
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white rounded-full opacity-80"></div>
    </div>
  );
};

export default App;
