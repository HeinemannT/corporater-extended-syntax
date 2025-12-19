import * as vscode from 'vscode';

// --- ARCHITECT KNOWLEDGE BASE ---
// Concise, expert-level advice.

const architectNotes: { [key: string]: string } = {
    // --- TRANSACTIONAL ---
    'add': `**add(objectType, [prop := val, ...])**

Adds a new object instance under the context object.

* **Limitation:** Cannot use templates from Defaults/TemplateCategory directly. Use base type + \`.link()\` instead.
* **Example:** \`o.137.add(Scorecard)\` or \`t.6938.add(Kpi, name := "Revenue")\``,

    'affixLink': `**affixLink(templateObject)**

Links a model object to a template, enabling template inheritance.

* **Example:** \`t.8345.affixLink(t.432)\``,

    'change': `**change(prop := val, ...)**

Modifies properties of an object or list.

* **Performance:** Bulk changes trigger individual update events. Use sparingly on large lists.
* **Pitfall:** Changing an \`id\` breaks external string references not using the internal GUID.
* **Example:** \`t.KP001.change(name := "Revenue")\``,

    'clear': `**clear([prop1], ...)**

Clears properties (object context) or InputView variables (session/view context).

* **Object:** \`myKpi.clear(description)\`
* **Session:** \`clear(testStr)\``,

    'copy': `**copy(object, [prop := val, ...])**

Duplicates an object to the current location.

* **Example:** \`t.870.copy(t.499, id := "MYNEWID")\``,

    'delete': `**delete()**

Permanently removes the object. **No Undo.**

* **Architect Advice:** Prefer setting \`status := "Archived"\` or \`inScope := FALSE\` for audit trails.
* **Example:** \`t.9683.delete()\``,

    'error': `**error(message)**

Aborts script execution immediately with a message. Useful for validation gates.

* **Example:** \`IF x=0 THEN error("Zero value") ENDIF\``,

    'generate': `**generate([includeId])**

Outputs the transactional code needed to recreate this object (useful for migration).

* **Params:** \`includeId\` (boolean) - if true, includes the specific ID assignments.`,

    'link': `**link(templateObject)**

Creates a linked copy of a template as a child.

* **Best Practice:** Use for structural objects (Scorecards) to ensure standard updates flow down.
* **Example:** \`t.2389.link(t.500)\``,

    'move': `**move(destinationObject)**

Re-parents an object.

* **Limitation:** Cannot move objects between different Models/Roots.`,

    'moveAfter': `**moveAfter(destinationObject)**

Reorders this object to sit immediately *after* the target.`,

    'moveBefore': `**moveBefore(destinationObject)**

Reorders this object to sit immediately *before* the target.`,

    'notify': `**notify(subject, [body], [recipients], [category])**

Sends a system notification. Defaults to System Admin if no recipient specified.`,

    'reset': `**reset([prop1], ...)**

Reverts overridden properties on a linked object back to their template values.

* **Example:** \`t.67203.reset(name)\``,

    'sendmail': `**sendmail(subject, body, recipients)**

Sends an email. Body supports HTML (use \`md()\` to convert markdown).

* **Example:** \`sendmail("Update", "Check this", "user@example.com")\``,

    'start': `**start()**

Executes a runnable object (Action Plan, Transformer, Event Rule).

* **Example:** \`t.81037.start()\``,

    'unlink': `**unlink()**

Breaks the link to the template, making this a standalone object. Stops future template updates.`,

    // --- LIST & OBJECT ---
    'ancestor': `**ancestor(type)**

Returns the first parent/grandparent matching the type.

* **Example:** \`t.123.ancestor(Scorecard)\``,

    'as': `**as(property)**

Maps a list of objects to a list of their property values (e.g., \`kpis.as(name)\`).

* **Example:** \`myKpis.as(responsible)\``,

    'avg': `**avg()**

Returns the average of numeric values in a list (ignores non-numbers).`,

    'calculate': `**calculate([property])**

Evaluates a property or expression in a specific context (time/object).

* **Usage:** \`myKpis.calculate(responsible)\` or \`calculate(actual, BOY, EOP)\``,

    'children': `**children([type], ...)**

Returns immediate child objects. Faster than \`.descendants()\`.

* **Example:** \`this.object.children(BarChart, LineChart)\``,

    'contains': `**list CONTAINS item**

Returns TRUE if the list includes the item.

* **Syntax:** \`list CONTAINS item\``,

    'count': `**count()**

Returns the number of items in a map or list.`,

    'descendants': `**descendants([type], ...)**

Recursive deep search for all children.

* **Performance:** Heavy operation. Always filter by type (e.g. \`descendants(Kpi)\`).`,

    'distinct': `**distinct()**

Returns a list with duplicates removed.`,

    'filter': `**filter(condition)**

Returns a new list of items matching the condition.

* **Performance:** Iterates in memory. For huge sets, narrow your scope with \`SELECT\` first.
* **Example:** \`myKpis.filter(name = "*Revenue*")\``,

    'first': `**first([n])**

Returns the first item (or first n items) of a list.`,

    'foreach': `**forEach(iterator: ...)**

Iterates through a list.

* **Return:** The value of the *last* statement executed.
* **Scope Warning:** Variables defined inside this loop persist *outside* of it. Be careful when reusing variable names in subsequent loops.`,

    'get': `**get(key)**

Retrieves a value from a Map or an object from an ID space (e.g. \`o.get("123")\`).`,

    'groupBy': `**groupBy(property)**

Groups items for aggregation (e.g., \`list.groupBy(status).count()\`).`,

    'indexOf': `**indexOf(substring, [start])**

Returns the index of a substring, or MISSING if not found.`,

    'isMissing': `**isMissing()**

* **Deprecated:** Use \`variable = MISSING\` instead.`,

    'item': `**item(n)**

Returns the element at index n (0-based).`,

    'join': `**join(separator)**

Concatenates list items into a single string.`,

    'last': `**last([n])**

Returns the last item (or last n items) of a list.`,

    'map': `**map(keyExp, [valueExp])**

Converts a list into a Key-Value Map structure.`,

    'max': `**max()**

Returns the largest number in a list.`,

    'merge': `**merge(list2)**

Set Union: Combines lists and removes duplicates.`,

    'min': `**min()**

Returns the smallest number in a list.`,

    'remove': `**remove(item)**

Removes all instances of an item from the list.`,

    'reverse': `**reverse()**

Reverses the list order.`,

    'rref': `**rref([property], [type], ...)**

Reverse Reference: Finds objects that link *to* this object via the specified property.

* **Example:** \`myKpi.rref(affects, ActionPlan)\``,

    'size': `**size()**

Returns the length of a list or string.`,

    'sort': `**sort([expression])**

Sorts the list in ascending order.`,

    'sortReverse': `**sortReverse([expression])**

Sorts the list in descending order.`,

    'strip': `**strip()**

Trims leading/trailing whitespace from a string.`,

    'substring': `**substring(start, [end])**

Extracts a portion of a string.`,

    'sum': `**sum()**

Returns the sum of numeric values.`,

    'tree': `**tree([childExp], [collapseExp])**

Builds a hierarchical tree structure for Tree Tables. Default child expression is \`children\`.

* **Example:** \`root.organisation.tree(children)\``,

    'union': `**union(list2)**

Concatenates lists *keeping* duplicates.`,

    'url': `**url([icon], [text], [tooltip], [url])**

Generates a clickable link structure. Argument order determines icon vs text display.`,

    'whenMissing': `**whenMissing(default)**

Returns the default value if the expression is MISSING.

* **Architect Advice:** Use on all UI properties to prevent "MISSING" errors visible to users.
* **Example:** \`myProp.whenMissing("No Data")\``,

    // --- TABLE METHODS ---
    'addColumn': `**addColumn(header, expression)**

Adds a column to a table.`,

    'addTimeColumns': `**addTimeColumns(val, type, start, end, name)**

Generates dynamic columns for a time range.`,

    'addRow': `**addRow(obj, [vals...])**

Adds a custom row.

* **Limitation:** Cannot reuse the same context object in multiple rows.`,

    'align': `**align(LEFT | RIGHT | CENTER)**

Sets alignment for table/column/row.`,

    'collapse': `**collapse()**

Sets a tree table row to be collapsed by default.`,

    'decimals': `**decimals(n)**

Sets decimal precision.`,

    'formattype': `**formattype(type)**

Sets format (PERCENTAGE, THOUSANDS, DATE, DURATION).`,

    'hidden': `**hidden()**

Hides the column by default (user can unhide).`,

    'indent': `**indent(n)**

Indents the row hierarchy.`,

    'postfix': `**postfix(text)**

Appends text (e.g. unit) to the value.`,

    'prefix': `**prefix(text)**

Prepends text to the value.`,

    'readonly': `**readonly()**

Disables editing for this table/column/row.`,

    'style': `**style(style1, ...)**

Applies styles (bold, italics, wrapped, full, truncated, separator).`,

    'table': `**table([prop1], ...)**

Generates a table from a list.`,

    // --- GLOBAL ---
    'abs': `**abs(num)**: Absolute value.`,
    'AGG': `**AGG(expr, root)**: Hierarchy aggregation.`,
    'cbrt': `**cbrt(num)**: Cube root.`,
    'ceil': `**ceil(num)**: Rounds up.`,
    'createtable': `**createtable([headers...])**: Creates an empty table.`,
    'date': `**date(string)**: Parses string to Date object.

* **Format:** "04-07-2018" or "17/05/2018".`,
    'floor': `**floor(num)**: Rounds down.`,
    'LIST': `**LIST(items...)**: Creates a list.`,
    'MAP': `**MAP(key;val, ...)**: Creates a map.`,
    'md': `**md(string)**: Renders Markdown string to HTML. Supports \`\${var}\` interpolation.`,
    'num': `**num(value)**: Casts to number.`,
    'output': `**output(expr)**: Returns the literal formula string (no evaluation).`,
    'pow': `**pow(base, exp)**: Exponentiation.`,
    'priority': `**priority(prob, cons, [setting])**: Calculates Risk Priority (Color).`,
    'round': `**round(num)**: Rounds to nearest integer.`,
    'sqrt': `**sqrt(num)**: Square root.`,
    'str': `**str(value)**: Casts to string.`,

    'select': `**SELECT Type FROM Root WHERE ...**

Efficiently queries the database.

* **Performance:** Faster than \`.filter()\` on large sets. Always scope \`FROM\` (e.g. \`FROM root.organisation\`) if possible.`,

    'today': `**TODAY**

Returns the current date.

* **Type Hint:** This is a Date object. Use \`str(TODAY)\` if you need to compare it with strings like "2023-01-01".`,

    'bop': `**BOP** (Beginning of Period)

Returns the start date of the current context period.

* **Type Hint:** Date object.`,

    'eop': `**EOP** (End of Period)

Returns the end date of the current context period.

* **Type Hint:** Date object.`,

    // --- ID SPACES & OBJECT TYPES ---
    'o': `**o (ORGANISATION)**: Organisation objects.`,
    'n': `**n (NODE)**: Node objects.`,
    'nt': `**nt (NODETYPE)**: Node Type definitions.`,
    't': `**t (TEMPLATECATEGORY / SHAREDWEB / ACTIONPLAN)**: Templates, Shared Web Items, and Action Plans.`,
    'u': `**u (USER)**: User objects.`,
    'g': `**g (GROUP)**: User Groups.`,
    'ndi': `**ndi (NODEDATAIMPORT)**: Node Data Import jobs.`,
    'p': `**p (CUSTOM_PERIOD)**: Custom Period definitions.`,
    'r': `**r (EXTERNALRESOURCE)**: External resources (images, files).`,
    'd': `**d (DEFAULTS)**: Default object definitions.`,
    'ap': `**ap (ACCESSPROFILE)**: Access Profiles.`,
    'root': `**root (ROOT)**: The global root object.`,
    'c': `**c (CLASSCONFIG)**: Class Configurations.`,
    'k': `**k (CUSTOM_PROPERTY)**: Custom Property definitions.`,
    'ceven': `**ceven (CEVENDOR)**: Vendor enterprise objects.`,
    'cetas': `**cetas (CETASK)**: Task enterprise objects.`,
    'cecom': `**cecom (CECOMMENT)**: Comment enterprise objects.`,
    'ceinc': `**ceinc (CEINCIDENT)**: Incident enterprise objects.`,
    'cepro': `**cepro (CEPROCEDURE)**: Procedure enterprise objects.`,
    'cepol': `**cepol (CEPOLICY)**: Policy enterprise objects.`,
    'cecme': `**cecme (CECONTROLMEASURE)**: Control Measure enterprise objects.`,
    'ceiss': `**ceiss (CEISSUE)**: Issue enterprise objects.`,
    'ceass': `**ceass (CEASSET)**: Asset enterprise objects.`,
    'ceser': `**ceser (CESERVICE)**: Service enterprise objects.`,
    'cecot': `**cecot (CECONTRACT)**: Contract enterprise objects.`,
    'ceprj': `**ceprj (CEPROJECT)**: Project enterprise objects.`,
    'cereg': `**cereg (CEREGULATION)**: Regulation enterprise objects.`,
    'cecor': `**cecor (CECOMPLIANCEREQUIREMENT)**: Compliance Requirement enterprise objects.`,
    'ceind': `**ceind (CEINDICATOR)**: Indicator enterprise objects.`,
    'ceatt': `**ceatt (CEATTACHMENT)**: Attachment enterprise objects.`,
    'ceras': `**ceras (CERISKASSESSMENT)**: Risk Assessment enterprise objects.`,
    'acpol': `**acpol (ACCESSPOLICY)**: Access Policy enterprise objects.`,
    'role': `**role (ROLE)**: Role enterprise objects.`,
    'ceprd': `**ceprd (CEPRODUCT)**: Product enterprise objects.`,
    'sa': `**sa (SERVICEACCOUNT)**: Service Account enterprise objects.`,
    'cepsc': `**cepsc (CEPRESCREENING)**: Pre-screening enterprise objects.`,
    'ceprv': `**ceprv (CEPRIVACY)**: Privacy enterprise objects.`,
    'cewfl': `**cewfl (CEWORKFLOW)**: Workflow enterprise objects.`,
    'cedis': `**cedis (CEDISTRIBUTION)**: Distribution enterprise objects.`,
    'ceinq': `**ceinq (CEINQUIRY)**: Inquiry enterprise objects.`,
    'ceqst': `**ceqst (CEQUESTIONNAIRE)**: Questionnaire enterprise objects.`,
    'cedpi': `**cedpi (CEDPIA)**: DPIA enterprise objects.`,
    'cetia': `**cetia (CETIA)**: TIA enterprise objects.`,
    'ceasa': `**ceasa (CEASSURANCEACTIVITY)**: Assurance Activity enterprise objects.`,
    'fas': `**fas (FORMSANDSURVEYS)**: Forms and Surveys enterprise objects.`,
    'ds': `**ds (DATASET)**: Dataset enterprise objects.`,

    // --- ROOTS ---
    'root.accessPolicy': 'Model Root: Access Policies',
    'root.accessProfile': 'Model Root: Access Profiles (Permissions)',
    'root.actionPlan': 'Model Root: Action Plans',
    'root.ceAsset': 'Model Root: Assets (Enterprise Object)',
    'root.ceAttachment': 'Model Root: Attachments (Enterprise Object)',
    'root.ceIndicator': 'Model Root: Indicators (Enterprise Object)',
    'root.ceRiskAssessment': 'Model Root: Risk Assessments (Enterprise Object)',
    'root.classConfig': 'Model Root: Class Configurations',
    'root.custom_Period': 'Model Root: Custom Periods',
    'root.defaults': 'Model Root: Default Objects',
    'root.expression': 'Model Root: Extended Expressions',
    'root.externalResource': 'Model Root: External Resources',
    'root.forms': 'Model Root: Forms',
    'root.group': 'Model Root: User Groups',
    'root.node': 'Model Root: Nodes',
    'root.nodeDataImport': 'Model Root: Node Data Imports',
    'root.nodeType': 'Model Root: Node Types',
    'root.notification': 'Model Root: Notification Workflows',
    'root.organisation': 'Model Root: Organisation Hierarchy',
    'root.page': 'Model Root: Pages',
    'root.portal': 'Model Root: Portal Configuration',
    'root.processManagement': 'Model Root: Process Management',
    'root.property': 'Model Root: Property Definitions',
    'root.reporter': 'Model Root: Reporter',
    'root.risk': 'Model Root: Risks (Standard)',
    'root.role': 'Model Root: Roles',
    'root.templateCategory': 'Model Root: Templates',
    'root.transformer': 'Model Root: Transformers',
    'root.user': 'Model Root: Users'
};

