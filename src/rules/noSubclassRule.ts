import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
};

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, cb);

    function cb(node: ts.Node): void {
        if (isInvalidNode(node)) {
            ctx.addFailureAtNode(node, "No subclasses allowed.");
        }
        
        return ts.forEachChild(node, cb);
    }
}

function isInvalidNode(node: ts.Node): boolean {
    return node &&
        (node.kind === ts.SyntaxKind.ClassKeyword || node.kind === ts.SyntaxKind.ClassDeclaration);

}