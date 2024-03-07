import pkg from '../package.json';
const { version } = pkg;
import type { Rule } from 'eslint'

export default {
  meta: {
    type: "suggestion",
    version,
    messages: {
      mutable: "localStorage.setItem is not allowed in this scope without a try catch block"
    }
  },

  create(context: Rule.RuleContext) {
    const sourceCode = context.sourceCode;
    const obj: Rule.NodeListener = {
      MemberExpression(node) {
        let scope: any = sourceCode.getScope(node);
        const objectName = 'name' in node.object && node.object.name;
        const propertyName = 'name' in node.property && node.property.name;

        if (scope.block === node) {
          scope = scope.upper;
        }

        if (objectName !== 'localStorage' || propertyName !== 'setItem') {
          return;
        }

        while (scope && scope.type !== 'module' && scope.type !== null) {

          if (scope.type === 'block' && scope.block.parent?.type === 'TryStatement') {
            return;
          }
          scope = scope.upper;
        }


        context.report({ node, messageId: "mutable" });
      }
    }

    return obj
  }
} as unknown as Rule.RuleModule
