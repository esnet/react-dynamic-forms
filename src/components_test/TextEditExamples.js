/**
 *  Copyright (c) 2017, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import TextEdit from "../components/TextEdit";
import React from "react";

export const TestBasic = React.createClass({
    render() {
        return <TextEdit initialValue="Bob" width={300} />;
    }
});

export const TextEditDisabled = React.createClass({
    render() {
        return <TextEdit initialValue="Bob" disabled={true} width={300} />;
    }
});

export const TextEditPlaceholder = React.createClass({
    render() {
        return <TextEdit placeholder="Enter first name" width={300} />;
    }
});

export const TextEditPassword = React.createClass({
    render() {
        return (
            <TextEdit
                type="password"
                placeholder="Enter first name"
                width={300}
            />
        );
    }
});

export const TextEditRequired1 = React.createClass({
    render() {
        return <TextEdit required={true} showRequired={true} />;
    }
});

export const TextEditRequired2 = React.createClass({
    render() {
        return <TextEdit required={true} showRequired={false} />;
    }
});

// Required field (with showRequired turned ON and initial value)
export const TextEditRequired3 = React.createClass({
    render() {
        return (
            <TextEdit initialValue="Bob" required={true} showRequired={true} />
        );
    }
});

// Validated field (email address)
export const TextEditValidate = React.createClass({
    render() {
        return (
            <TextEdit
                initialValue="bob.at.gmail.com"
                rules={{ format: "email" }}
                onChange={this.handleEmailValidate}
            />
        );
    }
});

// Validated field (integer)
export const TextEditValidateInt = React.createClass({
    render() {
        return <TextEdit initialValue="42" rules={{ type: "integer" }} />;
    }
});

