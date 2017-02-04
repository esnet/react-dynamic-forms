/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import _ from "underscore";
import React from "react";
import Immutable from "immutable";
import List from "./components/List";

/**
 * A Higher-order component -- a function that takes the item
 * Component class and returns a new Component that manages a
 * list of that class.
 */
export default function list(ItemComponent) {
  return class HOC extends React.Component {
    constructor(props) {
      super(props);
      this.state = { errors: [], missing: [], selected: null };
    }

    handleSelectItem(i) {
      if (this.state.selected !== i) {
        this.setState({ selected: i });
      } else {
        this.setState({ selected: null });
      }
    }

    //Handle an item at i changing to a new value.
    handleChangeItem(i, value) {
      let newValue = this.props.value.set(i, value);
      if (this.props.onChange) {
        this.props.onChange(this.props.fieldName, newValue);
      }
    }

    handleMissingCountChange(i, missingCount) {
      let totalMissingCount;
      let missingList = this.state.missing;
      missingList[i] = missingCount;
      totalMissingCount = _.reduce(missingList, (memo, num) => memo + num, 0);

      // Callback
      if (this.props.onMissingCountChange) {
        this.props.onMissingCountChange(
          this.props.fieldName,
          totalMissingCount
        );
      }
    }

    /**
     * Handler for if a child changes its error count
     */
    handleErrorCountChange(i, errorCount) {
      let totalErrorCount;
      let errorList = this.state.errors;
      errorList[i] = errorCount;
      totalErrorCount = _.reduce(errorList, (memo, num) => memo + num, 0);

      // Callback
      if (this.props.onErrorCountChange) {
        this.props.onErrorCountChange(this.props.fieldName, totalErrorCount);
      }
    }

    // Handle removing an item. Here it splices out the item
    // at the supplied index and updates the list of items on the state.
    //
    // Also updates the error and missing lists to match.
    handleRemovedItem(i) {
      let value = this.props.value;
      let n = 1;

      const newValue = value.splice(i - n + 1, n);

      let errors = this.state.errors;
      let missing = this.state.missing;
      errors.splice(i - n + 1, n);
      missing.splice(i - n + 1, n);

      this.setState({ errors, missing });

      // Callbacks
      if (this.props.onChange) {
        this.props.onChange(this.props.fieldName, newValue);
      }
      if (this.props.onErrorCountChange) {
        this.props.onErrorCountChange(this.props.fieldName, this.numErrors());
      }
      if (this.props.onMissingCountChange) {
        this.props.onMissingCountChange(
          this.props.fieldName,
          this.numMissing()
        );
      }
    }

    handleAddItem() {
      let value = this.props.value;
      let errors = this.state.errors;
      let missing = this.state.missing;
      let created = Immutable.fromJS(ItemComponent.defaultValues);

      const newValue = value.push(created);
      errors.push(0);
      missing.push(0);

      // Callbacks
      if (this.props.onChange) {
        this.props.onChange(this.props.fieldName, newValue);
      }
      if (this.props.onErrorCountChange) {
        this.props.onErrorCountChange(this.props.fieldName, this.numErrors());
      }
      if (this.props.onMissingCountChange) {
        this.props.onMissingCountChange(
          this.props.fieldName,
          this.numMissing()
        );
      }

      this.setState({ selected: newValue.size - 1 });
    }

    //Determine the total count of missing fields in the entire list
    numMissing() {
      const counts = this.state.missingCounts;
      let total = 0;
      _.each(counts, c => {
        total += c;
      });
      return total;
    }

    //Determine the total count of error fields in the entire list
    numErrors() {
      const counts = this.state.errorCounts;
      let total = 0;
      _.each(counts, c => {
        total += c;
      });
      return total;
    }

    render() {
      const itemComponents = [];
      this.props.value.forEach((item, index) => {
        const { key = index } = item;
        const props = {
          key,
          name: index,
          edit: this.props.edit,
          innerForm: true,
          onErrorCountChange: (fieldName, errorCount) =>
            this.handleErrorCountChange(fieldName, errorCount),
          onMissingCountChange: (fieldName, missingCount) =>
            this.handleMissingCountChange(fieldName, missingCount),
          onChange: (fieldName, value) => {
            this.handleChangeItem(fieldName, value);
          }
        };
        itemComponents.push(
          <ItemComponent
            {...props}
            value={item}
            editable={this.props.edit}
            edit={this.state.selected === index}
          />
        );
      });

      const canAddItems = this.props.canAddItems || true;
      const canRemoveItems = this.props.canRemoveItems || true;
      const plusElement = null;

      return (
        <List
          items={itemComponents}
          canAddItems={canAddItems}
          canRemoveItems={canRemoveItems}
          plusWidth={400}
          plusElement={plusElement}
          onAddItem={() => this.handleAddItem()}
          onRemoveItem={index => this.handleRemovedItem(index)}
          onSelectItem={index => this.handleSelectItem(index)}
        />
      );
    }
  };
}
