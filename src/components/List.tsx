/**
 *  Copyright (c) 2015 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import Flexbox from "@g07cha/flexbox-react";
import Octicon, { Pencil, Plus, X } from "@primer/octicons-react";
import _ from "lodash";
import React from "react";
import { ListItemProps } from "../hoc/list";
import "../style/icon.css";
import "../style/list.css";
import { inlineCancelButtonStyle, inlineDoneButtonStyle } from "../util/style";

interface ListProps {
    items: React.ReactElement<ListItemProps>[];

    canAddItems: boolean;
    canRemoveItems: boolean;
    canEditItems: boolean;

    buttonIndent: number;
    plusWidth: number;
    plusElement: React.ReactElement | null;
    hideEditRemove: boolean;
    canCommitItem: boolean;

    onAddItem: () => void;
    onRevertItem: (index: number) => void;
    onRemoveItem: (index: number) => void;
    onSelectItem: (index: number | null) => void;
}

interface ListState {
    hover: boolean;
}

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
export default class List extends React.Component<ListProps, ListState> {
    constructor(props: ListProps) {
        super(props);
        this.state = {
            hover: false
        };
    }

    handleMouseEnter() {
        this.setState({ hover: true });
    }

    handleMouseLeave() {
        this.setState({ hover: false });
    }

    addItem() {
        if (this.props.onAddItem) {
            this.props.onAddItem();
        }
    }

    removeItem(index: number) {
        if (this.props.onRemoveItem) {
            this.props.onRemoveItem(index);
        }
    }

    selectItem(index: number | null) {
        if (this.props.onSelectItem) {
            this.props.onSelectItem(index);
        }
    }

    revertItem(index: number) {
        if (this.props.onRevertItem) {
            this.props.onRevertItem(index);
            this.selectItem(null);
        }
    }

    handleDeselect() {
        this.selectItem(null);
    }

    render() {
        const addPlus = this.props.canAddItems;
        const addMinus = this.props.canRemoveItems;
        const addEdit = this.props.canEditItems;

        const mouseOver = this.state.hover;
        console.log("HOVER", mouseOver);

        // Plus [+] icon
        let plusIcon;
        if (addPlus && mouseOver) {
            plusIcon = (
                <span key="plus" onClick={() => this.addItem()} className="add-action">
                    <Octicon icon={Plus} size="small" verticalAlign="middle" />
                </span>
            );
        } else {
            plusIcon = <div />;
        }

        const LISTWIDTH = 600;
        const ICONWIDTH = 28;

        // Build the item list, which is a list of table rows, each row containing
        // an item and a [-] icon used for removing that item.
        let itemList = _.map(this.props.items, (item, index) => {
            const minusActionKey = `minus-action-${item.key}`;
            const editActionKey = `edit-action-${item.key}`;
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
                if (addMinus && !itemMinusHide && mouseOver) {
                    minus = (
                        <span
                            key={minusActionKey}
                            onClick={() => this.addItem()}
                            className="hostile_icon delete-action"
                        >
                            <Octicon icon={X} size="small" verticalAlign="middle" />
                        </span>
                    );
                } else {
                    listEditItemClass += " no-controls";
                    minus = <div className="icon delete-action" />;
                }

                // Edit item icon
                if (addEdit && mouseOver) {
                    edit = (
                        <span
                            key={editActionKey}
                            onClick={() => this.selectItem(index)}
                            className=" icon edit-action"
                        >
                            <Octicon icon={Pencil} size="small" verticalAlign="middle" />
                        </span>
                        // <i
                        //     id={`${index}`}
                        //     key={minusActionKey}
                        //     style={{ paddingLeft: 5, paddingRight: 5 }}
                        //     className="glyphicon glyphicon-pencil icon edit-action active"
                        // />
                    );
                }
            }

            const minusAction = addMinus ? (
                <Flexbox width="28px">
                    <div onClick={() => this.removeItem(index)}>
                        <span
                            key={actionSpanKey}
                            className="icon"
                            style={{ paddingLeft: 5, paddingRight: 5 }}
                        >
                            {minus}
                        </span>
                    </div>
                </Flexbox>
            ) : (
                <div style={{ height: 30 }} />
            );

            const editAction = addEdit ? (
                <Flexbox width="28px">
                    <div
                        onClick={() => {
                            this.selectItem(index);
                        }}
                    >
                        <span key={actionSpanKey} className="icon" style={{ verticalAlign: "top" }}>
                            {edit}
                        </span>
                    </div>
                </Flexbox>
            ) : (
                <div />
            );

            // JSX for each row, includes: UI Item and [x] remove item button
            if (!isBeingEdited) {
                return (
                    <li
                        // height="80px"
                        // width="600px"
                        key={itemKey}
                        className="esnet-forms-list-item"
                        style={{
                            borderBottomStyle: "solid",
                            borderBottomColor: "#DDD",
                            borderBottomWidth: 1
                        }}
                    >
                        <Flexbox flexDirection="row" style={{ width: "100%", paddingTop: 5 }}>
                            <Flexbox style={{ width: LISTWIDTH - ICONWIDTH * 2 }}>
                                <span key={itemSpanKey} className={listEditItemClass}>
                                    {item}
                                </span>
                            </Flexbox>
                            {minusAction}
                            {editAction}
                        </Flexbox>
                    </li>
                );
            } else {
                return (
                    <li
                        key={itemKey}
                        className="esnet-forms-list-item"
                        style={{
                            borderBottomStyle: "solid",
                            borderBottomColor: "#DDD",
                            borderBottomWidth: 1
                        }}
                    >
                        <Flexbox
                            flexDirection="row"
                            style={{ width: "100%", paddingTop: 10, paddingBottom: 10 }}
                        >
                            <Flexbox flexDirection="column">
                                <Flexbox style={{ width: LISTWIDTH - ICONWIDTH * 2 }}>
                                    <span key={itemSpanKey} className={listEditItemClass}>
                                        {item}
                                    </span>
                                </Flexbox>

                                <Flexbox
                                    style={{
                                        fontSize: 12,
                                        marginLeft: this.props.buttonIndent
                                    }}
                                >
                                    {this.props.canCommitItem ? (
                                        <span
                                            style={inlineDoneButtonStyle(0, true)}
                                            onClick={() => this.handleDeselect()}
                                        >
                                            DONE
                                        </span>
                                    ) : (
                                        <span style={inlineDoneButtonStyle(0, false)}>DONE</span>
                                    )}
                                    <span
                                        style={inlineCancelButtonStyle()}
                                        onClick={() => this.revertItem(index)}
                                    >
                                        CANCEL
                                    </span>
                                </Flexbox>
                            </Flexbox>
                            {minusAction}
                        </Flexbox>
                    </li>
                );
            }
        });

        // Build the [+] elements
        let plus;
        if (addPlus && mouseOver) {
            if (this.props.plusElement) {
                plus = this.props.plusElement;
            } else {
                plus = (
                    <Flexbox flexDirection="row">
                        <Flexbox width="28px">
                            <span
                                key="plus"
                                className="icon"
                                style={{ verticalAlign: "top", paddingLeft: 5 }}
                            >
                                {plusIcon}
                            </span>
                        </Flexbox>
                        <Flexbox width="28px" />
                    </Flexbox>
                );
            }
        } else {
            plus = <div style={{ height: 35 }} />;
        }

        //
        // Build the header
        //

        // const headerStyle = {
        //     fontSize: 11,
        //     paddingTop: 3,
        //     height: 20,
        //     color: "#9a9a9a",
        //     borderBottom: "#ddd",
        //     borderBottomStyle: "solid",
        //     borderBottomWidth: 1
        // };

        // const headerItems = _.map(this.props.header, (size, label) => {
        //     return (
        //         <Flexbox width={`${size}px`}>
        //             <span style={{ verticalAlign: "top", fontSize: 10, paddingLeft: 3 }}>
        //                 {label}
        //             </span>
        //         </Flexbox>
        //     );
        // });

        // const header = this.props.header ? (
        //     <Flexbox flexDirection="row" style={headerStyle}>
        //         {headerItems}
        //     </Flexbox>
        // ) : (
        //     <div />
        // );

        //
        // Build the table of item rows, with the [+] at the bottom if required
        //

        return (
            <div
                style={{
                    width: 600,
                    borderTopStyle: "solid",
                    borderTopWidth: 1,
                    borderTopColor: "#DDD"
                }}
                onMouseEnter={() => this.handleMouseEnter()}
                onMouseLeave={() => this.handleMouseLeave()}
            >
                <ul className="esnet-forms-listeditview-container">{itemList}</ul>
                {plus}
            </div>
        );
    }
}