// --- ERROR EXPLAINERS ---
// Explanations for common "Illegal" patterns detected by the grammar.
const errorExplainers: { [key: string]: string } = {
    'NOT': `**ILLEGAL SYNTAX: Universal NOT**

* **Why:** Extended Code does NOT support \`IF NOT condition\`. 
* **Fix:** You must compare explicitly to FALSE.
* **Correct:** \`IF myBool = FALSE THEN ...\` or \`IF myValue != 10 THEN ...\``,

    'IF': `**POTENTIAL ERROR: Unwrapped Assignment**

* **Why:** Variable assignment \`v := IF ...\` is invalid syntax. 
* **Fix:** Wrap the entire IF block in parentheses.
* **Correct:** \`v := (IF condition THEN val1 ELSE val2 ENDIF)\``
};

export function activate(context: vscode.ExtensionContext) {
    const hoverProvider = vscode.languages.registerHoverProvider('extended', {
        provideHover(document, position, token) {
            const range = document.getWordRangeAtPosition(position);
            if (!range) return undefined;

            const word = document.getText(range);
            const lineText = document.lineAt(position).text;

            // 1. Check for Error/Illegal Patterns first (High Priority)
            if (word === 'NOT') {
                const preText = lineText.substring(0, range.start.character).trimEnd();
                if (preText.endsWith('IF') || preText.endsWith('AND') || preText.endsWith('OR')) {
                    return new vscode.Hover(new vscode.MarkdownString(errorExplainers['NOT']));
                }
            }
            if (word === 'IF') {
                const preText = lineText.substring(0, range.start.character).trimEnd();
                if (preText.endsWith(':=')) {
                    return new vscode.Hover(new vscode.MarkdownString(errorExplainers['IF']));
                }
            }

            // 2. Check for Standard Documentation
            const lowerWord = word.toLowerCase();
            if (architectNotes[lowerWord] || architectNotes[word]) {
                const note = architectNotes[lowerWord] || architectNotes[word];
                return new vscode.Hover(new vscode.MarkdownString(note));
            }

            // 3. Handle namespaced calls (e.g. root.organisation)
            const dotRange = document.getWordRangeAtPosition(position, /[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+/);
            if (dotRange) {
                const fullToken = document.getText(dotRange);
                // Try exact match first, then lower
                if (architectNotes[fullToken]) {
                    return new vscode.Hover(new vscode.MarkdownString(architectNotes[fullToken]));
                }
                if (architectNotes[fullToken.toLowerCase()]) {
                    return new vscode.Hover(new vscode.MarkdownString(architectNotes[fullToken.toLowerCase()]));
                }
            }

            return undefined;
        }
    });

    context.subscriptions.push(hoverProvider);
}

export function deactivate() {}