/**
 *  Copyright (c) 2017 - present, The Regents of the University of California,
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

import {
    TestBasic,
    TextEditDisabled,
    TextEditPlaceholder,
    TextEditRequired1,
    TextEditRequired2,
    TextEditRequired3,
    TextEditValidate,
    TextEditValidateInt
} from "./components_test/TextEditExamples";

import TextEdit from "../src/components/TextEdit";

//
// Visual appearance snapshot tests
//
test("TextEdit with an initial value and width", () => {
    const tree = renderer.create(<TestBasic />).toJSON();
    expect(tree).toMatchSnapshot();
});

test("TextEdit that is disabled", () => {
    const tree = renderer.create(<TextEditDisabled />).toJSON();
    expect(tree).toMatchSnapshot();
});

test("TextEdit with a placeholder", () => {
    const tree = renderer.create(<TextEditPlaceholder />).toJSON();
    expect(tree).toMatchSnapshot();
});

test("TextEdit with required field (with showRequired turned ON)", () => {
    const tree = renderer.create(<TextEditRequired1 />).toJSON();
    expect(tree).toMatchSnapshot();
});

test("TextEdit with required field (with showRequired turned OFF)", () => {
    const tree = renderer.create(<TextEditRequired2 />).toJSON();
    expect(tree).toMatchSnapshot();
});

test("Required field (with showRequired turned ON and initial value", () => {
    const tree = renderer.create(<TextEditRequired3 />).toJSON();
    expect(tree).toMatchSnapshot();
});

test("Validated field (email address)", () => {
    const tree = renderer.create(<TextEditValidate />).toJSON();
    expect(tree).toMatchSnapshot();
});

test("Validated field (integer)", () => {
    const tree = renderer.create(<TextEditValidateInt />).toJSON();
    expect(tree).toMatchSnapshot();
});

//
// Test callbacks
//
test("TextEdit onChange callback", () => {
    const handleChange = jest.fn();

    const wrapper = mount(
        <TextEdit attr="mytextedit" initialValue="bob" onChange={handleChange} />
    );

    // Simulate user typing
    const input = wrapper.find("input");
    input.node.value = "fred";
    input.simulate("blur");

    // Get the result of the handleChange callback
    const [attr, value] = handleChange.mock.calls[0];
    expect(handleChange).toHaveBeenCalled();
    expect(attr).toBe("mytextedit");
    expect(value).toBe("fred");
});

test("TextEdit isRequired callback", () => {
    const handleMissingCountChange = jest.fn();

    const wrapper = mount(
        <TextEdit
            attr="mytextedit"
            initialValue="bob"
            required={true}
            onMissingCountChange={handleMissingCountChange}
        />
    );

    // The TextEdit will evoke onMissingCountChange initially to report
    // up initial missing value counts, so handleMissingCountChange
    // should have been called once at this point, and since we provided
    // an initialValue the missing count should be 0
    const [attr, missingBefore] = handleMissingCountChange.mock.calls[0];
    expect(handleMissingCountChange.mock.calls.length).toBe(1);
    expect(attr).toBe("mytextedit");
    expect(missingBefore).toBe(0);

    // Simulate the user clearing the input field
    const input = wrapper.find("input");
    input.node.value = "";
    input.simulate("blur");

    // Get the result of the handleChange callback
    expect(handleMissingCountChange.mock.calls.length).toBe(2);
    const [_, missingAfter] = handleMissingCountChange.mock.calls[1];
    expect(missingAfter).toBe(1);
});

test("TextEdit isRequired snapshot test", () => {
    const handleMissingCountChange = jest.fn();

    const wrapper = mount(
        <TextEdit
            attr="mytextedit"
            initialValue="bob"
            required={true}
            showRequired={true}
            onMissingCountChange={handleMissingCountChange}
        />
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

test("TextEdit email address validate", () => {
    const handleErrorCountChange = jest.fn();

    const wrapper = mount(
        <TextEdit
            initialValue="bob.at.gmail.com"
            onErrorCountChange={handleErrorCountChange}
            rules={{ format: "email" }}
        />
    );
    const input = wrapper.find("input");
    const div = wrapper.find("div");

    const helptext = div.find(".has-error");
    expect(helptext.node.textContent).toEqual("Value is not a valid email");

    // Get an initial snapshot of the TextEdit
    expect(toJson(div)).toMatchSnapshot();

    // Check if it shows an error (it should because it starts with an invalid email)
    expect(div.node.className).toBe("has-error");

    // Get the result of the initial call to the error count callback
    expect(handleErrorCountChange.mock.calls.length).toBe(1);
    const [, errorBefore] = handleErrorCountChange.mock.calls[0];
    expect(errorBefore).toBe(1);

    // Simulate the user clearing the input field
    input.node.value = "bob@gmail.com";
    input.simulate("blur");

    // Check if it shows an error now
    expect(div.node.className).toBe("");

    // Get an after snapshot of the TextEdit
    expect(toJson(div)).toMatchSnapshot();

    // Get the result of the error change callback
    expect(handleErrorCountChange.mock.calls.length).toBe(2);
    const [, errorAfter] = handleErrorCountChange.mock.calls[1];
    expect(errorAfter).toBe(0);
});
