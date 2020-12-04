import { CallExpression } from 'ts-morph'
import { getCallSite } from '../src'
import { isMarker, isMarked } from './test-util'


//FIXME #2
describe.skip('expression calls', () => {
	
	describe('return value', () => {
		test('usage', () => {
			function get(): CallExpression {
				return getCallSite();
			}
			
			expect(isMarker(get()/*@*/.getTrailingCommentRanges()[0])).toBe(true);
		})
		
		describe('invocation', () => {
			test('outer', () => {
				function get(): () => CallExpression {
					const caller = getCallSite();
					return () => caller;
				}
	
				expect(isMarked(get()()/*@*/)).toBe(true);
			})
	
			test('inner', () => {
				function get(): () => CallExpression {
					return () => getCallSite();
				}
	
				expect(isMarked(get()/*@*/())).toBe(true);
			})
		})
	})
	
	describe('IIFE', () => {
		test('arrow function', () => {
			expect(isMarked(
				(() => getCallSite())
					() /*@*/
			)).toBe(true);
		})

		test('anonymous function', () => {
			expect(isMarked(
				(function () { return getCallSite() })
					() /*@*/
			)).toBe(true);
		})
	})

	describe('indexed invocation', () => {
		describe('array', () => {
			test('outer', () => {
				function get(): [ () => CallExpression ] {
					return [ () => getCallSite() ];
				}

				expect(isMarked(get()[0]()/*@*/));
			})

			test('inner', () => {
				function get(): [ () => CallExpression ] {
					const caller = getCallSite();
					return [ () => caller ];
				}

				expect(isMarked(get()/*@*/[0]()));
			})
		})
		
		describe('object', () => {
			test('outer', () => {
				function get() {
					return { x: () => getCallSite() };
				}

				expect(isMarked(get()['x']()/*@*/));
			})

			test('inner', () => {
				function get() {
					const caller = getCallSite();
					return { x: () => caller };
				}

				expect(isMarked(get()/*@*/['x']()));
			})
		})
	})
})
