/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from "vscode";
import { EXTENSION_MENU_PATH } from "../Utils/constants";
import {
    createFolderQuickPickItem,
    getCurrentWorkspaces,
} from "../Utils/methods";

export default class EditorConfig {
    GENERATE_CONFIG_BINDER = `generate-config-binder`;
    context: vscode.ExtensionContext;

    constructor(
        context: vscode.ExtensionContext
    ) {
        this.context = context;
    }

    bindMethods() {
        this.context.subscriptions.push(
            this.registerCommand(
                this.GENERATE_CONFIG_BINDER,
                this.generateConfig
            )
        );
        vscode.window.showInformationMessage(
            "Methods Binded"
        );
    }

    async generateConfig() {
        const workspaces = getCurrentWorkspaces();
        let pickItems: vscode.QuickPickItem[] =
            [];
        if (workspaces) {
            pickItems =
                createFolderQuickPickItem(
                    workspaces
                );
        }
        let files:
            | vscode.QuickPickItem[]
            | undefined = [];

        if (pickItems.length > 1) {
            files =
                await vscode.window.showQuickPick(
                    pickItems,
                    {
                        canPickMany: true,
                        title: "Seleccciona el directorio",
                    }
                );
        } else {
            files = [pickItems[0]];
        }

        if (files) {
            vscode.window.showInformationMessage(
                files[0].label
            );
        }
    }

    private registerCommand(
        command: string,
        method: any
    ): vscode.Disposable {
        let disposable =
            vscode.commands.registerCommand(
                `${EXTENSION_MENU_PATH}.${command}`,
                method
            );

        return disposable;
    }
}
