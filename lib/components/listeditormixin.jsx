"use strict";

var _ = require("underscore");
var React = require("react/addons");

var ListEditView = require("./listeditview");

/**
 * A helper mixin to keep track of lists of values, missing values and error counts
 * in a ListEditor.
 *
 * To use, in the ListEditor, define functions:
 *     - initialItems() to return the initial list of items
 *     - createItem() to create a new item
 *     - renderItem() to render a new item
 */
var ListEditorMixin = {

    getInitialState: function() {
        
        if (!this.initialItems) {
            throw new Error("ListEditorMixin requires method initialItems() to be defined on the component.");
        }

        var initialItems = this.initialItems();
        var items = [];

        _.each(initialItems, function(item) {
            if (!_.has(item, "key")) {
                item.key = "key-" + Math.random();
            }
            items.push(item);
        });

        return {
            "items": items,  // array of items
            "errors": [],    // number of errors
            "missing": []    // required fields that are still not filled out
        };
    },

    /**
     * Returns the number of items in the list
     */
    itemCount: function() {
        return this.state.items.length;
    },

    /**
     * Returns the item at the index supplied
     */
    getItem: function(index) {
        if (index >= 0 && index < this.itemCount()) {
            return this.state.items[index];
        }
    },

    /**
     * Handle adding a new item.
     */
    handleAddItem: function(data) {

        if (!this.createItem) {
            throw new Error("ListEditorMixin requires method createItem() to be defined on the component.");
        }

        var items = this.state.items;
        var created = this.createItem(data);
        var errorList = this.state.errors;
        var missingList = this.state.missing;

        var newItems = [];
        if (!_.isArray(created)) {
            if (!_.has(created, "key")) {
                created.key = "key-" + Math.random();
            }
            items.push(created);
            errorList.push(0);
            missingList.push(0);
        } else {
            var n = 1;
            _.each(created, function(newItem) {
                if (!_.has(newItem, "key")) {
                    newItem.key = "key-" + Math.random();
                    newItem.multiPart = n;
                }
                items.push(newItem);
                errorList.push(0);
                missingList.push(0);
                n++;
            });
            newItems = created;
        }

        //Set state
        this.setState({"items": items,
                       "errors": errorList,
                       "missing": missingList});

        //Callbacks
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
    handleItemRemoved: function(i) {
        var items = this.state.items;

        var n = 1;
        if (this.removeItemCount) {
            n = this.removeItemCount(items[i], i);
        }

        items.splice(i - n + 1, n);

        var errorList = this.state.errors;
        var missingList = this.state.missing;
        errorList.splice(i - n + 1, n);
        missingList.splice(i - n + 1, n);

        this.setState({"items": items,
                       "errors": errorList,
                       "missing": missingList});

        //Callbacks
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
    handleItemChanged: function(i, value) {
        var items = this.state.items;
        items[i] = value;
        this.setState({"items": items});

        //Callback
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, items);
        }
    },

    /**
     * Handler for if a child changes its missing count
     */
    handleMissingCountChange: function(i, missingCount) {
        var totalMissingCount;
        var missingList = this.state.missing;
        missingList[i] = missingCount;
        this.setState({"missing": missingList});

        totalMissingCount = _.reduce(missingList, function(memo, num) { return memo + num; }, 0);

        //Callback
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr, totalMissingCount);
        }
    },

    /**
     * Handler for if a child changes its error count
     */
    handleErrorCountChange: function(i, errorCount) {
        var totalErrorCount;
        var errorList = this.state.errors;
        errorList[i] = errorCount;
        totalErrorCount = _.reduce(errorList, function(memo, num) { return memo + num; }, 0);

        //Callback
        if (this.props.onErrorCountChange) {
            this.props.onErrorCountChange(this.props.attr, totalErrorCount);
        }
    },

    render: function() {
        var self = this;
        var components = [];
        
        _.each(this.state.items, function(item, index) {
            var component = self.renderItem(item, index);
            if (component) {
                var props = {"key": item.key,
                             "index": index,
                             "id": item.id,
                             "onErrorCountChange": self.handleErrorCountChange,
                             "onMissingCountChange": self.handleMissingCountChange,
                             "onChange": self.handleItemChanged};
                var extendedComponent = React.addons.cloneWithProps(component, props);
                components.push(extendedComponent);
            }
        });

        var canAddItems = _.has(this.state, "canAddItems") ? this.state.canAddItems : true;
        var canRemoveItems = _.has(this.state, "canRemoveItems") ? this.state.canRemoveItems : true;
        var plusElement = _.has(this, "plusUI") ? this.plusUI() : null;

        return (
            <ListEditView items={components}
                          canAddItems={canAddItems}
                          canRemoveItems={canRemoveItems}
                          plusWidth={400}
                          plusElement={plusElement}
                          onAddItem={this.handleAddItem}
                          onRemoveItem={self.handleItemRemoved}/>
        );
    },

    /**
     * Determine the total count of missing fields in the entire list
     * @return {number} Count of missing fields
     */
    _totalMissingCounts: function() {
        var counts = this.state.missingCounts;
        var total = 0;
        _.each(counts, function(c) {
            total += c;
        });
        return total;
    },

    /**
     * Determine the total count of error fields in the entire list
     * @return {number} Count of missing fields
     */
    _totalErrorCounts: function() {
        var counts = this.state.errorCounts;
        var total = 0;
        _.each(counts, function(c) {
            total += c;
        });
        return total;
    },
};

module.exports = ListEditorMixin;