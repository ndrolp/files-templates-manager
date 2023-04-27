import * as vscode from 'vscode'
import { CONFIGS_FOLDER, EXTENSION_MENU_PATH } from '../Utils/constants'
import decompress = require('decompress')
import path = require('path')
import { existsSync, mkdir, mkdirSync } from 'fs'

export default class Import {
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
            filters: {
                ZIP: ['zip'],
            },
        }

        const file = await vscode.window.showOpenDialog(options)
        if (!file) {
            return
        }

        const filename = 'IMPORTED - ' + file[0].path.split('/')[file[0].path.split('/').length - 1]
        let folderName = filename.split('.')[0]
        folderName = path.join(CONFIGS_FOLDER, folderName)

        if (!existsSync(folderName)) {
            mkdirSync(folderName)
        } else {
            vscode.window.showErrorMessage('There is already an import with that name')
            return
        }

        decompress(file[0].fsPath, folderName)
        vscode.window.showInformationMessage('Files Imported')
    }
}
