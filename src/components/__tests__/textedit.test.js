/**
 *  Copyright (c) 2017, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import renderer from "react-test-renderer";
import React from "react";
import { shallow, mount } from "enzyme";
import toJson from "enzyme-to-json";

import { Test1 } from "../../components_test/TextEditExamples";
import TextEdit from "../../components/TextEdit";

test("A very basic test of a TextEdit with an initial value and width", () => {
    const tree = renderer.create(<Test1 />).toJSON();
    expect(tree).toMatchSnapshot();
});

test("Interactivity of a TextEdit control", () => {
    const handleChange = jest.fn();

    const wrapper = mount(
        (
            <TextEdit
                attr="mytextedit"
                initialValue="bob"
                onChange={handleChange}
            />
        )
    );

    // Simulate user typing
    const input = wrapper.find("input");
    input.node.value = "fred";
    input.simulate("blur");

    // Get the result of the handleChange callback
    const [ attr, value ] = handleChange.mock.calls[0];
    expect(handleChange).toHaveBeenCalled();
    expect(attr).toBe("mytextedit");
    expect(value).toBe("fred");
});

test("TextEdit isRequired reporting", () => {
    const handleMissingCountChange = jest.fn();

    const wrapper = mount(
        (
            <TextEdit
                attr="mytextedit"
                initialValue="bob"
                required={true}
                onMissingCountChange={handleMissingCountChange}
            />
        )
    );

    // The TextEdit will evoke onMissingCountChange initially to report
    // up initial missing value counts, so handleMissingCountChange
    // should have been called once at this point, and since we provided
    // an initialValue the missing count should be 0
    const [ attr, missingBefore ] = handleMissingCountChange.mock.calls[0];
    expect(handleMissingCountChange.mock.calls.length).toBe(1);
    expect(attr).toBe("mytextedit");
    expect(missingBefore).toBe(0);

    // Simulate the user clearing the input field
    const input = wrapper.find("input");
    input.node.value = "";
    input.simulate("blur");

    // Get the result of the handleChange callback
    expect(handleMissingCountChange.mock.calls.length).toBe(2);
    const [ _, missingAfter ] = handleMissingCountChange.mock.calls[1];
    expect(missingAfter).toBe(1);
});

test("TextEdit isRequired snapshot test", () => {
    const handleMissingCountChange = jest.fn();

    const wrapper = mount(
        (
            <TextEdit
                attr="mytextedit"
                initialValue="bob"
                required={true}
                showRequired={true}
                onMissingCountChange={handleMissingCountChange}
            />
        )
    );
    const input = wrapper.find("input");
    const div = wrapper.find("div");

    // Get an initial snapshot of the TextEdit
    expect(toJson(div)).toMatchSnapshot();

    // Check if it shows an error (it shouldn't yet)
    expect(div.node.className).toBe("");

    // Simulate the user clearing the input field
    input.node.value = "";
    input.simulate("blur");

    // Check if it shows an error now
    expect(div.node.className).toBe("has-error");

    // Get an after snapshot of the TextEdit
    expect(toJson(div)).toMatchSnapshot();
});

