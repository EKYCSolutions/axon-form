## 0.0.4

- Added `navigateToPage` to `AxonFormController` for jumping directly to a page by ID, validating each preceding page a
  long the way and landing on the first one that fails.
- Added `loadForm` to `AxonFormController` for bulk-loading a map of field values into the form, validating each field
  (including address dropdown fields) as it's applied.

## 0.0.3

- Bug fixes

## 0.0.2

- Bug fixes

## 0.0.1

- Initial release of `axon_form_flutter`.
- Added cross-platform plugin scaffolding for Android, iOS, and Web.
- Added dynamic form rendering foundation with configurable fields, validation, and file upload support.
