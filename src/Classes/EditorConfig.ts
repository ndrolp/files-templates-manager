/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode'
import { CONFIGS_FOLDER, EXTENSION_MENU_PATH } from '../Utils/constants'
import { readdir, readdirSync, copyFileSync } from 'fs'
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
        vscode.window.showInformationMessage('LOADING')

        const configs: string[] = EditorConfig.getConfigs()
        vscode.window.showWarningMessage(configs[0])

        if (configs.length === 0) {
            vscode.window.showErrorMessage('There are no style guidelines')
            return
        }
        const pickedConfig = await vscode.window.showQuickPick(configs)
        if (!pickedConfig) {
            return
        }

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
                title: 'Chose the directories',
            })
        } else {
            pickedFolders = [workspacePickItems[0]]
        }

        if (!pickedFolders) {
            return
        }

        pickedFolders.forEach(folder => {
            EditorConfig.copyFiles(pickedConfig, folder.detail ?? '')
        })

        vscode.window.showInformationMessage('Files Created')
    }

    private registerCommand(command: string, method: any): vscode.Disposable {
        let disposable = vscode.commands.registerCommand(
            `${EXTENSION_MENU_PATH}.${command}`,
            method
        )

        return disposable
    }

    static getConfigs(): string[] {
        const folders = readdirSync(CONFIGS_FOLDER)
        return folders
    }

    static copyFiles(configuration: string, destination: string) {
        const BASE_FOLDER = path.join(CONFIGS_FOLDER, configuration)
        const folder_content = readdirSync(BASE_FOLDER)

        try {
            folder_content.forEach(element => {
                copyFileSync(path.join(BASE_FOLDER, element), path.join(destination, element))
            })
        } catch (error) {
            vscode.window.showErrorMessage('Files Could Not Be Created')
        }
    }
}
