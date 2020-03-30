/**
 *  Copyright (c) 2015 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import Immutable from "immutable";
import _ from "lodash";
import React, { ComponentType } from "react";
import { FieldValue } from "../components/Form";
import List from "../components/List";

// Each item in the list will be passed these props, so the component for each
// item should be a something like a FunctionalComponent<ListItemProps> to be
// accepted as an argument into this list HOC.
export interface ListItemProps {
    key: string;
    name: string;
    innerForm: boolean;
    hideMinus: boolean; // Hide the remove item [-] sign from this item
    types: any;
    value: Immutable.Map<string, FieldValue>;
    initialValue?: Immutable.Map<string, FieldValue>;
    editable: boolean;
    edit: boolean;
    onErrorCountChange: (name: string, errorCount: number) => void;
    onMissingCountChange: (name: string, missingCOunt: number) => void;
    onChange: (name: string, value: Immutable.Map<string, FieldValue>) => void;
}

export interface ListManagerProps {
    name: string;
    // The value of the field is a list of objects, each object it one
    // item in the list. Each object is a map of string to fieldvalue.
    initialValue: Immutable.List<Immutable.Map<string, FieldValue>>;
    value: Immutable.List<Immutable.Map<string, FieldValue>>;
    edit: boolean;
    types: any;
    canAddItems: boolean;
    canRemoveItems: boolean;
    onChange: (fieldName: string, value: Immutable.List<Immutable.Map<string, FieldValue>>) => void;
    onMissingCountChange: (fieldName: string, missingCount: number) => void;
    onErrorCountChange: (fieldName: string, errorCount: number) => void;
}

export interface ListManagerState {
    selected: number | null; // The index of the currently selected list item
    oldValue?: Immutable.Map<string, FieldValue>; // The previous values of the list item
}

/**
 * A Higher-order component -- a function that takes the item Component class and returns a new
 * Component (the ListManager) that manages a list of those components.
 */
export function formList(
    ItemComponent: ComponentType<ListItemProps>,
    hideEditRemove: boolean,
    itemButtonIndent: number,
    initialItemValue: Immutable.Map<string, FieldValue>
) {
    return class ListManager extends React.Component<ListManagerProps, ListManagerState> {
        errors: number[]; // For each item in the list, a count of errors
        missing: number[]; // For each item in the list, a count of missing field values

        constructor(props: ListManagerProps) {
            super(props);

            // Storage of errors and missing field counts at the list level. These are updated
            // from the items via the handleErrorCountChange and handleMissingCountChange
            // callbacks passed into each item
            this.errors = [];
            this.missing = [];

            // Initial state
            this.state = { selected: null, oldValue: undefined };
        }

        // Handle a new item being selected
        handleSelectItem(i: number | null) {
            if (i !== null && this.state.selected !== i) {
                this.setState({ selected: i, oldValue: this.props.value.get(i) });
            } else {
                this.setState({ selected: null, oldValue: undefined });
            }
        }

        // Handle an item at i requesting that the value be reverted
        handleRevertItem(i: number) {
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

        // Handle an item at i changing to a new value.
        handleChangeItem(i: number, value: Immutable.Map<string, FieldValue>) {
            let newValue = this.props.value.set(i, value);
            if (this.props.onChange) {
                this.props.onChange(this.props.name, newValue);
            }
        }

        // Handle when an item i has it's missing count change
        handleMissingCountChange(i: number, missingCount: number) {
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

        // Handle when an item i has it's error count change
        handleErrorCountChange(i: number, errorCount: number) {
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
        handleRemovedItem(i: number) {
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

        // Adds a new item
        handleAddItem() {
            let value = this.props.value;

            this.errors.push(0);
            this.missing.push(0);

            // Callbacks
            if (this.props.onChange) {
                this.props.onChange(this.props.name, value.push(initialItemValue));
            }

            this.setState({ selected: this.props.value.size });
        }

        // Utility function to determine the total count of missing fields in the entire list
        numMissing(): number {
            let total = 0;
            _.each(this.missing, c => {
                total += c;
            });
            return total;
        }

        // Utility function to determine the total number of errors in the entire list
        numErrors(): number {
            let total = 0;
            _.each(this.errors, c => {
                total += c;
            });
            return total;
        }

        render() {
            const itemComponents: React.ReactElement<ListItemProps>[] = [];
            const { selected } = this.state;
            const { initialValue: initialList } = this.props;

            this.props.value.forEach((itemValue, index) => {
                const itemProps: ListItemProps = {
                    key: `item-${index}`,
                    name: `${index}`,
                    innerForm: true,
                    hideMinus: hideEditRemove && index < this.props.value.size - 1,
                    types: this.props.types,
                    value: itemValue,
                    initialValue: initialList.get(index),
                    editable: this.props.edit,
                    edit: index === selected,

                    onErrorCountChange: (index, errorCount) =>
                        this.handleErrorCountChange(parseInt(index, 10), errorCount),
                    onMissingCountChange: (index, missingCount) =>
                        this.handleMissingCountChange(parseInt(index, 10), missingCount),
                    onChange: (index, value) => this.handleChangeItem(parseInt(index, 10), value)
                };

                const element = React.createElement(ItemComponent, itemProps);
                itemComponents.push(element);
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
                    buttonIndent={itemButtonIndent}
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
