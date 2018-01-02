import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "No subclasses allowed";

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

class NoSubclassWalker extends Lint.AbstractWalker<Set<string>> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (this.isInvalidNode(node)) {
                this.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
    
            return ts.forEachChild(node, cb);
        };

        return ts.forEachChild(sourceFile, cb);
    }

    public isInvalidNode(node: ts.Node): boolean {
        return this.isClassLikeDeclaration(node) && this.hasExtends(node);
    
    }

    public isClassLikeDeclaration(node: ts.Node): boolean {
        return node &&
            (node.kind === ts.SyntaxKind.ClassDeclaration || node.kind === ts.SyntaxKind.ClassExpression);
    }

    public hasExtends(node: ts.Node): boolean {
        if (!node || (<any>node).heritageClauses === undefined) {
            return false;
        }
        const heritage = (<{ heritageClauses: ts.HeritageClause[] }><any>node).heritageClauses;

        return heritage.some(clause => clause.token === ts.SyntaxKind.ExtendsKeyword);
    }
}