import React from "react";
import formGroup from "../formGroup";

class View extends React.Component {
  render() {
    console.log(this.props)
	const text=this.props.value
	const view = this.props.view;
	let color = "inherited";
    let background = "inherited";
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