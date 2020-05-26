# Import SnippetsLab plugin

This plugin allows you to import notes from SnippetsLab exported as Json (`export.json`).

# Install

```
ipm install inkdrop-import-snippetslab
```

# Usage

+ First export your 

+ Install this plugin.
+ File -> Import -> from SnippetsLab Json, then the file dialog opens.
+ Select your SnippetsLab Json (`export.json`).
+ After a while, import finishes.

# Notebook and Tags

Running this plugin will automatically create new books and tags and import your notes.

If the book or tag already exists, it will not be created.

# Language

If your note has a Language set, it will be converted to code block with these language specified.

# Fork of import-quiver

This plugin was based on [import-quiver](https://github.com/pi-chan/import-quiver) plugin.

# Contribution

If you find a bug or find an unsupported SnippetsLab note, please submit an issue or submit a pull request.
