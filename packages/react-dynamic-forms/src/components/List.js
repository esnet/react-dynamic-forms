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
import Flexbox from "flexbox-react";
import ReactCSSTransitionGroup from "react-transition-group/CSSTransitionGroup";

import "../css/list.css";
import "../css/icon.css";

/**
 * Editing of a list of widgets. This widgets themselves are passed in as 'items'.
 *
 * A ListEditView is created within the ListEditorMixin, so you do not generally need
 * to use this component directly.
 *
 * The user of this component should supply event handlers to manage the list
 * when items are added or removed:
 *   * `onAddItem()`
 *   * `onRemoveItem()`
 *
 * Each item passed in should have an id set (item.props.id). This is used to
 * uniquely identify each row so that removing a row happens correctly.
 *
 * Finally
 *   * `canAddItems()` - lets you hide the [+] icon for instance if there's no
 *                       possible items that can be added from a list).
 */
export default class List extends React.Component {
    addItem() {
        if (this.props.onAddItem) {
            this.props.onAddItem();
        }
    }

    removeItem(index) {
        if (this.props.onRemoveItem) {
            this.props.onRemoveItem(index);
        }
    }

    selectItem(index) {
        if (this.props.onSelectItem) {
            this.props.onSelectItem(index);
        }
    }

    handleDeselect() {
        this.selectItem(null);
    }

    render() {
        const addPlus = this.props.canAddItems;
        const addMinus = this.props.canRemoveItems;
        const addEdit = this.props.canEditItems;

        // Plus [+] icon
        let plus;
        if (addPlus) {
            plus = (
                <i
                    key="plus"
                    className="glyphicon glyphicon-plus icon add-action"
                    onClick={() => this.addItem()}
                />
            );
        } else {
            plus = <div />;
        }

        // Build the item list, which is a list of table rows, each row containing
        // an item and a [-] icon used for removing that item.
        let itemList = _.map(this.props.items, (item, index) => {
            const minusActionKey = `minus-action-${item.key}`;
            const itemKey = `item-${item.key}`;
            const itemSpanKey = `item-span-${item.key}`;
            const actionSpanKey = `action-span-${item.key}`;
            const itemMinusHide = item.props.hideMinus ? item.props.hideMinus : false;

            let listEditItemClass = "esnet-forms-listeditview-edit-item";

            const isBeingEdited = item.props.edit === true;

            // Item remove [-] icon
            let minus;
            let edit;

            let isEditable;
            if (this.props.hideEditRemove) {
                isEditable = this.props.hideEditRemove && index === this.props.items.length - 1;
            } else {
                isEditable = true;
            }
            if (isEditable) {
                if (addMinus && !itemMinusHide) {
                    minus = (
                        <i
                            id={index}
                            key={minusActionKey}
                            className="glyphicon glyphicon-remove hostile_icon delete-action"
                            onClick={() => this.removeItem(index)}
                        />
                    );
                } else {
                    listEditItemClass += " no-controls";
                    minus = <div className="icon delete-action" />;
                }

                const flip = {
                    transform: "scaleX(-1)",
                    fontSize: 10
                };

                // Edit item icon
                if (addEdit) {
                    if (isBeingEdited) {
                        edit = (
                            <i
                                id={index}
                                key={minusActionKey}
                                className="glyphicon glyphicon-chevron-down icon edit-action active"
                                onClick={() => this.selectItem(index)}
                            />
                        );
                    } else {
                        edit = (
                            <i
                                id={index}
                                key={minusActionKey}
                                style={flip}
                                className="glyphicon glyphicon-chevron-left icon edit-action"
                                onClick={() => this.selectItem(index)}
                            />
                        );
                    }
                }
            }

            const minusAction = addMinus ? (
                <Flexbox width="28px">
                    <span key={actionSpanKey} className="icon" style={{ background: "white" }}>
                        {minus}
                    </span>
                </Flexbox>
            ) : (
                <div />
            );

            const editAction = addEdit ? (
                <Flexbox width="28px">
                    <span
                        key={actionSpanKey}
                        className="icon"
                        style={{ background: "white", verticalAlign: "top" }}
                    >
                        {edit}
                    </span>
                </Flexbox>
            ) : (
                <div />
            );

            // JSX for each row, includes: UI Item and [x] remove item button
            return (
                <li
                    height="80px"
                    key={itemKey}
                    className="esnet-forms-list-item"
                    style={{
                        borderBottomStyle: "solid",
                        borderBottomColor: "#DDD",
                        borderBottomWidth: 1
                    }}
                >
                    <Flexbox flexDirection="row">
                        {minusAction}
                        {editAction}
                        <Flexbox flexGrow={1}>
                            <span key={itemSpanKey} className={listEditItemClass}>
                                {item}
                            </span>
                        </Flexbox>
                    </Flexbox>
                </li>
            );
        });

        // Build the [+] elements
        if (addPlus) {
            if (this.props.plusElement) {
                plus = this.props.plusElement;
            } else {
                plus = (
                    <Flexbox flexDirection="row">
                        <Flexbox width="28px">
                            <span
                                key="plus"
                                className="icon"
                                style={{ background: "white", verticalAlign: "top", fontSize: 10 }}
                            >
                                {plus}
                            </span>
                        </Flexbox>
                        <Flexbox width="28px" />
                    </Flexbox>
                );
            }
        } else {
            plus = <div />;
        }

        //
        // Build the table of item rows, with the [+] at the bottom if required
        //

        return (
            <div
                style={{
                    borderTopStyle: "solid",
                    borderTopWidth: 1,
                    borderTopColor: "#DDD"
                }}
            >
                <ul className="esnet-forms-listeditview-container">
                    <ReactCSSTransitionGroup
                        transitionName="esnet-forms-list-item"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}
                    >
                        {itemList}
                    </ReactCSSTransitionGroup>
                </ul>
                {plus}
            </div>
        );
    }
}
