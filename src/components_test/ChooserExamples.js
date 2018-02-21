/**
 *  Copyright (c) 2017, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import Chooser from "../components/Chooser";
import React from "react";
import _ from "underscore";

import Chance from "chance";
const chance = Chance.Chance();

/*
// Data
const animalMap = {
    1: "dog",
    2: "duck",
    3: "cat",
    4: "donkey",
    5: "fish",
    6: "hedgehog",
    7: "banana slug"
};
const animalList = _.map(animalMap, (value, key) => ({
    id: key,
    label: value
}));
const sortedAnimalList = _.sortBy(animalList, item => item.label);

let largeList = [];
for (let i = 1; i < 5000; i++) {
    largeList.push({ id: i, label: chance.word() });
}

let locationList = [
    { id: 12, label: "Spain" },
    { id: 14, label: "Portugal" },
    { id: 16, label: "Italy" },
    { id: 78, label: "France" },
    { id: 99, label: "Germany" },
    { id: 104, label: "Norway" },
    { id: 112, label: "Denmark" },
    { id: 154, label: "Greece" },
    { id: 206, label: "Holland" }
];
*/
const animals = {
    1: "dog",
    2: "duck",
    3: "cat",
    4: "donkey",
    5: "fish",
    6: "hedgehog",
    7: "banana slug"
};
const animalList = _.map(animals, (value, key) => ({ id: key, label: value }));
const sortedAnimalList = _.sortBy(animalList, item => item.label);

let locationList = [
    { id: 12, label: "Spain" },
    { id: 14, label: "Portugal" },
    { id: 16, label: "Italy" },
    { id: 78, label: "France" },
    { id: 99, label: "Germany" },
    { id: 104, label: "Norway" },
    { id: 112, label: "Denmark" },
    { id: 154, label: "Greece" },
    { id: 206, label: "Holland" }
];

let largeList = [];
for (let i = 1; i < 5000; i++) {
    largeList.push({ id: `${i}`, label: chance.word() });
}

export const ChooserBasic = React.createClass({
    getInitialState() {
        return {
            animalList
        };
    },
    render() {
        return (
            <Chooser
                initialChoiceList={this.state.animalList}
                placeholder="Select an Animal..."
                width={300}
            />
        );
    }
});

export const ChooserWider = React.createClass({
    getInitialState() {
        return {
            animalList
        };
    },
    render() {
        return <Chooser initialChoiceList={this.state.animalList} width={500} />;
    }
});

export const ChooserSortedList = React.createClass({
    getInitialState() {
        return {
            sortedAnimalList
        };
    },
    render() {
        return <Chooser initialChoiceList={this.state.sortedAnimalList} width={300} />;
    }
});

export const ChooserInitialValue = React.createClass({
    getInitialState() {
        return {
            animalList
        };
    },
    render() {
        return <Chooser initialChoice="4" initialChoiceList={this.state.animalList} width={300} />;
    }
});

export const ChooserInitialNull = React.createClass({
    getInitialState() {
        return {
            animalList
        };
    },
    render() {
        return (
            <Chooser initialChoice={null} initialChoiceList={this.state.animalList} width={300} />
        );
    }
});

export const ChooserSortedInitial = React.createClass({
    getInitialState() {
        return {
            sortedAnimalList
        };
    },
    render() {
        return (
            <Chooser
                initialChoice="4"
                initialChoiceList={this.state.sortedAnimalList}
                width={300}
            />
        );
    }
});

export const ChooserDisabled = React.createClass({
    getInitialState() {
        return {
            animalList
        };
    },
    render() {
        return (
            <Chooser
                initialChoice="2"
                initialChoiceList={this.state.animalList}
                disabled={true}
                width={300}
            />
        );
    }
});

export const ChooserItemDisabled = React.createClass({
    getInitialState() {
        return {
            animalList
        };
    },
    render() {
        return (
            <Chooser
                initialChoice={3}
                initialChoiceList={this.state.animalList}
                disableList={["2"]}
                disableSearch={true}
                width={300}
            />
        );
    }
});

export const ChooserSearchDisabled = React.createClass({
    getInitialState() {
        return {
            animalList
        };
    },
    render() {
        return (
            <Chooser
                initialChoice={3}
                initialChoiceList={this.state.animalList}
                disableSearch={true}
                width={300}
            />
        );
    }
});

export const ChooserSingleDeselect = React.createClass({
    getInitialState() {
        return {
            animalList
        };
    },
    render() {
        return (
            <Chooser
                initialChoice={2}
                initialChoiceList={this.state.animalList}
                disableSearch={true}
                allowSingleDeselect={true}
                width={300}
            />
        );
    }
});

export const ChooserLongList = React.createClass({
    getInitialState() {
        return {
            locationList
        };
    },
    render() {
        return <Chooser initialChoice={112} initialChoiceList={largeList} limit={5} width={300} />;
    }
});
/*
export default React.createClass({
    mixins: [ Highlighter ],
    getInitialState() {
        return { animalList, sortedAnimalList, selection: "", missingCount: 0 };
    },
    handleChange(attr, value) {
        this.setState({ selection: value });
    },
    handleMissingCountChange(attr, count) {
        this.setState({ missingCount: count });
    },
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Chooser Examples</h3>
                         The Chooser widget wraps the react-select component<br
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">

                        <p />
                        Chooser with a required value:
                        <Chooser
                            initialChoiceList={this.state.animalList}
                            width={300}
                            required={true}
                            showRequired={true}
                            allowSingleDeselect={true}
                            onMissingCountChange={this.handleMissingCountChange}
                        />
                         Missing count: {this.state.missingCount}
                        <p />
                        Searchable chooser with 5000 items, onChange callback:
                        <Chooser
                            initialChoice={this.state.selection}
                            initialChoiceList={largeList}
                            width={300}
                            onChange={this.handleChange}
                        />
                         Chosen: {this.state.selection}
                        <p />
                        Locations (Denmark pre-selected), limit 5:

                    </div>
                </div>
            </div>
        );
    }
})
*/
