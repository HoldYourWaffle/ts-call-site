import fs from 'fs'
import * as ts from 'typescript'
import trace from 'stack-trace'
import { CallExpression, Node, Project, ProjectOptions } from 'ts-morph'


export interface GetCallSiteOptions {
	stackAtCalled: Error;
	project: Project | ProjectOptions;
}


export function getCallSite(options?: Partial<GetCallSiteOptions>): CallExpression {
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
