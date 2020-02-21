// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

 function ParsingSignature(text){
	rt = {}
}

function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerTextEditorCommand('extension.GenerateAnnotation', function () {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
	
		
		var selection = editor.selection;
		console.log(selection)
		var document = editor.document
		var func_line = selection.active.line - 1;
		if (func_line <0 ){
			// 排除第一行空行的情况
			vscode.window.showWarningMessage('Operation Are Allowed At First Line !');
			return 
		}
		var func_signature = document.lineAt(selection.active.line-1).text;
		if (func_signature.search("def") ==-1){
			// 排除未出现def的情况 
			vscode.window.showWarningMessage('The function definition is not appeared at the last line !');
			return
		}
		// 前一函数缩进空格数量
		var tpp = func_signature.split('def')[0].length + 4
		// todo: 生成一个指定格式返回格式的字符串
		

		var rt = ParsingSignature(func_signature)
		
		var annotation = `
${' '.repeat(tpp)}"""
${' '.repeat(tpp)}explanation:
${' '.repeat(tpp+4)}--> function_meaning 
			
${' '.repeat(tpp)}params:
${' '.repeat(tpp+4)}* name ->:
${' '.repeat(tpp+8)}meaning:
${' '.repeat(tpp+8)}type:
${' '.repeat(tpp+8)}optional:
	
${' '.repeat(tpp)}return:
${' '.repeat(tpp+4)}ReturnType
	
${' '.repeat(tpp)}demonstrate:
${' '.repeat(tpp+4)}---> 
	
${' '.repeat(tpp)}output:
${' '.repeat(tpp+4)}--->
${' '.repeat(tpp)}"""
`		
	
		editor.edit(function (editBuilder){
			// selection.active.character = 0
			editBuilder.insert( selection.active, annotation);
		})
	
		vscode.window.showInformationMessage('Generate code successful!');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
