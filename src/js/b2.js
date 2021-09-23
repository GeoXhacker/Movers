export const initialState = {
  num: 40,
};

export const b2Reducer = (state = initialState, action) => {
  switch (action.type) {
    case "num/add": //naming convension name of slice followed by what its gon do
      return { ...state, num: state.num + 1 }; // what to do on dispatching action to store; ensure that u dont change the state directly; make a copy and modify that
    case "num/reduce":
      return { ...state, num: state.num - 1 };

    default:
      return state;
  }
};
export const selectNum = (state) => {
  return state.num;
};
