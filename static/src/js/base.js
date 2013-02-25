/*global: openerp, CKEDITOR */

/* CKEDITOR_BASEPATH is needed to locate javascript config file and language
   files that are downloaded automatically by ckeditor.  The base path cannot
   be computed dynamically when in "production" mode when all javascript
   dependencies are concatened.

   Note: Don't forget the ending slash !
*/
CKEDITOR_BASEPATH = '/web_ckeditor/static/lib/js/ckeditor/';

function destroy_ckeditor(instance) {
    try {
        this.editor.destroy(true);
    } catch(e) {
        console.log("Silenced a CKEditor destroy exception.");
    }
}


openerp.web_ckeditor = function (oe) {

    var QWeb = oe.web.qweb,
    _t  = oe.web._t,
    _lt = oe.web._lt;

    // XXXvlab: Use custom widgets registry ? this didn't work as expected ;)
    oe.web.form.widgets.add('ckeditor', 'openerp.web_ckeditor.FieldTextCKEditor');

    oe.web_ckeditor.FieldTextCKEditor = oe.web.form.AbstractField.extend(oe.web.form.ReinitializeFieldMixin, {
        template: 'FieldCKEditor',
        display_name: _lt('CKEditor'),
        widget_class: 'oe_form_field_ckeditor',
        events: {
            'change input': 'store_dom_value',
        },

        init: function (field_manager, node) {
            this._super(field_manager, node);
            this.editor = false; // will store ckeditor instance
        },

        initialize_content: function() {
            var self = this;
            if (this.editor)
                destroy_ckeditor(this.editor);
            this.editor = false;
            this.setupFocus(this.$('textarea'));
            if (!this.get('effective_readonly')) {
                this.editor = CKEDITOR.replace(this.name);
                this.editor.on('dataReady', function() {
                    self.$('iframe').contents()
                        .find('[contenteditable="true"]')
                        .on('change keyup', function() {
                            self.trigger('changed_value');
                        });
                });
            }
        },

        store_dom_value: function () {
            if (!this.get('effective_readonly')
                && this.editor !== false
                && this.editor.getData().length
                && this.is_syntax_valid()) {
                this.internal_set_value(
                    this.parse_value(
                        this.editor.getData()));
            }
        },

        commit_value: function () {
            this.store_dom_value();
            return this._super();
        },

        render_value: function() {
            var show_value = this.format_value(this.get('value'), '');
            if (!this.get("effective_readonly")) {
                this.editor.setData(show_value);
            } else {
                this.$(".oe_form_field_text").html(show_value);
            }
        },

        is_syntax_valid: function() {
            if (!this.get("effective_readonly") &&
                this.editor && this.editor.getData().length > 0) {
                try {
                    this.parse_value(this.editor.getData(), '');
                    return true;
                } catch(e) {
                    return false;
                }
            }
            return true;
        },

        parse_value: function(val, def) {
            return oe.web.parse_value(val, this, def);
        },

        format_value: function(val, def) {
            return oe.web.format_value(val, this, def);
        },

        is_false: function() {
            return this.get('value') === '' || this._super();
        },

        focus: function() {
            this.$('textarea:first')[0].focus();
        },

        set_dimensions: function (height, width) {
            this._super(height, width);
            this.$('textareat').css({
                height: height,
                width: width
            });
        },

        destroy: function() {
            if (this.editor) {
                destroy_ckeditor(this.editor);
                this.editor = false;
            }
        }
    });
};
