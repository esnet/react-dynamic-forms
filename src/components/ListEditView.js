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
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import "./listeditview.css";

/**
 * Editing of a list of widgets. This The widgets themselves are passed in as 'items'.
 *
 * A ListEditView is created within the ListEditorMixin, so you do not generally need
 * to use this component directly.
 *
 * This user of this component should supply event handlers to manage the list
 * when items are added or removed. This is done in the ListEditorMixin render() method.
 *
 * These are onAddItem() and onRemoveItem(). Each item padded in should have
 * and id set (item.props.id). This item is used to uniquely identify each row so that
 * removing a row happens correctly. Finally, 'canAddItems' lets you hide the [+] icon
 * (for instance if there's no possible items that can be added from a list).
 */
export default React.createClass({
  displayName: "ListEditView",
  addItem() {
    if (this.props.onAddItem) {
      this.props.onAddItem();
    }
  },
  removeItem(e) {
    const index = e.target.id;
    if (this.props.onRemoveItem) {
      this.props.onRemoveItem(index);
    }
  },
  render() {
    let plus;

    const addPlus = this.props.canAddItems;
    const addMinus = this.props.canRemoveItems;

    // Build the item list, which is a list of table rows, each row containing
    // an item and a [-] icon used for removing that item.
    const plusActionKey = "plus-action";
    let itemList = _.map(this.props.items, (item, index) => {
      const minusActionKey = `minus-action-${item.key}`;
      const itemKey = `item-${item.key}`;
      const itemSpanKey = `item-span-${item.key}`;
      const actionSpanKey = `action-span-${item.key}`;
      const itemMinusHide = item.props.hideMinus ? item.props.hideMinus : false;

      let listEditItemClass = "esnet-forms-listeditview-edit-item";
      let minus;

      if (addMinus && !itemMinusHide) {
        minus = (
          <i
            id={index}
            key={minusActionKey}
            className="glyphicon glyphicon-minus esnet-forms-small-action-icon"
            onClick={this.removeItem}
          />
        );
      } else {
        listEditItemClass += " no-controls";
        minus = (
          <div className="esnet-forms-listeditview-edit-item-minus-spacer" />
        );
      }

      // JSX for each row, includes: UI Item and [-] remove item button
      return (
        <li height="80px" key={itemKey} className="esnet-forms-list-item">
          <span
            key={itemSpanKey}
            className={listEditItemClass}
            style={{ float: "left" }}
          >
            {item}
          </span>
          <span
            key={actionSpanKey}
            className="esnet-forms-minus-action-box"
            style={{ float: "left", verticalAlign: "top" }}
          >
            {minus}
          </span>
        </li>
      );
    });

    // Build the [+] elements
    if (addPlus) {
      if (this.props.plusElement) {
        plus = this.props.plusElement;
      } else {
        plus = (
          <div
            className="esnet-forms-plus-action-box"
            key={plusActionKey}
            onClick={this.addItem}
          >
            <i
              className="glyphicon glyphicon-plus esnet-forms-small-action-icon"
            >
              
            </i>
          </div>
        );
      }
    } else {
      plus = <div />;
    }

    // Build the table of item rows, with the [+] at the bottom if required. If there's
    // no items to show then special UI is shown for that.
    return (
      <div>
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
})

