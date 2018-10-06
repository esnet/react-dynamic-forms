import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { withKnobs, boolean } from "@storybook/addon-knobs/react";
import { withInfo } from "@storybook/addon-info";

import { Chooser, ChooserGroup } from "../../src/components/Chooser";
import Form from "../../src/components/Form";
import Schema from "../../src/components/Schema";
import Field from "../../src/components/Field";
import { FormEditStates } from "../../src/js/constants";

import Immutable from "immutable";

const Welcome = () => {
    return <p>Welcome to the forms library Storybook</p>;
};

storiesOf("Welcome", module).add("Introduction", () => <Welcome showApp={linkTo("Button")} />);

class FormWrapper extends React.Component {
    constructor(props) {
        super(props);
        const animalList = Immutable.fromJS([
            { id: "1", label: "Dog" },
            { id: "2", label: "Duck" },
            { id: "3", label: "Cat" },
            { id: "4", label: "Donkey" },
            { id: "5", label: "Fish" },
            { id: "6", label: "Hedgehog" },
            { id: "7", label: "Banana " }
        ]);
        this.state = {
            value: Immutable.fromJS({ animal: this.props.initial }),
            valueList: animalList
        };
    }

    handleChange(formName, value) {
        this.setState({ value });
        action(`onChange: ${formName} set to ${JSON.stringify(value)}`)(value);
    }

    render() {
        const schema = (
            <Schema>
                <Field
                    name="animal"
                    label="Animals"
                    placeholder="Select animal"
                    required={boolean("Required", this.props.required)}
                />
            </Schema>
        );

        return (
            <Form
                name="test"
                schema={schema}
                style={{ paddingTop: 100 }}
                value={this.state.value}
                edit={FormEditStates.ALWAYS}
                labelWidth={120}
                onChange={(name, value) => this.handleChange(name, value)}
            >
                <ChooserGroup
                    field="animal"
                    choiceList={this.state.valueList}
                    disableSearch={boolean("Disabled search", false)}
                    width={300}
                />
            </Form>
        );
    }
}

const chooserStories = storiesOf("Chooser", module);
chooserStories.addDecorator(withKnobs);
chooserStories.add(
    "basic",
    withInfo({
        header: true,
        propTables: [Chooser, Form],
        propTablesExclude: [FormWrapper],
        text: "Some **text** about this chooser thing"
    })(() => <FormWrapper initial={null} required={false} />)
);

chooserStories.add("simple", () => <FormWrapper initial={null} required={false} />);
chooserStories.add("pre-selected", () => <FormWrapper initial={3} required={false} />);
chooserStories.add("simple (required)", () => <FormWrapper initial={null} required={true} />);
chooserStories.add("pre-selected (required)", () => <FormWrapper initial={3} required={true} />);
