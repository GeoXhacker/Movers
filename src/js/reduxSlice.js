export const initialState = {
  number: 25,
  moveOrders: [],
};

export const reduxReducer = (redux = initialState, action) => {
  switch (action.type) {
    case "number/add": //naming convension name of slice followed by what its gon do
      return { ...redux, number: redux.number + 1 }; // what to do on dispatching action to store; ensure that u dont change the state directly; make a copy and modify that
    case "number/reduce":
      return { ...redux, number: redux.number - 1 };
    case "moveOrders/add":
      return { ...redux, moveOrders: [...redux.moveOrders, action.payload] };

    default:
      return redux;
  }
};
export const selectNumber = (initialState) => {
  return initialState.number;
};
