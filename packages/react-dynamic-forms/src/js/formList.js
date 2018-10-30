/**
 *  Copyright (c) 2015 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import _ from "underscore";
import Immutable from "immutable";

import List from "../components/List";

/**
 * A Higher-order component -- a function that takes the item
 * Component class and returns a new Component that manages a
 * list of that class.
 */
export default function list(ItemComponent, hideEditRemove) {
    return class HOC extends React.Component {
        constructor(props) {
            super(props);
            this.errors = [];
            this.missing = [];

            this.state = { selected: null };
        }

        handleSelectItem(i) {
            if (this.state.selected !== i) {
                this.setState({ selected: i, oldValue: this.props.value.get(i) });
            } else {
                this.setState({ selected: null, oldValue: null });
            }
        }

        handleRevertItem(i) {
            const oldValue = this.state.oldValue;
            if (oldValue) {
                const newValue = this.props.value.set(i, oldValue);
                if (this.props.onChange) {
                    this.props.onChange(this.props.name, newValue);
                }
            } else {
                this.handleRemovedItem(i);
            }
        }

        //Handle an item at i changing to a new value.
        handleChangeItem(i, value) {
            let newValue = this.props.value.set(i, value);
            if (this.props.onChange) {
                this.props.onChange(this.props.name, newValue);
            }
        }

        handleMissingCountChange(i, missingCount) {
            if (i >= this.props.value.size) {
                return;
            }

            // Mutate our missing count
            this.missing[i] = missingCount;

            // Callback
            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.name, this.numMissing());
            }
        }

        /**
         * Handler for if a child changes its error count
         */
        handleErrorCountChange(i, errorCount) {
            // Mutate our error count
            this.errors[i] = errorCount;

            // Callback
            if (this.props.onErrorCountChange) {
                this.props.onErrorCountChange(this.props.name, this.numErrors());
            }
        }

        // Handle removing an item. Here it splices out the item
        // at the supplied index and updates the list of items on the state.
        //
        // Also updates the error and missing lists to match.
        handleRemovedItem(i) {
            let value = this.props.value;

            let n = 1;
            this.errors.splice(i - n + 1, n);
            this.missing.splice(i - n + 1, n);

            // Callbacks
            if (this.props.onChange) {
                this.props.onChange(this.props.name, value.splice(i - n + 1, n));
            }

            if (this.props.onErrorCountChange) {
                this.props.onErrorCountChange(this.props.name, this.numErrors());
            }
            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.name, this.numMissing());
            }
        }

        handleAddItem() {
            let value = this.props.value;
            let created = Immutable.fromJS(ItemComponent.defaultValues);
            this.errors.push(0);
            this.missing.push(0);

            // Callbacks
            if (this.props.onChange) {
                this.props.onChange(this.props.name, value.push(created));
            }

            this.setState({ selected: this.props.value.size });
        }

        /**
         * Utility function to determine the total count of missing fields in the entire list
         */
        numMissing() {
            let total = 0;
            _.each(this.missing, c => {
                total += c;
            });
            return total;
        }

        /**
         * Utility function to determine the total number of errors in the entire list
         */
        numErrors() {
            let total = 0;
            _.each(this.errors, c => {
                total += c;
            });
            return total;
        }

        render() {
            const selected = this.state.selected;
            const itemComponents = [];
            this.props.value.forEach((item, index) => {
                const { key = index } = item;

                const itemInitialValue = this.props.initialValue
                    ? this.props.initialValue.get(index)
                    : null;

                const props = {
                    key,
                    name: index,
                    innerForm: true,
                    hideMinus: hideEditRemove && index < this.props.value.size - 1,
                    types: this.props.types,
                    options: this.props.options,
                    actions: this.props.actions,
                    onErrorCountChange: (index, errorCount) =>
                        this.handleErrorCountChange(index, errorCount),
                    onMissingCountChange: (index, missingCount) =>
                        this.handleMissingCountChange(index, missingCount),
                    onChange: (index, value) => this.handleChangeItem(index, value)
                };
                itemComponents.push(
                    <ItemComponent
                        {...props}
                        value={item}
                        initialValue={itemInitialValue}
                        editable={this.props.edit}
                        edit={index === selected}
                    />
                );
            });

            const hasErrors = _.find(this.errors, item => item >= 1);
            const hasMissing = _.find(this.missing, item => item >= 1);

            const plusElement = (hasErrors || hasMissing) && hideEditRemove ? <div /> : null;
            const { canAddItems = true, canRemoveItems = true } = this.props;

            const canCommitItem = !_.isNull(selected)
                ? this.errors[selected] === 0 && this.missing[selected] === 0
                : false;

            return (
                <List
                    items={itemComponents}
                    header={ItemComponent.header}
                    buttonIndent={ItemComponent.actionButtonIndex}
                    canAddItems={canAddItems}
                    canRemoveItems={canRemoveItems}
                    canEditItems={true}
                    hideEditRemove={hideEditRemove}
                    plusWidth={400}
                    plusElement={plusElement}
                    canCommitItem={canCommitItem}
                    onAddItem={() => this.handleAddItem()}
                    onRemoveItem={index => this.handleRemovedItem(index)}
                    onSelectItem={index => this.handleSelectItem(index)}
                    onRevertItem={index => this.handleRevertItem(index)}
                />
            );
        }
    };
}
