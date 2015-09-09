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
import invariant from "react/lib/invariant";

export default React.createClass({

    displayName: "Form",

    render() {
      invariant(
        false,
        "%s elements are for use in renderForm() and should not be rendered directly",
            this.constructor.name
      );
    }
});
