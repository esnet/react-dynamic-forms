/**
 *  Copyright (c) 2015 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import Immutable from "immutable";
import { FunctionComponent } from "react";
import { FormGroupProps } from "../../hoc/group";
interface Option {
    value?: string;
    label?: string;
    disabled?: boolean;
}
export declare type Options = Option[];
export interface ChooserProps {
    /**
     * Required on all Controls
     */
    field: string;
    /**
     * Customize the horizontal size of the Chooser
     */
    width: number;
    /**
     * Pass in the available list of options as a list of objects. For example:
     * ```
     * [
     *  {id: 1: label: "cat"},
     *  {id: 2: label: "dog"},
     *  ...
     * ]
     * ```
     */
    choiceList: Immutable.List<Immutable.Map<"id" | "label" | "disabled", string>>;
    /**
     * List of items in the Chooser list which should be presented disabled
     */
    disableList?: string[];
    /**
     * Show the Chooser itself as disabled
     */
    disabled?: boolean;
    /**
     * If `disableSearch` is true the chooser becomes a simple pulldown menu
     * rather than allowing the user to type into it to filter this list.
     * This is good for short little pull downs where the extra UI is annoying.
     */
    disableSearch?: boolean;
    /**
     * Add a [x] icon to the chooser allowing the user to clear the selected value
     */
    allowSingleDeselect?: boolean;
    /**
     * Can be "any" or "start", indicating how the search is matched within
     * the items (substring anywhere, or starting with)
     */
    searchContains?: "any" | "start";
}
/**
 * A `ChooserGroup` is a `ChooserControl` wrapped by the `formGroup()` HOC. This is the
 * component which can be rendered by the Form when the user adds a `Chooser` to their `Form`.
 */
export declare const ChooserGroup: (props: FormGroupProps & ChooserProps) => JSX.Element;
/**
 * A control which allows the user to select from a list defined in `chooserList`. See
 * `ChooserProps` for a list of available props.
 */
export declare const Chooser: FunctionComponent<ChooserProps>;
export {};
