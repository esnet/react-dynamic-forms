/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/* eslint max-len:0 */

import React from "react";
import _ from "underscore";

import Highlighter from "./Highlighter";
import APIDoc from "./APIDoc";
import docsFile from "./docs.json";

export default React.createClass({
    mixins: [Highlighter],
    render() {
        const component = this.props.params.component;
        const path = `src/components/${component}.js`;

        if (!_.has(docsFile, path)) {
            return <div>API could not be found</div>;
        }
        const title = component;
        return (
            <div>
                <h2>
                    {title}
                </h2>
                <div className="row">
                    <div className="col-md-12">
                        <APIDoc file={path} />
                    </div>
                </div>
            </div>
        );
    }
});
