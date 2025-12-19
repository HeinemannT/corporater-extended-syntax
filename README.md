# corporater-extended-syntax
A custom Visual Studio Code extension for Corporater Extended Code, a proprietary scripting language used in the Corporater Business Management Platform (BMP)


🚀 Features
1. Syntax HighlightingContext-Aware Coloring: Differentiates between Transactional Methods (write/change) and Functional Methods (read/calculate).
Embedded Languages: Automatically highlights HTML, CSS, and JSON inside Extended strings when variables are named correctly (e.g., vMyHtml, vContainerStyle).
Model Recognition: Highlights valid Model Roots (e.g., root.organisation, root.risk) and ID prefixes (e.g., ceven., fas.).

2. "Resilience" Linting Catches common runtime errors before you deploy: 
❌ Flags Illegal NOT usage (Extended only supports NOT IN or NOT CONTAINS).
❌ Flags Unwrapped Conditional Assignments (e.g., v := IF... must be v := (IF...)).
⚠️ Deprecation warnings for .isMissing() (recommends = MISSING).

3. Productivity Snippets

Stop writing boilerplate. Use these triggers to generate complex structures instantly:
Trigger
Description
loop-binary
Binary Decomposition Loop: Generates the complex list-doubling algorithm required to iterate over strings or numbers (where .forEach isn't natively available).transactionSafe Transaction: Creates an IF/THEN/ELSE block for this.object.change() calls to prevent silent failures.assign-ifConditional Assignment: Safely wraps an IF/THEN/ELSE assignment in brackets ( ).select-safeStandard Query: Generates a SELECT ... FROM ... WHERE template.html-varHTML Builder: Creates a variable block with injected CSS styles for easier UI development.if-falseFalse Check: Generates the correct IF x = FALSE pattern (since IF NOT x is illegal).debug-logLogger: Scaffolds a script that builds and returns a log string for debugging.🛠 InstallationOption 1: Manual Installation (Quickest)Navigate to your VS Code extensions folder:Windows: %USERPROFILE%\.vscode\extensionsMac/Linux: ~/.vscode/extensionsCreate a new folder named corporater-extended.Copy the files from this repository (package.json, language-configuration.json, syntaxes/, snippets/) into that folder.Restart VS Code.Option 2: Build VSIX PackageIf you have vsce installed (Node.js required):Bashnpm install -g vsce
cd corporater-extended
vsce package
Then install the generated .vsix file in VS Code via Extensions > ... > Install from VSIX.📖 Usage GuideFile AssociationsThe extension automatically activates for files ending in:.ext.extendedYou can also manually set the language mode to Extended for any .txt file via the status bar.Embedded Syntax ExampleTo trigger HTML highlighting inside an Extended file, name your variable with an Html suffix:JavaScript// The string below will be highlighted as HTML
vCardHtml := '<div class="card">
    <span>' + this.object.name + '</span>
</div>'
To trigger CSS highlighting, use the Style suffix:JavaScript// The string below will be highlighted as CSS
vHeaderStyle := "color: blue; font-weight: bold;"
⚠️ Known Language ConstraintsExecution: Code runs sequentially. The return value is always the result of the last executed line 1.Loops: There are no for or while loops. Use .forEach() on lists. Use the loop-binary snippet for fixed-count iterations2.Booleans: Never use IF NOT variable. Use IF variable = FALSE 3.DisclaimerThis is a community-created tool and is not officially affiliated with Corporater. Use at your own risk.