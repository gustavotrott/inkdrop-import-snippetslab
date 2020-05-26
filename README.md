# Import SnippetsLab plugin

This plugin allows you to import notes from SnippetsLab exported as Json (`export.json`).

# Install

```
ipm install inkdrop-import-snippetslab
```

# Usage

+ First export your notes in SnippetsLab:

Choose File > Export… from the menubar.

![inkdrop-export](https://user-images.githubusercontent.com/5660191/82855312-58a10800-9ee1-11ea-8149-dc697feca0ae.png)

Choose a location and format Json, then click Export.

![inkdrop-export-json](https://user-images.githubusercontent.com/5660191/82855315-5b9bf880-9ee1-11ea-8df5-bb6c2712f56a.png)

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
