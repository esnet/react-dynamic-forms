/**
 *  Copyright (c) 2017 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import invariant from "invariant";
import PropTypes from "prop-types";

/**
 * A `Field` is a part of the JSX definition of a `Schema`. Each `Field` describes
 * the rules and meta data associated with a field on the `Form`.
 *
 * For example, here is an `Field` which will input the users email address, defining
 * a user friendly label "Email", a placeholder and a validation rule that expects
 * the field to be a valid email address. The field is also required to be filled in.
 *
 * ```
 * <Schema>
 *     ...
 *      <Field
 *         required
 *         name="email"
 *         label="Email"
 *         placeholder="Enter valid email address"
 *         validation={{"format": "email"}}/>
 *     ...
 * </Schema>
 * ```
 */
export default class Field extends React.Component {
    render() {
        invariant(
            false,
            `${this.constructor.name} elements are for schema configuration only and should not be rendered`
        );
        return;
    }
}

Field.propTypes = {
    /**
     * name - The name of the field, or basically how it is referenced when rendering the field
     */
    name: PropTypes.string,
    
    /**
     * label - The UI fieldly name of the field, used when constructing a `Group`.
     */
    label: PropTypes.string,
    
    /**
     * placeholder - If appropiate to the widget, displays placeholder text.
     */
    placeholder: PropTypes.string,

    /**
     * validation* - See [Revalidator](https://github.com/flatiron/revalidator) for possible formats
     * for the validation property.
     */
    validation: PropTypes.object
}