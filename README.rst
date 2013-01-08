====================
CKEditor for OpenERP
====================


Description
===========

This OpenERP 7.0 module defines a ``ckeditor`` FormField widget. It
currently use CKEditor version 4.0 but should be easily usable with any
recent build (see configuring CKEditor section.).

CKEditor is a full featured and configurable WYSIWYG editor for simple
HTML content.


Usage
=====

Modify the XML view definition to add attribute ``widget`` set to
``ckeditor`` on any text field. ie::

    <form>
        ...
        <field name="myfield" widget="ckeditor">
        ...
    </form>


Configuring CKEditor
====================

Currently, the provided CKEditor build is the standard 4.0 build with
French/English language support.

If you which any other variation, you can go to `CKEditor Builder`_
and craft your ``CKEditor`` following your needs. Then uncompress it
in the the module files in ``MODULE_ROOT/static/lib/js/ckeditor``.

.. _CKEditor Builder: http://ckeditor.com/builder
