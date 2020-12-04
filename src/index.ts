import fs from 'fs'
import ts from 'typescript'
import trace from 'stack-trace'
import { CallExpression, Node, Project, ProjectOptions } from 'ts-morph'


export interface GetCallSiteOptions {
	/** An `Error` object containing the stack representing the call to be analyzed. If none is provided, one is created. */
	stackAtCalled?: Error;
	
	/**
	 * A `Project` instance or `ProjectOptions` from `ts-morph`. Used to setup source analysis.
	 *
	 * Re-using a Project instance among multiple getCallSite calls will almost certainly result in a big performance boost.
	 */
	project?: Project | ProjectOptions;
}


/**
 * Analyzes stackframes and source maps to get a function's call site as AST node.
 *
 * **This function relies on source maps!**
 * Please make sure that source maps are enabled before using this function.
 */
export function getCallSite(options?: GetCallSiteOptions): CallExpression {
	//TODO is it possible to check if source maps are enabled?
	
	const stackProvider: Error = options?.stackAtCalled ?? new Error();
	// If the stackProvider was set to a default value an extra stack frame has to be 'ignored' (current getCallSite execution)
	const frame = trace.parse(stackProvider)[ options?.stackAtCalled == undefined ? 2 : 1 ];

	const project =
		options?.project instanceof Project
			? options.project
			: createProject(frame.getFileName(), options?.project);

	const source = project.getSourceFileOrThrow(frame.getFileName());

	for (const node of source.getDescendants()) {
		if (Node.isCallExpression(node) && frame.getLineNumber() === node.getStartLineNumber() && frame.getColumnNumber() - 1 === node.getStart() - node.getStartLinePos()) {
			return node;
		}
	}

	throw new ReferenceError(`No CallExpression in ${frame.getFileName()} at ${frame.getLineNumber()}:${frame.getColumnNumber()}`);
}


/**
 * Create a `Project` instance based on a file in that project.
 * If no `tsConfigFilePath` was provided, the nearest to `projectFile` will be used.
 */
function createProject(projectFile: string, options?: ProjectOptions): Project {
	if (options?.tsConfigFilePath != undefined) {
		// No work necessary
		return new Project(options);
	}

	// Look for tsconfig
	const tsConfigFilePath = ts.findConfigFile(projectFile, file => fs.existsSync(file));
	if (tsConfigFilePath == undefined) {
		throw new ReferenceError(`Could not find tsconfig for ${projectFile} and none was provided`);
	}

	return new Project(Object.assign({ tsConfigFilePath }, options));
}
