/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode'
import { EXTENSION_MENU_PATH } from '../Utils/constants'
import { createFolderQuickPickItem, getCurrentWorkspaces } from '../Utils/methods'

export default class EditorConfig {
    GENERATE_CONFIG_BINDER = `generate-config-binder`
    context: vscode.ExtensionContext

    constructor(context: vscode.ExtensionContext) {
        this.context = context
    }

    bindMethods() {
        this.context.subscriptions.push(
            this.registerCommand(this.GENERATE_CONFIG_BINDER, this.generateConfig)
        )
        vscode.window.showInformationMessage('Methods Binded')
    }

    async generateConfig() {
        const workspaces = getCurrentWorkspaces()
        let workspacePickItems: vscode.QuickPickItem[] = []

        if (!workspaces) {
            vscode.window.showErrorMessage('No open directory')
            return
        }

        if (workspaces) {
            workspacePickItems = createFolderQuickPickItem(workspaces)
        }
        let pickedFolders: vscode.QuickPickItem[] | undefined = []

        if (workspacePickItems.length > 1) {
            pickedFolders = await vscode.window.showQuickPick(workspacePickItems, {
                canPickMany: true,
                title: 'Choce the directories',
            })
        } else {
            pickedFolders = [workspacePickItems[0]]
        }

        if (pickedFolders) {
            vscode.window.showInformationMessage(pickedFolders[0].label)
        }
    }

    private registerCommand(command: string, method: any): vscode.Disposable {
        let disposable = vscode.commands.registerCommand(
            `${EXTENSION_MENU_PATH}.${command}`,
            method
        )

        return disposable
    }
}
