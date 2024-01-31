// DOM Element Call Here
const addMatchBtn = document.getElementById("add-match-btn");
const allMatchContainers = document.getElementById("all-match-containers");
const resetBtn = document.getElementById("reset-btn");
const totalField = document.getElementById("total-field");

const INCREMENT = "increment";
const DECREMENT = "decrement";
const RESET = "reset";

// Increment Action
const increment = (value, matchId) => {
  return {
    type: INCREMENT,
    payload: { value, matchId },
  };
};

// Decrement Action
const decrement = (value, matchId) => {
  return {
    type: DECREMENT,
    payload: { value, matchId },
  };
};

// Reset Action
const reset = () => {
  return {
    type: RESET,
  };
};

// Initial State
const initialState = {
  matches: [{ id: 1, name: "Match 1", value: 0 }],
};

// Sum Reducer
const sumReducer = (state = initialState, action) => {
  if (action.type === INCREMENT) {
    const { value, matchId } = action.payload;
    if (isNaN(value)) {
      alert("please input a number");
      return state;
    }

    return {
      ...state,
      matches: state.matches.map((match) =>
        match.id === matchId ? { ...match, value: match.value + value } : match
      ),
    };
  } else if (action.type === DECREMENT) {
    const { value, matchId } = action.payload;

    const totalValue = state.matches.reduce(
      (total, match) => total + match.value,
      0
    );

    if(isNaN (value)){
      alert('please input a number')
      return state;
    }

    if (value > totalValue) {
      alert("This number grater than total score");
      return state;
    } else {
      return {
        ...state,
        matches: state.matches.map((match) =>
          match.id === matchId
            ? { ...match, value: match.value - value }
            : match
        ),
      };
    }
  } else if (action.type === "ADD_MATCH") {
    return {
      ...state,
      matches: [...state.matches, action.payload],
    };
  } else if (action.type === RESET) {
    return {
      ...state,
      matches: state.matches.map((match) => ({ ...match, value: 0 })),
    };
  } else {
    return state;
  }
};

// Create Store
const store = Redux.createStore(sumReducer);

// const getTotalValue = () => {
//   const state = store.getState();
//   const totalValue = state.matches.reduce((total, match) => total + match.value, 0);
//   return totalValue;
// };

const render = () => {
  const state = store.getState();
  allMatchContainers.innerHTML = "";

  state.matches.forEach((match) => {
    const div = document.createElement("div");
    div.classList.add("match");
    div.innerHTML = `
            <div class="wrapper">
                <button class="lws-delete">
                    <img src="./image/delete.svg" alt="" />
                </button>
                <h3 class="lws-matchName">${match.name}</h3>
            </div>
            <div class="inc-dec">
                <form class="incrementForm">
                    <h4>Increment</h4>
                    <input onkeydown="incrementHandler(event, ${match.id})" type="number" name="increment" class="lws-increment" />
                </form>
                <form class="decrementForm">
                    <h4>Decrement</h4>
                    <input onkeydown="decrementHandler(event, ${match.id})" type="number" name="decrement" class="lws-decrement" />
                </form>
            </div>
            <div class="numbers">
                <h2 id="total-field" class="lws-singleResult">${match.value}</h2>
            </div>
        `;

    allMatchContainers.appendChild(div);
  });
};

render();
store.subscribe(render);

// Add Match Handler
addMatchBtn.addEventListener("click", () => {
  const currentState = store.getState();
  const newMatch = {
    id: currentState.matches.length + 1,
    name: `Match ${currentState.matches.length + 1}`,
    value: 0,
  };
  store.dispatch({ type: "ADD_MATCH", payload: newMatch });
});

// Increment Handler
const incrementHandler = (event, matchId) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const incrementValue = parseFloat(event.target.value);
    store.dispatch(increment(incrementValue, matchId));
    event.target.value = "";
  }
};
// Decrement Handler
const decrementHandler = (event, matchId) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const decrementValue = parseFloat(event.target.value);
    store.dispatch(decrement(decrementValue, matchId));
    event.target.value = "";
  }
};
// State Reset Handler
resetBtn.addEventListener("click", () => {
  store.dispatch(reset());
});
