import * as vscode from 'vscode'
import { EXTENSION_MENU_PATH } from '../Utils/constants'

class Import {
    context: vscode.ExtensionContext
    IMPORT_ZIP_BINDER = `import-zip-binder`

    constructor(context: vscode.ExtensionContext) {
        this.context = context
    }

    bindMethods() {
        this.context.subscriptions.push(
            this.registerCommand(this.IMPORT_ZIP_BINDER, this.importZip)
        )
    }

    private registerCommand(command: string, method: any): vscode.Disposable {
        let disposable = vscode.commands.registerCommand(
            `${EXTENSION_MENU_PATH}.${command}`,
            method
        )

        return disposable
    }

    async importZip() {
        const options: vscode.OpenDialogOptions = {
            canSelectMany: false,
            openLabel: 'Select',
            canSelectFiles: true,
            canSelectFolders: false,
        }

        const file = await vscode.window.showOpenDialog(options)
        if (!file) {
            return
        }
    }
}
