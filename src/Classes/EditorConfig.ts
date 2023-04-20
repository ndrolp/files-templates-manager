/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from "vscode";
import { EXTENSION_MENU_PATH } from "../Utils/constants";
import { METHODS } from "http";

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

    generateConfig() {
        vscode.window.showInformationMessage(
            "HELLO WORLD"
        );
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
