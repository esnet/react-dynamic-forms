import React from "react";
import formGroup from "../formGroup";

class View extends React.Component {
  render() {
	const text=this.props.value
	const view = this.props.view;
	let color = "";
    let background = "";
	const style = {
    color,
    background,
    height: 23,
    width: "100%",
    paddingLeft: 3
  };
	if (!view) {
	  return <div style={style}>{text}</div>;
    } else {
      return view(text)
    }
  }
}

export default formGroup(View, true);