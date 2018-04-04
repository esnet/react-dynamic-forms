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
                this.props.onChange(this.props.name, newValue);
            }
        }

        handleMissingCountChange(i, missingCount) {
            let totalMissingCount;
            let missingList = this.state.missing;
            missingList[i] = missingCount;
            totalMissingCount = _.reduce(missingList, (memo, num) => memo + num, 0);

            // Callback
            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.name, totalMissingCount);
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
                this.props.onErrorCountChange(this.props.name, totalErrorCount);
            }
        }

        // Handle removing an item. Here it splices out the item
        // at the supplied index and updates the list of items on the state.
        //
        // Also updates the error and missing lists to match.
        handleRemovedItem(i) {
            let value = this.props.value;

            let n = 1;
            let errors = this.state.errors;
            let missing = this.state.missing;
            errors.splice(i - n + 1, n);
            missing.splice(i - n + 1, n);
            this.setState({ errors, missing });

            // Callbacks
            if (this.props.onChange) {
                this.props.onChange(this.props.name, value.splice(i - n + 1, n));
            }
            if (this.props.onErrorCountChange) {
                this.props.onErrorCountChange(this.props.name, this.numErrors(errors));
            }
            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.name, this.numMissing(missing));
            }
        }

        handleAddItem() {
            let value = this.props.value;

            let errors = this.state.errors;
            let missing = this.state.missing;
            let created = Immutable.fromJS(ItemComponent.defaultValues);
            errors.push(0);
            missing.push(0);

            // Callbacks
            if (this.props.onChange) {
                this.props.onChange(this.props.name, value.push(created));
            }
            if (this.props.onErrorCountChange) {
                this.props.onErrorCountChange(this.props.name, this.numErrors(errors));
            }
            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.name, this.numMissing(missing));
            }

            this.setState({ selected: this.props.value.size });
        }

        //Determine the total count of missing fields in the entire list
        numMissing(missing) {
            let total = 0;
            _.each(missing, c => {
                total += c;
            });
            return total;
        }

        //Determine the total count of error fields in the entire list
        numErrors(errors) {
            let total = 0;
            _.each(errors, c => {
                total += c;
            });
            return total;
        }

        componentWillReceiveProps(nextProps) {
            if (nextProps.edit === false) {
                this.setState({ selected: null });
            }
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
                    hideMinus: hideEditRemove && index < this.props.value.size - 1,
                    types: this.props.types,
                    options: this.props.options,
                    actions: this.props.actions,
                    onErrorCountChange: (name, errorCount) =>
                        this.handleErrorCountChange(name, errorCount),
                    onMissingCountChange: (name, missingCount) =>
                        this.handleMissingCountChange(name, missingCount),
                    onChange: (name, value) => {
                        this.handleChangeItem(name, value);
                    }
                };
                itemComponents.push(
                    <ItemComponent
                        {...props}
                        value={item}
                        editable={this.props.edit}
                        edit={this.state.selected === index && this.props.edit}
                    />
                );
            });

            const errors = _.find(this.state.errors, item => {
                return item >= 1;
            });
            const missing = _.find(this.state.missing, item => {
                return item >= 1;
            });

            const plusElement = (errors || missing) && hideEditRemove ? <div /> : null;
            const { canAddItems = true, canRemoveItems = true } = this.props;

            return (
                <List
                    items={itemComponents}
                    canAddItems={canAddItems && this.props.edit}
                    canRemoveItems={canRemoveItems && this.props.edit}
                    canEditItems={this.props.edit}
                    hideEditRemove={hideEditRemove}
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
