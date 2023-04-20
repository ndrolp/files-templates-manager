import * as vscode from "vscode";

export function createFolderQuickPickItem(
    workspaces: readonly vscode.WorkspaceFolder[]
): vscode.QuickPickItem[] {
    return workspaces.map((folder) => {
        return {
            label: folder.name,
            detail: folder.uri.fsPath,
            description: "$(folder-active)",
        };
    });
}

export function getCurrentWorkspaces() {
    const workspaces =
        vscode.workspace.workspaceFolders;

    return workspaces;
}
