const execute = require("child_process").execSync

// The modchild_processule 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function GenarateParamDoc(dict,tpp){
	// 生成doc文本
	if (dict.length!=0){
		result = `\n${' '.repeat(tpp)}params:`
	}
	else{
		result = ""
	}
	console.log("执行生成参数")
	console.log(dict)
	
	for(var dt in dict){
		var t = `
${' '.repeat(tpp+4)}* ${dict[dt].name} ->:
${' '.repeat(tpp+8)}meaning:
${' '.repeat(tpp+8)}type: ${dict[dt].annotation}
${' '.repeat(tpp+8)}optional: [${dict[dt].default}]`

result = result + t
	}
	console.log(result)
	return result
 }


function get_params(command_string,tpp){
	rt = "None"
	// 如果存在->那么取出值并覆盖
	if(command_string.search("->") != -1){
		rt = /->(.*):/.exec(command_string)[1]
	}
	command_string = command_string.replace(/(^\s*)/g, "");
	console.log(command_string)
	var func_name = /^def ([_\da-zA-Z]+)\(.*/.exec(command_string)[1]
	console.log(func_name)
	var comon = `python -c "
import inspect
import json
result = []
${command_string}
    pass
for x in inspect.signature(${func_name}).parameters.values(): 
	result.append(dict(name=x.name, annotation=x.annotation.__name__ if x.annotation != inspect._empty else 'Not described', default= x.default if x.default != inspect._empty else 'Not described')) 
print(json.dumps(result))
"`
	console.log(comon)
	var message = execute(comon).toString();
	console.log(JSON.parse(message))
	return {
		"params":GenarateParamDoc(JSON.parse(message), tpp),
		"rt": rt
}
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
		rt = get_params(func_signature, tpp)
		console.log(rt)
		
		var annotation = `
${' '.repeat(tpp)}"""
${' '.repeat(tpp)}explanation:
${' '.repeat(tpp+4)}--> function_meaning		
${rt.params}
${' '.repeat(tpp)}return:
${' '.repeat(tpp+4)}${rt.rt}
	
${' '.repeat(tpp)}demonstrate:
${' '.repeat(tpp+4)}Not described
	
${' '.repeat(tpp)}output:
${' '.repeat(tpp+4)}Not described
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
