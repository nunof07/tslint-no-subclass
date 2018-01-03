import * as ts from "typescript";
import * as Lint from "tslint";

/**
 * No subclass rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    /**
     * Error message when node is invalid.
     */
    public static FAILURE_STRING = "Subclass not allowed";

    /**
     * Apply this rule to the source file and return failures.
     * @param sourceFile Source file.
     */
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new NoSubclassWalker(
                sourceFile,
                this.ruleName,
                new Set(this.ruleArguments.map(String))
            )
        );
    }
}

/**
 * No subclass walker.
 */
class NoSubclassWalker extends Lint.AbstractWalker<Set<string>> {
    /**
     * Walk through the source file and process invalid nodes.
     * @param sourceFile Source file.
     */
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (this.isInvalidNode(node)) {
                this.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
    
            return ts.forEachChild(node, cb);
        };

        return ts.forEachChild(sourceFile, cb);
    }

    /**
     * Determines if node is invalid according to this rule.
     * @param node Node.
     */
    public isInvalidNode(node: ts.Node): boolean {
        if (this.isClassLikeDeclaration(node)) {
            const extendsClauses = this.extendsClauses(node);
            const hasExtends = (extendsClauses.length > 0);

            if (hasExtends) {
                if (!this.hasAllowedOptions() || this.hasInvalidParent(extendsClauses)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Determines if node is a class-like declaration.
     * @param node Node.
     */
    public isClassLikeDeclaration(node: ts.Node): boolean {
        return node &&
            (node.kind === ts.SyntaxKind.ClassDeclaration || node.kind === ts.SyntaxKind.ClassExpression);
    }

    /**
     * Return all heritage clauses with extends keyword found in node.
     * @param node Node.
     */
    public extendsClauses(node: ts.Node): ts.HeritageClause[] {
        return this.heritageClauses(node)
            .filter(clause =>
                clause.token === ts.SyntaxKind.ExtendsKeyword
            );
    }

    /**
     * Safely return all heritage clauses from node.
     * @param node Node.
     */
    public heritageClauses(node: ts.Node): ts.HeritageClause[] {
        if (!node || (<any>node).heritageClauses === undefined) {
            return [];
        }

        return (<{ heritageClauses: ts.HeritageClause[] }><any>node).heritageClauses;
    }

    /**
     * Whether exceptions have been specified for which inheritance should be allowed.
     */
    public hasAllowedOptions() {
        return this.options.size;
    }

    /**
     * Determines if at least one parent is not allowed according to the options.
     * @param extendsClauses 
     */
    public hasInvalidParent(extendsClauses: ts.HeritageClause[]) {
        const parents = this.parentNames(extendsClauses);

        return parents.some(parent =>
            !this.options.has(parent)
        );
    }

    /**
     * Get names of parent classes.
     * @param extendsClauses 
     */
    public parentNames(extendsClauses: ts.HeritageClause[]) {
        return extendsClauses.map(clause =>
            (
                clause.types &&
                clause.types.length > 0 &&
                clause.types[0].expression &&
                clause.types[0].expression.getText()
            ) || ''
        );
    }
}