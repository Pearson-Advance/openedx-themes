# Pearson Comprehensive Themes

## i18n

You can create translation catalogues to translate custom strings in your theme templates or extend edx-platform translations. Theme translations are not enabled by default and the process requires some manual steps.

There are a few concepts to keep in mind when starting to work with translations. First, each theme folder must contain the catalogues of the translations; Second, edx-platform must be aware of the translation catalogues in your theme folder; Finally, you must translate the catalogues manually and compile the translation files.

See: openedx-themes/edx-platform/pearson-pols-theme/conf/locale as an example.

### Creating translation catalogues:

Create this folder structure in your theme folder: openedx-themes/edx-platform/your-theme-folder/conf/locale.

Inside the locale folder, create a new file called: babel.cfg and copy the contents of openedx-themes/edx-platform/pearson-pols-theme/conf/locale/babel.cfg to this file. You can edit this file according to the requirements of your theme.

Then go to the Makefile in the root path of the project and find these variables: theme and
lang_targets. The theme variable points to the theme path you want to work on and the lang_targets variable is a list of the languages you want to enable in your theme; These languages must be in ISO code: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes

Finally run: *make create_translations_catalogs*, this command will extract all the strings from your templates and create the django.po and djangojs.po files that contain the strings to translated.

### Configuring edx-platform:

For edx-platform to know the translation catalogue in your theme, you need to configure COMPREHENSIVE_THEME_LOCALE_PATHS, this is a list containing the path of the translation catalogues in your theme e.g. /edx/app/edx-themes/edx-platform/pearson-pols-theme/conf/locale. This path must be the container or server path.

### Translating catalogues and compiling files:

Depending on the languages you have enabled you can add the custom translations directly to the django.po and djangojs.po files. When all the strings are manually translated, run: *make compile_translations* to create the django.mo and djangojs.mo files. These are the compiled files used in edx-platform.

### Notes:

 - If you need to add/update strings in your language catalogue files, run: *make update_translations*
 - If you are working on devstack, you will probably need to add the edx-platform setting directly to the lms.yml file in the LMS container.
