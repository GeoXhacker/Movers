import { Block, Button, Page } from "framework7-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
// import { selectNumber } from "./store_redux";
import { store } from "./store_redux";
import { selectNumber } from "./reduxSlice";
import { selectNum } from "./b2";
import { selectRedux } from "./store_redux";

export default function Redux() {
  let dispatch = useDispatch();
  let number = useSelector(selectNumber);
  let num = useSelector(selectNum);
  let reduxNum = useSelector(selectRedux);
  let fill = useSelector(selectNumber);

  return (
    <Page>
      <Block strong>
        <Button
          fill
          onClick={() => {
            console.log(number);
            dispatch({
              type: "number/add",
              // payload: [],
            });
          }}
        >
          Button
        </Button>
        <Button
          outline
          onClick={() =>
            dispatch({
              type: "num/add",
              // payload: [],
            })
          }
        >
          Button2
        </Button>
        <p>you clicked {reduxNum}</p>
        <p>here clicked button {store.getState().b2Reducer.num}</p>
      </Block>
    </Page>
  );
}
