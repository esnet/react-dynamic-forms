import { Chooser, TextEdit, DateEdit, Tags, Switch /*, TextArea */ } from "./components/controls";
import Field from "./components/Field";
import Form, { FormProps } from "./components/Form";
import List from "./components/List";
import Schema from "./components/Schema";
import View from "./components/View";

import { formGroup } from "./hoc/group";
import { formList } from "./hoc/list";
import { FormEditStates, FormGroupLayout } from "./util/constants";

// import TextArea from "./components/TextArea";

export {
    Form,
    FormProps,
    Schema,
    Field,
    View,
    List,
    TextEdit,
    // TextArea,
    Chooser,
    Switch,
    Tags,
    DateEdit,
    formGroup,
    formList,
    FormEditStates,
    FormGroupLayout
};
