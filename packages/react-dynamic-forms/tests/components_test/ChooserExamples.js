/**
 *  Copyright (c) 2017 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import Chooser from "../../src/components/Chooser";
import React from "react";
import _ from "underscore";
import Chance from "chance";

const chance = Chance.Chance();

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

export class ChooserBasic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            animalList
        };
    }

    render() {
        return (
            <Chooser
                initialChoiceList={this.state.animalList}
                placeholder="Select an Animal..."
                width={300}
            />
        );
    }
};

export class ChooserWider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            animalList
        };
    }

    render() {
        return <Chooser initialChoiceList={this.state.animalList} width={500} />;
    }
};

export class ChooserSortedList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortedAnimalList
        };
    }

    render() {
        return <Chooser initialChoiceList={this.state.sortedAnimalList} width={300} />;
    }
};

export class ChooserInitialValue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            animalList
        };
    }

    render() {
        return <Chooser initialChoice="4" initialChoiceList={this.state.animalList} width={300} />;
    }
};

export class ChooserInitialNull extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            animalList
        };
    }

    render() {
        return (
            <Chooser initialChoice={null} initialChoiceList={this.state.animalList} width={300} />
        );
    }
};

export class ChooserSortedInitial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortedAnimalList
        };
    }

    render() {
        return (
            <Chooser
                initialChoice="4"
                initialChoiceList={this.state.sortedAnimalList}
                width={300}
            />
        );
    }
};

export class ChooserDisabled extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            animalList
        };
    }

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
};

export class ChooserItemDisabled extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            animalList
        };
    }

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
};

export class ChooserSearchDisabled extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            animalList
        };
    }

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
};

export class ChooserSingleDeselect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            animalList
        };
    }

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
};

export class ChooserLongList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locationList
        };
    }

    render() {
        return <Chooser initialChoice={112} initialChoiceList={largeList} limit={5} width={300} />;
    }
};