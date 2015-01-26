/** @jsx React.DOM */

"use strict";

var React = require("react/addons");
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var _ = require("underscore");

require("./listeditview.css");

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
var ListEditView = React.createClass({

    displayName: "ListEditView",

    addItem: function() {
        if (this.props.onAddItem) {
            this.props.onAddItem();
        }
    },

    removeItem: function(e) {
        var index = e.target.id;
        if (this.props.onRemoveItem) {
            this.props.onRemoveItem(index);
        }
    },

    render: function() {
        var self = this;
        var plus;

        var addPlus = this.props.canAddItems;
        var addMinus = this.props.canRemoveItems;

        // Build the item list, which is a list of table rows, each row containing
        // an item and a [-] icon used for removing that item.
        var plusActionKey = "plus-action";
        var itemList = _.map(self.props.items, function(item, index) {
            var minusActionKey = "minus-action-" + item.props.key;
            
            var itemKey = "item-" + item.props.key;
            var itemSpanKey = "item-span-" + item.props.key;
            var actionSpanKey = "action-span-" + item.props.key;

            var itemMinusHide = item.props.hideMinus ? item.props.hideMinus : false;

            var listEditItemClass="esdb-list-edit-item";
            var minus;
            if (addMinus && !itemMinusHide) {
                minus = (
                    <i id={index} key={minusActionKey} className="glyphicon glyphicon-minus esdb-small-action-icon"
                       onClick={self.removeItem} />
                );
            } else {
                listEditItemClass += " no-controls";
                minus = (
                    <div className="esdb-list-edit-item-minus-spacer"/>
                );
            }

            //JSX for each row, includes: UI Item and [-] remove item button
            return (
                <li height="80px" key={itemKey} className="esdb-list-item">
                    <span key={itemSpanKey} className={listEditItemClass} style={{"float": "left"}}>{item}</span>
                    <span key={actionSpanKey} className="esdb-minus-action-box" style={{"float": "left", "vertical-align": "top"}}>{minus}</span>
                </li>
            );
        });

        //Build the [+] elements
        if (addPlus) {
            //You can supply a custom element here for special handling
            //XXX
            //var childControl = React.addons.cloneWithProps(child, props);
            //
            if (this.props.plusElement) {
                plus = this.props.plusElement;
            } else {
                plus = (
                    <div className="esdb-plus-action-box" key={plusActionKey} onClick={self.addItem}>
                        <i className="glyphicon glyphicon-plus esdb-small-action-icon"></i>
                    </div>
                );
            }
        } else {
            plus = (
                <div />
            );
        }

        //Build the table of item rows, with the [+] at the bottom if required. If there's
        //no items to show then special UI is shown for that.
        
        //if (numItems > 0) {
        
        return (
            <div>
                <ul className="esdb-list-container">
                    <ReactCSSTransitionGroup transitionName="esdb-list-item">
                        {itemList}
                    </ReactCSSTransitionGroup>
                </ul>
                {plus}
            </div>
        );

        /* Disabled canAddItems for the moment
        } else {
            if (this.props.canAddItems) {
                return (
                    <div className="esdb-plus-action-box"  onClick={self.addItem}>
                        <ReactCSSTransitionGroup transitionName="esdb-list-item">
                            {itemList}
                        </ReactCSSTransitionGroup>
                        <span><i className="glyphicon glyphicon-plus esdb-small-action-icon"></i></span>
                        <span className="esdb-list-add-text">Add</span>
                    </div>
                );
            } else {
                return (
                    <span className="esdb-list-add-text">Nothing to add</span>
                );
            }
        }
        */
    }
});

module.exports = ListEditView;