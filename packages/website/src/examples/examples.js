/**
 *  Copyright (c) 2016-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

//
// Export all of the examples
//

import dynamic from "./dynamic/Index";
import form from "./form/Index";
import list from "./list/Index";
import schema from "./schema/Index";

export default {
    ...dynamic,
    ...form,
    ...list,
    ...schema
};
