// ESM wrapper for the no-duplicate-exports rule so ESLint can load it when the project is ESM
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow exporting the same identifier more than once',
      category: 'Possible Errors',
      recommended: false,
    },
    schema: [],
    messages: {
      duplicate: "'{{name}}' is exported more than once",
    },
  },
  create(context) {
    const namedExports = new Map();
    const defaultProps = new Map();

    function getNameFromPattern(node) {
      if (!node) return null;
      if (node.type === 'Identifier') return node.name;
      if (node.type === 'Literal') return String(node.value);
      return null;
    }

    return {
      ExportNamedDeclaration(node) {
        if (node.declaration) {
          const decl = node.declaration;
          if (decl.type === 'FunctionDeclaration' || decl.type === 'ClassDeclaration' || decl.type === 'VariableDeclaration') {
            if (decl.id) {
              namedExports.set(decl.id.name, node);
            } else if (decl.declarations) {
              for (const d of decl.declarations) {
                const n = getNameFromPattern(d.id);
                if (n) namedExports.set(n, node);
              }
            }
          }
        }
        if (node.specifiers && node.specifiers.length) {
          for (const s of node.specifiers) {
            const name = s.exported && s.exported.name;
            if (name) namedExports.set(name, s);
          }
        }
      },

      AssignmentExpression(node) {
        if (node.left && node.left.type === 'MemberExpression') {
          const left = node.left;
          if (
            left.object && left.object.type === 'Identifier' && left.object.name === 'module' &&
            left.property && left.property.type === 'Identifier' && left.property.name === 'exports'
          ) {
            const right = node.right;
            if (right && right.type === 'ObjectExpression') {
              for (const prop of right.properties) {
                if (prop.type === 'Property') {
                  const name = prop.key && (prop.key.name || (prop.key.value !== undefined && String(prop.key.value)));
                  if (name) {
                    if (defaultProps.has(name)) {
                      context.report({ node: prop, messageId: 'duplicate', data: { name } });
                    } else {
                      defaultProps.set(name, prop);
                    }
                  }
                }
              }
            }
          }
        }

        if (node.left && node.left.type === 'MemberExpression' && node.left.object.type === 'Identifier' && node.left.object.name === 'exports') {
          const prop = node.left.property;
          const name = prop && (prop.name || (prop.value !== undefined && String(prop.value)));
          if (name) {
            if (defaultProps.has(name)) {
              context.report({ node: node.left, messageId: 'duplicate', data: { name } });
            } else {
              defaultProps.set(name, node.left);
            }
          }
        }
      },

      ExportDefaultDeclaration(node) {
        const decl = node.declaration;
        if (decl && decl.type === 'ObjectExpression') {
          for (const prop of decl.properties) {
            if (prop.type === 'Property') {
              const name = prop.key && (prop.key.name || (prop.key.value !== undefined && String(prop.key.value)));
              if (name) defaultProps.set(name, prop);
            }
          }
        }
      },

      'Program:exit'() {
        for (const [name, namedNode] of namedExports) {
          if (defaultProps.has(name)) {
            const defNode = defaultProps.get(name);
            context.report({ node: defNode, messageId: 'duplicate', data: { name } });
          }
        }
      },
    };
  },
};

export default rule;
