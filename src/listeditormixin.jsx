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
import cloneWithProps from "react-clonewithprops";
import ListEditView from "./listeditview";

/**
 * A helper mixin to keep track of lists of values, missing values and error counts
 * in a ListEditor.
 *
 * To use, in the ListEditor, define functions:
 *     - initialItems() to return the initial list of items
 *     - createItem() to create a new item
 *     - renderItem() to render a new item
 */
export default {

    getInitialState() {
        if (!this.initialItems) {
            throw new Error("ListEditorMixin requires method initialItems() to be defined on the component.");
        }

        const initialItems = this.initialItems();

        let items = [];
        _.each(initialItems, (item) => {
            if (!_.has(item, "key")) {
                item.key = "key-" + Math.random();
            }
            items.push(item);
        });

        return {
            items: items,  // array of items
            errors: [],    // number of errors
            missing: []    // required fields that are still not filled out
        };
    },

    /**
     * Returns the number of items in the list
     */
    itemCount() {
        return this.state.items.length;
    },

    /**
     * Returns the item at the index supplied
     */
    getItem(index) {
        if (index >= 0 && index < this.itemCount()) {
            return this.state.items[index];
        }
    },

    /**
     * Handle adding a new item.
     */
    handleAddItem(data) {

        if (!this.createItem) {
            throw new Error("ListEditorMixin requires method createItem() to be defined on the component.");
        }

        let items = this.state.items;
        let errorList = this.state.errors;
        let missingList = this.state.missing;
        let created = this.createItem(data);

        if (!_.isArray(created)) {
            if (!_.has(created, "key")) {
                created.key = "key-" + Math.random();
            }
            items.push(created);
            errorList.push(0);
            missingList.push(0);
        } else {
            var n = 1;
            _.each(created, (newItem) => {
                if (!_.has(newItem, "key")) {
                    newItem.key = "key-" + Math.random();
                    newItem.multiPart = n;
                }
                items.push(newItem);
                errorList.push(0);
                missingList.push(0);
                n++;
            });
        }

        // Set state
        this.setState({items: items,
                       errors: errorList,
                       missing: missingList});

        // Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, items);
        }
        if (this.props.onErrorCountChange) {
            this.props.onErrorCountChange(this.props.attr, this._totalErrorCounts());
        }
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr, this._totalMissingCounts());
        }
    },

    /**
     * Handle removing an item. Here it splices out the item
     * at the supplied index and updates the list of items on the state.
     *
     * Also updates the error and missing lists to match.
     */
    handleItemRemoved(i) {
        let items = this.state.items;
        let n = 1;
        if (this.removeItemCount) {
            n = this.removeItemCount(items[i], i);
        }

        items.splice(i - n + 1, n);

        let errorList = this.state.errors;
        let missingList = this.state.missing;
        errorList.splice(i - n + 1, n);
        missingList.splice(i - n + 1, n);

        this.setState({items: items,
                       errors: errorList,
                       missing: missingList});

        // Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, items);
        }
        if (this.props.onErrorCountChange) {
            this.props.onErrorCountChange(this.props.attr, this._totalErrorCounts());
        }
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr, this._totalMissingCounts());
        }
    },

    /**
     * Handle an item at i changing to a new value.
     */
    handleItemChanged(i, value) {
        let items = this.state.items;
        items[i] = value;

        this.setState({items: items});

        // Callback
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, items);
        }
    },

    /**
     * Handler for if a child changes its missing count
     */
    handleMissingCountChange(i, missingCount) {
        let totalMissingCount;
        let missingList = this.state.missing;

        missingList[i] = missingCount;

        this.setState({missing: missingList});

        totalMissingCount = _.reduce(missingList, (memo, num) => memo + num, 0);

        // Callback
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr, totalMissingCount);
        }
    },

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
            this.props.onErrorCountChange(this.props.attr, totalErrorCount);
        }
    },

    render() {
        let components = [];
        _.each(this.state.items, (item, index) => {
            var component = this.renderItem(item, index);
            if (component) {
                const props = {key: item.key,
                               index: index,
                               id: item.id,
                               onErrorCountChange: this.handleErrorCountChange,
                               onMissingCountChange: this.handleMissingCountChange,
                               onChange: this.handleItemChanged};
                components.push(cloneWithProps(component, props));
            }
        });

        const canAddItems = _.has(this.state, "canAddItems") ? this.state.canAddItems : true;
        const canRemoveItems = _.has(this.state, "canRemoveItems") ? this.state.canRemoveItems : true;
        const plusElement = _.has(this, "plusUI") ? this.plusUI() : null;

        return (
            <ListEditView items={components}
                          canAddItems={canAddItems}
                          canRemoveItems={canRemoveItems}
                          plusWidth={400}
                          plusElement={plusElement}
                          onAddItem={this.handleAddItem}
                          onRemoveItem={this.handleItemRemoved}/>
        );

    },

    /**
     * Determine the total count of missing fields in the entire list
     */
    _totalMissingCounts() {
        const counts = this.state.missingCounts;
        let total = 0;
        _.each(counts, c => {
            total += c;
        });
        return total;
    },

    /**
     * Determine the total count of error fields in the entire list
     */
    _totalErrorCounts() {
        const counts = this.state.errorCounts;
        let total = 0;
        _.each(counts, (c) => {
            total += c;
        });
        return total;
    },
};
