'use babel';

import ImportSnippetsLabMessageDialog from './import-snippetslab-message-dialog';

module.exports = {

  activate() {
    inkdrop.components.registerClass(ImportSnippetsLabMessageDialog);
    inkdrop.layouts.addComponentToLayout(
      'modal',
      'ImportSnippetsLabMessageDialog'
    )
  },

  deactivate() {
    inkdrop.layouts.removeComponentFromLayout(
      'modal',
      'ImportSnippetsLabMessageDialog'
    )
    inkdrop.components.deleteClass(ImportSnippetsLabMessageDialog);
  }

};
