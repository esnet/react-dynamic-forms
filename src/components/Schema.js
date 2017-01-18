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
import invariant from "invariant";

export default React.createClass({
  displayName: "Schema",
  render() {
    invariant(
      false,
      `${this.constructor.name} elements are for schema configuration only and should not be rendered`
    );
    return;
  }
})

