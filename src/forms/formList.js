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
      let values = this.props.values;
      values[i] = value;

      // Callback
      if (this.props.onChange) {
        console.log("ON CHANGE", this.props.attr, values);
        this.props.onChange(this.props.attr, values);
      }
    }

    // Handle removing an item. Here it splices out the item
    // at the supplied index and updates the list of items on the state.
    //
    // Also updates the error and missing lists to match.
    handleRemovedItem(i) {
      console.log("Removing item", i, this.props);
      let values = this.props.values;
      let n = 1;
      if (this.removeItemCount) {
        n = this.removeItemCount(values[i], i);
      }

      values.splice(i - n + 1, n);

      let errors = this.state.errors;
      let missing = this.state.missing;
      errors.splice(i - n + 1, n);
      missing.splice(i - n + 1, n);

      this.setState({ errors, missing });

      // Callbacks
      if (this.props.onChange) {
        console.log("ON CHANGE", this.props.attr, values);
        this.props.onChange(this.props.attr, values);
      }
      if (this.props.onErrorCountChange) {
        this.props.onErrorCountChange(this.props.attr, this.numErrors());
      }
      if (this.props.onMissingCountChange) {
        this.props.onMissingCountChange(this.props.attr, this.numMissing());
      }
    }

    handleAddItem() {
      let values = this.props.values;
      let errors = this.state.errors;
      let missing = this.state.missing;
      let created = ItemComponent.defaultValues;

      if (!_.isArray(created)) {
        values.push(created);
        errors.push(0);
        missing.push(0);
      } else {
        _.each(created, newItem => {
          values.push(newItem);
          errors.push(0);
          missing.push(0);
        });
      }

      // Callbacks
      if (this.props.onChange) {
        this.props.onChange(this.props.attr, values);
      }
      if (this.props.onErrorCountChange) {
        this.props.onErrorCountChange(this.props.attr, this.numErrors());
      }
      if (this.props.onMissingCountChange) {
        this.props.onMissingCountChange(this.props.attr, this.numMissing());
      }

      this.setState({ selected: values.length - 1 });
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
      const itemComponents = _.map(this.props.values, (item, index) => {
        const { key = index } = item;
        const props = {
          key,
          attr: index,
          onErrorCountChange: (attr, errorCount) =>
            this.handleErrorCountChange(attr, errorCount),
          onMissingCountChange: (attr, missingCount) =>
            this.handleMissingCountChange(attr, missingCount),
          onChange: (attr, value) => {
            this.handleChangeItem(attr, value);
          }
        };
        return (
          <ItemComponent
            {...props}
            values={item}
            edit={this.state.selected === index}
          />
        );
      });

      const canAddItems = this.props.canAddItems || true;
      const canRemoveItems = this.props.canRemoveItems || true;
      const plusElement = null;

      //itemAddElement ? itemAddElement() : null;
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
/*
export default function(params) {
  const { initialItems, createItems, renderItem } = params;
  return React.createClass({
    getInitialState() {
      const initialItems = initialItems();

      let items = [];
      _.each(initialItems, item => {
        if (!_.has(item, "key")) {
          item.key = "key-" + Math.random();
        }
        items.push(item);
      });

      return {
        items,
        // array of items
        errors: [],
        // number of errors
        // required fields that are still not filled out
        missing: []
      };
    },

    //Returns the number of items in the list
    itemCount() {
      return this.state.items.length;
    },

    //Returns the item at the index supplied
    getItem(index) {
      if (index >= 0 && index < this.itemCount()) {
        return this.state.items[index];
      }
    },

    //Handle adding a new item.
    handleAddItem(data) {
      if (!this.createItem) {
        throw new Error(
          "ListEditorMixin requires method createItem() to be defined on the component."
        );
      }

      let items = this.state.items;
      let errors = this.state.errors;
      let missing = this.state.missing;
      let created = this.createItem(data);

      if (!_.isArray(created)) {
        if (!_.has(created, "key")) {
          created.key = "key-" + Math.random();
        }
        items.push(created);
        errors.push(0);
        missing.push(0);
      } else {
        let n = 1;
        _.each(created, newItem => {
          if (!_.has(newItem, "key")) {
            newItem.key = "key-" + Math.random();
            newItem.multiPart = n;
          }
          items.push(newItem);
          errors.push(0);
          missing.push(0);
          n++;
        });
      }

      // Set state
      this.setState({ items, errors, missing });

      // Callbacks
      if (this.props.onChange) {
        this.props.onChange(this.props.attr, items);
      }
      if (this.props.onErrorCountChange) {
        this.props.onErrorCountChange(this.props.attr, this.numErrors());
      }
      if (this.props.onMissingCountChange) {
        this.props.onMissingCountChange(
          this.props.attr,
          this.numMissing()
        );
      }
    },

    // Handle removing an item. Here it splices out the item
    // at the supplied index and updates the list of items on the state.
    //
    // Also updates the error and missing lists to match.
    handleItemRemoved(i) {
      let items = this.state.items;
      let n = 1;
      if (this.removeItemCount) {
        n = this.removeItemCount(items[i], i);
      }

      items.splice(i - n + 1, n);

      let errors = this.state.errors;
      let missing = this.state.missing;
      errors.splice(i - n + 1, n);
      missing.splice(i - n + 1, n);

      this.setState({ items, errors, missing });

      // Callbacks
      if (this.props.onChange) {
        this.props.onChange(this.props.attr, items);
      }
      if (this.props.onErrorCountChange) {
        this.props.onErrorCountChange(this.props.attr, this.numErrors());
      }
      if (this.props.onMissingCountChange) {
        this.props.onMissingCountChange(
          this.props.attr,
          this.numMissing()
        );
      }
    },

    //Handle an item at i changing to a new value.
    handleItemChanged(i, value) {
      let items = this.state.items;
      items[i] = value;

      this.setState({ items });

      // Callback
      if (this.props.onChange) {
        this.props.onChange(this.props.attr, items);
      }
    },

    //Handler for if a child changes its missing count
    handleMissingCountChange(i, missingCount) {
      let totalMissingCount;
      let missingList = this.state.missing;

      missingList[i] = missingCount;

      this.setState({ missing: missingList });

      totalMissingCount = _.reduce(missingList, (memo, num) => memo + num, 0);

      // Callback
      if (this.props.onMissingCountChange) {
        this.props.onMissingCountChange(this.props.attr, totalMissingCount);
      }
    },
    //Handler for if a child changes its error count
    handleErrorCountChange(i, errorCount) {
      let totalErrorCount;
      let errorList = this.state.errors;
      errorList[i] = errorCount;
      totalErrorCount = _.reduce(errorList, (memo, num) => memo + num, 0);

      // Callback
      if (this.props.onErrorCountChange) {
        this.props.onErrorCountChange(this.props.attr, totalErrorCount);
      }
    },
    render() {
      let components = [];
      _.each(this.state.items, (item, index) => {
        const component = this.renderItem(item, index);
        const key = item.key;
        const id = item.id;
        if (component) {
          const props = {
            key,
            index,
            id,
            onErrorCountChange: this.handleErrorCountChange,
            onMissingCountChange: this.handleMissingCountChange,
            onChange: this.handleItemChanged
          };
          components.push(React.cloneElement(component, props));
        }
      });

      const canAddItems = _.has(this.state, "canAddItems")
        ? this.state.canAddItems
        : true;
      const canRemoveItems = _.has(this.state, "canRemoveItems")
        ? this.state.canRemoveItems
        : true;
      const plusElement = _.has(this, "plusUI") ? this.plusUI() : null;

      return (
        <ListEditView
          items={components}
          canAddItems={canAddItems}
          canRemoveItems={canRemoveItems}
          plusWidth={400}
          plusElement={plusElement}
          onAddItem={this.handleAddItem}
          onRemoveItem={this.handleItemRemoved}
        />
      );
    },

    //Determine the total count of missing fields in the entire list
    numMissing() {
      const counts = this.state.missingCounts;
      let total = 0;
      _.each(counts, c => {
        total += c;
      });
      return total;
    },
  
    //Determine the total count of error fields in the entire list
    numErrors() {
      const counts = this.state.errorCounts;
      let total = 0;
      _.each(counts, c => {
        total += c;
      });
      return total;
    }
  });
}
*/
