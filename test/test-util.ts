import { CallExpression, CommentRange } from 'ts-morph'


/**
 * Return if the given CallExpression has a trailing '/*@*\/' comment.
 * Used to check if the returned call site is the actual expected call-site
 */
export function isMarked(callsite: CallExpression): boolean {
	return isMarker(callsite.getTrailingCommentRanges()[0]);
}

export function isMarker(comment?: CommentRange): boolean {
	return comment?.getText() === '/*@*/';
}
