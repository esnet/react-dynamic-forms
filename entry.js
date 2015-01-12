/** @jsx React.DOM */

"use strict";

//
// Entry point
//

module.exports = {
    //Form widgets
    TextEdit: require('./lib/components/textedit.jsx'),
    TextArea: require('./lib/components/textarea.jsx'),
    Chooser: require('./lib/components/chooser.jsx'),
    OptionButtons: require('./lib/components/optionbuttons.jsx'),
    OptionList: require('./lib/components/optionlist.jsx'),
    TagsEdit: require('./lib/components/tagsedit.jsx'),
    //Search and filtering
    SearchBox: require('./lib/components/searchbox.jsx'),
    TextFilter: require('./lib/components/textfilter.jsx'),
    //Group widget and group wrappers
    Group: require('./lib/components/group.jsx'),
    ChooserGroup: require('./lib/components/choosergroup.jsx'),
    OptionsGroup: require('./lib/components/choosergroup.jsx'),
    TagsGroup: require('./lib/components/tagsgroup.jsx'),
    TextAreaGroup: require('./lib/components/textareagroup.jsx'),
    TextEditGroup: require('./lib/components/texteditgroup.jsx'),
    //Actions
    DeleteAction: require('./lib/components/delete.jsx'),
    //Top level form mixin
    FormMixin: require('./lib/components/formmixin.jsx'),
    //Top level form error display
    FormErrors: require('./lib/components/formerrors.jsx'),
    //Lists
    ListEditView: require('./lib/components/listeditormixin.jsx'),
    ListEditorMixin: require('./lib/components/listeditormixin.jsx'),
    //Schema
    Schema: require('./lib/components/schema.jsx'),
    Attr: require('./lib/components/attr.jsx'),
}
