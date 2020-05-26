"use babel";

import { remote, nativeImage } from "electron";
import fs from "fs";
import path from "path";
import { models } from "inkdrop";

const { dialog, app } = remote;
const { Book, Note, Tag, File } = models;

const db = inkdrop.main.dataStore.getLocalDB();

export function openImportDialog() {
  return dialog.showOpenDialog({
    title: "Open SnippetsLab Notebook",
    properties: ["openFile"],
    filters: [{ name: "SnippetsLab JSON", extensions: ["json"] }],
    defaultPath: app.getPath("home")
  });
}

export async function importNotebooksFromSnippetsLabLibrary(files) {
  if (files.length !== 1) {
    inkdrop.notifications.addError("Invalid file is selected.", {
      detail: e.stack,
      dismissable: true
    });
    return;
  }

  const jsonFile = files[0];
  let jsonData = '';

try {
  jsonData = JSON.parse(fs.readFileSync(jsonFile, "utf-8"));
} catch(e) {
  inkdrop.notifications.addError("Invalid JSON.", {
      detail: '',
      dismissable: true
    });
  return;
}


  if(typeof jsonData['Library Name'] == 'undefined'
      || jsonData['Library Name'] != 'main.snippetslablibrary'
    || typeof jsonData['Snippets'] != 'object') {
    inkdrop.notifications.addError("Invalid file is selected.", {
      detail: '',
      dismissable: true
    });
    return;
  }


  await jsonData['Snippets'].reduce(async (prevVal, snippetsLabNote) => {
    await prevVal;

    try {

      await findOrCreateNotebook(snippetsLabNote.Folder).then(async notebookId => {
        let body = '';

        snippetsLabNote.Fragments.forEach(fragment => {
          if(fragment.Title != 'Fragment') {
            if(body != '') body += '\n';
            body += ('# ' + fragment.Title + '\n');
          }
          body += prepareBody(fragment);
        });


        const inkdropTags = [];
        for (let i = 0, len = snippetsLabNote.Tags.length; i < len; ++i) {
          inkdropTags.push(await findOrCreateTag(snippetsLabNote.Tags[i]));
        }


        const note = new Note({
          title: snippetsLabNote.Title.slice(0, 60),
          body,
          tags: inkdropTags,
          createdAt: new Date(snippetsLabNote['Date Created'].substring(0,19)).getTime(),
          updatedAt: new Date(snippetsLabNote['Date Modified'].substring(0,19)).getTime()
        });
        note.bookId = notebookId;

        console.log("Criando note: ",note);

        note.save();

        console.log("Criou note: ",note);

      });

    } catch (e) {
      inkdrop.notifications.addError("Failed to import the SnippetsLab Notebook", {
        detail: e.stack,
        dismissable: true
      });
    }

  }, undefined);


  // await Promise.all(jsonData['Snippets'].map(async (snippetsLabNote) => {
  //   // await sleep(10 - i);
  //   // console.log(i);
  //
  //
  //
  // }));


  // jsonData['Snippets'].forEach(snippetsLabNote => {
  //
  //
  //
  // });

  return;

}

// async function importNote(noteDir, notebook) {
//   const noteMetaJsonPath = path.join(noteDir, "meta.json");
//   if (!fs.existsSync(noteMetaJsonPath)) {
//     return;
//   }
//
//   const contentJsonPath = path.join(noteDir, "content.json");
//   if (!fs.existsSync(contentJsonPath)) {
//     return;
//   }
//
//   const noteMetaData = JSON.parse(fs.readFileSync(noteMetaJsonPath, "utf-8"));
//   const { updated_at, created_at, tags } = noteMetaData;
//
//   const contentData = JSON.parse(fs.readFileSync(contentJsonPath, "utf-8"));
//   const body = prepareBody(contentData);
//
//   const inkdropTags = [];
//   for (let i = 0, len = tags.length; i < len; ++i) {
//     inkdropTags.push(await findOrCreateTag(tags[i]));
//   }
//
//   const note = new Note({
//     title: contentData.title.slice(0, 60),
//     body,
//     tags: inkdropTags,
//     createdAt: created_at * 1000,
//     updatedAt: updated_at * 1000
//   });
//   note.bookId = notebook._id;
//   await note.save();
//
//   await createAttachments(noteDir, note);
// }

// async function createAttachments(noteDir, note) {
//   const resourceDirPath = path.join(noteDir, "resources");
//   if (!fs.existsSync(resourceDirPath)) {
//     return [];
//   }
//
//   const files = fs.readdirSync(resourceDirPath);
//
//   const attachments = [];
//   for (let i = 0, len = files.length; i < len; ++i) {
//     const file = files[i];
//     const filePath = path.join(resourceDirPath, file);
//     const image = nativeImage.createFromPath(filePath);
//     const buffer = image.toPNG();
//
//     const attachment = new File({
//       name: file,
//       contentType: "image/png",
//       contentLength: buffer.length,
//       publicIn: [note._id],
//       _attachments: {
//         index: {
//           content_type: "image/png",
//           data: buffer.toString("base64")
//         }
//       }
//     });
//
//     await attachment.save();
//     attachments.push({ att: attachment, original: file });
//   }
//
//   let newBody = note.body;
//   attachments.forEach(({ att, original }) => {
//     const target = `snippetslab-image-url/${original}`;
//     newBody = newBody.replace(target, `inkdrop://${att._id}`);
//   });
//
//   note.body = newBody;
//   await note.save();
// }

function prepareBody(contentData) {

  switch (contentData.Language) {
    case "Plain Text":
      return contentData.Content
          .replace("\n", "\n\n");
    case "Markdown":
      return contentData.Content;
    default:
      return `
\`\`\`${contentData.Language}
${contentData.Content}
\`\`\``;
  }
}

async function findOrCreateNotebook(notebookName) {
  const state = inkdrop.store.getState();

  // console.log(db.books.);
  // console.log(state.books.all);

  return db.books.findWithName(notebookName).then(async foundNotebook => {
    console.log("Encontrou notebook: ",foundNotebook);

    if (foundNotebook) {
      return foundNotebook._id;
    }

    // Or, create new note.
    const createdAt = new Date().getTime();
    const updatedAt = new Date().getTime();

    const book = new Book({
      name: notebookName,
      createdAt: createdAt,
      updatedAt: updatedAt
    });

    return db.books.put(book).then(response => {
      console.log("Criou notebook: ",response);
      return response.id;
    });

    // await book.save();
    // return book;

  });
  //
  // const foundNotebook = state.books.all.find(note => note.name === notebookName);
  // if (foundNotebook) {
  //   return foundNotebook;
  // }
  //
  // // Or, create new note.
  // const createdAt = new Date().getTime();
  // const updatedAt = new Date().getTime();
  //
  // const book = new Book({
  //   name: notebookName,
  //   createdAt: createdAt,
  //   updatedAt: updatedAt
  // });
  // await book.save();
  // return book;
}

async function findOrCreateTag(tagName) {
  const state = inkdrop.store.getState();
  const foundTag = state.tags.all.find(tag => tag.name === tagName);
  if (foundTag) {
    return foundTag._id;
  }

  const tag = new Tag({
    name: tagName
  });
  await tag.save();
  return tag._id;
}
