/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import _ from "underscore";
import { Creatable } from "react-select";

import formGroup from "../formGroup";
import "react-select/dist/react-select.css";

/**
 * Form control to select tags from a pull down list.
 * You can also add a new tag with the Add tag button.
 */
class TagsEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: this.props.value || [],
      tagList: this.props.tagList || [],
      showNewTagUI: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tags: nextProps.value || [],
      tagList: nextProps.tagList || []
    });
  }

  handleChange(val, tagList) {
    const tags = _.unique(_.map(tagList, tag => tag.label));

    let updatedTagList = this.state.tagList;
    _.each(tags, tag => {
      if (_.indexOf(updatedTagList, tag) === -1) {
        updatedTagList.push(tag);
      }
    });

    this.setState({ tags, tagList: updatedTagList });
    if (this.props.onChange) {
      this.props.onChange(this.props.name, tags);
    }
  }

  isEmpty(value) {
    if (_.isArray(value)) {
      return value.length === 0;
    }
    return _.isNull(value) || _.isUndefined(value);
  }

  isMissing() {
    console.log(
      "chooser isMissing",
      this.props.name,
      this.props.required,
      this.props.disabled,
      this.isEmpty(this.state.value),
      this.state.value
    );
    return this.props.required &&
      !this.props.disabled &&
      this.isEmpty(this.state.value);
  }

  render() {
    if (this.props.edit) {
      console.log("Edit render", this.state.tags);
      let className = "";

      const options = _.map(this.state.tagList, (tag, index) => {
        let disabled = false;
        if (_.has(this.state.tags, tag)) {
          disabled = true;
        }
        return { value: index, label: tag, disabled };
      });

      console.log("Tags", options);

      if (_.isUndefined(this.state.tags) || _.isUndefined(this.state.tagList)) {
        let err = `Tags was supplied with bad state: name is ${this.props.name}`;
        err += ` (tags are: ${this.state.tags} and tagList is: ${this.state.tagList})`;
        throw new Error(err);
      }

      const key = `${this.state.tags.join("-")}--${this.state.tagList.join(
        "-"
      )}`;

      return (
        <div className={className}>
          <Creatable
            key={key}
            multi={true}
            disabled={this.props.disabled}
            placeholder="Select tags..."
            value={this.state.tags}
            allowCreate={true}
            options={options}
            onChange={this.handleChange}
          />
          <div className="help-block" />
        </div>
      );
    } else {
      return <div>{this.state.tags.join(", ")}</div>;
    }
  }
}

export default formGroup(TagsEdit);
