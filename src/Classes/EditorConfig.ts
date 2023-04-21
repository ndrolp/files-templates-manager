/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode'
import { EXTENSION_MENU_PATH } from '../Utils/constants'
import { readdir, readdirSync } from 'fs'
import { createFolderQuickPickItem, getCurrentWorkspaces } from '../Utils/methods'
import { error } from 'console'
import path = require('path')

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
        const root = path.join(__dirname, '../../Configs')
        vscode.window.showInformationMessage(root)

        const files = readdirSync(root)

        if (files) {
            const settings = await vscode.window.showQuickPick(files)
        }

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

    private existingConfigs() {
        try {
            const files = readdirSync(path.join(__dirname, '../Configs'))
            files.forEach(value => {
                vscode.window.showInformationMessage(value)
            })
        } catch (error) {
            console.error(error)
        }
    }
}
