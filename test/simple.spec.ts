import { CallExpression } from 'ts-morph'
import { getCallSite } from '../src'
import { isMarked } from './test-util'


describe('simple calls', () => {
	test('plain', () => {
		function get(): CallExpression {
			return getCallSite();
		}
		
		expect(isMarked(get() /*@*/)).toBe(true);
	})

	test('stackAtCalled', () => {
		function get(): CallExpression {
			return proxy(new Error());
		}

		function proxy(stackAtCalled: Error): CallExpression {
			return getCallSite({ stackAtCalled });
		}

		expect(isMarked(get() /*@*/)).toBe(true);
	})
	
	test('arrow function', () => {
		const get = () => getCallSite();
		expect(isMarked(get() /*@*/)).toBe(true);
	})
	
	test('inner function', () => {
		function get(): CallExpression {
			return inner() /*@*/;

			function inner(): CallExpression {
				return getCallSite();
			}
		}

		expect(isMarked(get())).toBe(true);
	})
})
