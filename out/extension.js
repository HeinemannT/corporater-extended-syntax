"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const architectNotes = {
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
// Helper to create simple params
function p(label, documentation) {
    return new vscode.ParameterInformation(label, documentation);
}
const signatures = {
    // Transactional
    'add': [{
            label: 'add(objectType, [prop := val, ...])',
            documentation: new vscode.MarkdownString(`**Adds a new object instance.**\n\n* **⚠️ Limitation:** Cannot use templates (e.g. from Defaults) directly. Add the base type and use \`.link()\`.\n* **Example:** \`o.137.add(Scorecard)\``),
            parameters: [
                p('objectType', 'The Class of object to create (e.g. Scorecard, Kpi).'),
                p('prop := val...', 'Optional property assignments (e.g. name := "Revenue").')
            ]
        }],
    'change': [{
            label: 'change(prop := val, ...)',
            documentation: new vscode.MarkdownString(`**Modifies properties.**\n\n* **⚠️ Performance:** Triggers updates on every object. Use sparingly on large lists.\n* **⚠️ Pitfall:** Changing \`id\` breaks external references.`),
            parameters: [p('prop := val...', 'Property assignments (e.g. name := "New Name").')]
        }],
    'notify': [{
            label: 'notify(subject, [body], [recipients], [category])',
            documentation: new vscode.MarkdownString(`**Sends a system notification.**`),
            parameters: [
                p('subject', 'Notification title.'),
                p('body', 'Optional body text.'),
                p('recipients', 'Optional list of Users/Groups. Defaults to System Admin.'),
                p('category', 'Optional category string.')
            ]
        }],
    'sendmail': [{
            label: 'sendmail(subject, body, recipients)',
            documentation: new vscode.MarkdownString(`**Sends an email.**\n\n* **Note:** Body supports HTML. Use \`md()\` to convert markdown.`),
            parameters: [
                p('subject', 'Email subject line.'),
                p('body', 'Email body (HTML supported).'),
                p('recipients', 'List of Users/Groups or email strings.')
            ]
        }],
    'copy': [{
            label: 'copy(object, [prop := val, ...])',
            documentation: new vscode.MarkdownString(`**Duplicates an object.**`),
            parameters: [
                p('object', 'The source object to copy.'),
                p('prop := val...', 'Optional property overrides for the new copy.')
            ]
        }],
    'link': [{
            label: 'link(templateObject)',
            documentation: new vscode.MarkdownString(`**Creates a linked copy of a template.**\n\n* **Best Practice:** Use for structural objects (Scorecards) to inherit future updates.`),
            parameters: [p('templateObject', 'The template object (usually from t. or d. namespace).')]
        }],
    'affixLink': [{
            label: 'affixLink(templateObject)',
            documentation: new vscode.MarkdownString(`**Links an existing object to a template.**`),
            parameters: [p('templateObject', 'The template to link to.')]
        }],
    'move': [{
            label: 'move(destinationObject)',
            documentation: new vscode.MarkdownString(`**Re-parents an object.**\n\n* **⚠️ Limitation:** Cannot move objects between different Models/Roots.`),
            parameters: [p('destinationObject', 'The new parent object.')]
        }],
    'moveAfter': [{
            label: 'moveAfter(destinationObject)',
            documentation: 'Reorders this object to sit immediately *after* the target.',
            parameters: [p('destinationObject', 'The object to follow.')]
        }],
    'moveBefore': [{
            label: 'moveBefore(destinationObject)',
            documentation: 'Reorders this object to sit immediately *before* the target.',
            parameters: [p('destinationObject', 'The object to precede.')]
        }],
    'reset': [{
            label: 'reset([prop1], ...)',
            documentation: 'Reverts overridden properties to their template values.',
            parameters: [p('prop1...', 'List of properties to reset.')]
        }],
    'clear': [{
            label: 'clear([prop1], ...)',
            documentation: 'Clears properties (object) or InputView variables (session).',
            parameters: [p('prop1...', 'Properties or variables to clear.')]
        }],
    // List & Object
    'filter': [{
            label: 'filter(condition)',
            documentation: new vscode.MarkdownString(`**Returns items matching the condition.**\n\n* **Performance:** Iterates in memory. Consider \`SELECT\` for large sets.`),
            parameters: [p('condition', 'Boolean expression (e.g. name = "Revenue").')]
        }],
    'map': [{
            label: 'map(keyExp, [valueExp])',
            documentation: 'Converts a list into a Map structure.',
            parameters: [
                p('keyExp', 'Expression for the map key.'),
                p('valueExp', 'Optional expression for the map value.')
            ]
        }],
    'forEach': [{
            label: 'forEach(iterator: ...)',
            documentation: new vscode.MarkdownString(`**Iterates through a list.**\n\n* **⚠️ Scope:** Variables defined inside persist outside.`),
            parameters: [p('iterator', 'Loop body (e.g. item: ...)')]
        }],
    'sort': [{
            label: 'sort([expression])',
            documentation: 'Sorts the list (ascending).',
            parameters: [p('expression', 'Optional sort key. Defaults to item value.')]
        }],
    'sortReverse': [{
            label: 'sortReverse([expression])',
            documentation: 'Sorts the list (descending).',
            parameters: [p('expression', 'Optional sort key.')]
        }],
    'children': [{
            label: 'children([type], ...)',
            documentation: 'Returns immediate first-level child objects.',
            parameters: [p('type...', 'Optional types to filter by (e.g. Kpi).')]
        }],
    'descendants': [{
            label: 'descendants([type], ...)',
            documentation: new vscode.MarkdownString(`**Returns recursive child objects.**\n\n* **⚠️ Performance:** Heavy operation. Always filter by type.`),
            parameters: [p('type...', 'Optional types to filter by.')]
        }],
    'ancestor': [{
            label: 'ancestor(type)',
            documentation: 'Returns the first parent/grandparent matching the type.',
            parameters: [p('type', 'The Class to search for (e.g. Scorecard).')]
        }],
    'rref': [{
            label: 'rref([property], [type], [start], [end])',
            documentation: 'Reverse Reference: Finds objects that link *to* this object.',
            parameters: [
                p('property', 'The reference property on the *other* object.'),
                p('type', 'Optional type of the *other* object.'),
                p('start', 'Optional start date filter.'),
                p('end', 'Optional end date filter.')
            ]
        }],
    'substring': [{
            label: 'substring(start, [end])',
            documentation: 'Extracts a portion of a string.',
            parameters: [p('start', 'Start index (0-based).'), p('end', 'Optional end index.')]
        }],
    'indexOf': [{
            label: 'indexOf(substring, [start])',
            documentation: 'Returns the index of a substring, or MISSING if not found.',
            parameters: [p('substring', 'Text to search for.'), p('start', 'Optional start index.')]
        }],
    'url': [
        {
            label: 'url(text)',
            documentation: 'Simple link with text label.',
            parameters: [p('text', 'Label text.')]
        },
        {
            label: 'url(icon, text)',
            documentation: 'Link with icon and text.',
            parameters: [p('icon', 'Icon resource (e.g. r.icon_name).'), p('text', 'Label text.')]
        },
        {
            label: 'url(icon, text, tooltip)',
            documentation: 'Link with icon, text, and tooltip.',
            parameters: [p('icon', 'Icon.'), p('text', 'Label.'), p('tooltip', 'Hover text.')]
        },
        {
            label: 'url(icon, text, tooltip, url)',
            documentation: 'Full link control with external URL.',
            parameters: [p('icon', 'Icon.'), p('text', 'Label.'), p('tooltip', 'Hover text.'), p('url', 'External destination.')]
        }
    ],
    'whenMissing': [{
            label: 'whenMissing(default)',
            documentation: 'Returns the default value if the expression is MISSING.',
            parameters: [p('default', 'Fallback value.')]
        }],
    'tree': [{
            label: 'tree([childExp], [collapseExp])',
            documentation: 'Builds a hierarchical tree structure for Tree Tables.',
            parameters: [
                p('childExp', 'Expression to find children (default: children).'),
                p('collapseExp', 'Expression to determine if row is collapsed.')
            ]
        }],
    // Table
    'addColumn': [{
            label: 'addColumn(header, expression)',
            documentation: 'Adds a column to the table.',
            parameters: [p('header', 'Column title.'), p('expression', 'Value expression for the column.')]
        }],
    'addTimeColumns': [{
            label: 'addTimeColumns(val, type, start, end, name)',
            documentation: 'Generates dynamic columns for a time range.',
            parameters: [
                p('val', 'Value expression.'),
                p('type', 'Period type (e.g. p.month).'),
                p('start', 'Start date.'),
                p('end', 'End date.'),
                p('name', 'Column name prefix.')
            ]
        }],
    'addRow': [{
            label: 'addRow(obj, [vals...])',
            documentation: new vscode.MarkdownString(`**Adds a manual row.**\n\n* **⚠️ Limitation:** Cannot reuse the same context object in multiple rows.`),
            parameters: [
                p('obj', 'Context object for the row.'),
                p('vals...', 'Values for each column.')
            ]
        }],
    'style': [{
            label: 'style(style1, ...)',
            documentation: 'Applies styles to table elements.',
            parameters: [p('style1...', 'Styles (bold, italics, wrapped, full, truncated, separator).')]
        }],
    'decimals': [{
            label: 'decimals(n)',
            documentation: 'Sets decimal precision.',
            parameters: [p('n', 'Number of decimal places.')]
        }],
    // Global
    'date': [{
            label: 'date(string)',
            documentation: 'Parses date string.',
            parameters: [p('string', 'Date string (e.g. "2023-01-01").')]
        }],
    'str': [{
            label: 'str(value)',
            documentation: 'Casts a value to a string.',
            parameters: [p('value', 'Input value.')]
        }],
    'num': [{
            label: 'num(value)',
            documentation: 'Casts a value to a number.',
            parameters: [p('value', 'Input value.')]
        }],
    'md': [{
            label: 'md(string)',
            documentation: new vscode.MarkdownString(`**Renders Markdown to HTML.**\n\n* **Feature:** Supports \`\${var}\` interpolation.`),
            parameters: [p('string', 'Markdown text.')]
        }],
    'priority': [{
            label: 'priority(prob, cons, [setting])',
            documentation: 'Calculates risk priority color.',
            parameters: [
                p('prob', 'Probability value.'),
                p('cons', 'Consequence/Impact value.'),
                p('setting', 'Optional Risk Matrix setting.')
            ]
        }]
};
// --- ERROR EXPLAINERS ---
// Explanations for common "Illegal" patterns detected by the grammar.
const errorExplainers = {
    'NOT': `**ILLEGAL SYNTAX: Universal NOT**

* **Why:** Extended Code does NOT support \`IF NOT condition\`. 
* **Fix:** You must compare explicitly to FALSE.
* **Correct:** \`IF myBool = FALSE THEN ...\` or \`IF myValue != 10 THEN ...\``,
    'IF': `**POTENTIAL ERROR: Unwrapped Assignment**

* **Why:** Variable assignment \`v := IF ...\` is invalid syntax. 
* **Fix:** Wrap the entire IF block in parentheses.
* **Correct:** \`v := (IF condition THEN val1 ELSE val2 ENDIF)\``
};
// --- AUTOCOMPLETE ITEMS ---
const globalKeywords = [
    new vscode.CompletionItem('IF', vscode.CompletionItemKind.Keyword),
    new vscode.CompletionItem('ELSE', vscode.CompletionItemKind.Keyword),
    new vscode.CompletionItem('ENDIF', vscode.CompletionItemKind.Keyword),
    new vscode.CompletionItem('SELECT', vscode.CompletionItemKind.Keyword),
    new vscode.CompletionItem('FROM', vscode.CompletionItemKind.Keyword),
    new vscode.CompletionItem('WHERE', vscode.CompletionItemKind.Keyword),
    new vscode.CompletionItem('return', vscode.CompletionItemKind.Keyword),
    new vscode.CompletionItem('root', vscode.CompletionItemKind.Module),
    new vscode.CompletionItem('this', vscode.CompletionItemKind.Module),
    new vscode.CompletionItem('MISSING', vscode.CompletionItemKind.Constant),
    new vscode.CompletionItem('TODAY', vscode.CompletionItemKind.Constant),
    new vscode.CompletionItem('TRUE', vscode.CompletionItemKind.Constant),
    new vscode.CompletionItem('FALSE', vscode.CompletionItemKind.Constant)
];
const rootCompletions = [
    'organisation', 'risk', 'user', 'accessProfile', 'accessPolicy', 'actionPlan',
    'ceAsset', 'ceAttachment', 'ceIndicator', 'ceRiskAssessment', 'classConfig',
    'custom_Period', 'defaults', 'expression', 'externalResource', 'forms', 'group',
    'node', 'nodeDataImport', 'nodeType', 'notification', 'page', 'portal',
    'processManagement', 'property', 'reporter', 'role', 'templateCategory',
    'transformer'
].map(r => new vscode.CompletionItem(r, vscode.CompletionItemKind.Class));
const thisCompletions = [
    'object', 'user', 'location', 'inputview'
].map(t => new vscode.CompletionItem(t, vscode.CompletionItemKind.Property));
// Prioritized methods for smart completion
const prioritizedMethods = ['filter', 'map', 'change', 'add', 'first', 'forEach', 'calculate'];
const methodCompletions = Object.keys(signatures).map(key => {
    const item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Method);
    item.insertText = new vscode.SnippetString(`${key}($0)`);
    // Sort critical methods to the top
    if (prioritizedMethods.includes(key)) {
        item.sortText = '0' + key;
    }
    else {
        item.sortText = '1' + key;
    }
    const sig = signatures[key][0];
    if (sig) {
        // Convert MarkdownString to string for detail if needed, but documentation takes Markdown
        item.documentation = sig.documentation;
        item.detail = sig.label;
    }
    return item;
});
const systemProperties = [
    'id', 'name', 'description', 'className', 'parent', 'linkedTo',
    'createdTime', 'createdBy', 'lastModifiedDate', 'lastModifiedBy',
    'visible', 'inheritVisible', 'inScope', 'inheritScope', 'available', 'inheritAvailable'
].map(p => new vscode.CompletionItem(p, vscode.CompletionItemKind.Field));
function activate(context) {
    // 1. HOVER PROVIDER
    const hoverProvider = vscode.languages.registerHoverProvider('extended', {
        provideHover(document, position, token) {
            const range = document.getWordRangeAtPosition(position);
            if (!range)
                return undefined;
            const word = document.getText(range);
            const lineText = document.lineAt(position).text;
            // Check for Error/Illegal Patterns first (High Priority)
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
            // Check for Standard Documentation
            const lowerWord = word.toLowerCase();
            if (architectNotes[lowerWord] || architectNotes[word]) {
                const note = architectNotes[lowerWord] || architectNotes[word];
                return new vscode.Hover(new vscode.MarkdownString(note));
            }
            // Handle namespaced calls (e.g. root.organisation)
            const dotRange = document.getWordRangeAtPosition(position, /[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+/);
            if (dotRange) {
                const fullToken = document.getText(dotRange);
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
    // 2. DIAGNOSTIC COLLECTION
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('extended');
    const validate = (doc) => {
        if (doc.languageId !== 'extended')
            return;
        const diagnostics = [];
        const text = doc.getText();
        // Check for 'IF NOT'
        const ifNotRegex = /\bIF\s+NOT\b/g;
        let match;
        while ((match = ifNotRegex.exec(text)) !== null) {
            const startPos = doc.positionAt(match.index);
            const endPos = doc.positionAt(match.index + match[0].length);
            diagnostics.push(new vscode.Diagnostic(new vscode.Range(startPos, endPos), 'Illegal Syntax: "IF NOT" is not supported. Compare to FALSE instead.', vscode.DiagnosticSeverity.Error));
        }
        // Check for Unwrapped Assignment 'v := IF'
        const unwrappedIfRegex = /:=\s*IF\b/g;
        while ((match = unwrappedIfRegex.exec(text)) !== null) {
            const startPos = doc.positionAt(match.index);
            const endPos = doc.positionAt(match.index + match[0].length);
            diagnostics.push(new vscode.Diagnostic(new vscode.Range(startPos, endPos), 'Potential Error: Conditional assignment must be wrapped in parentheses: v := (IF ...)', vscode.DiagnosticSeverity.Warning));
        }
        diagnosticCollection.set(doc.uri, diagnostics);
    };
    vscode.workspace.onDidOpenTextDocument(validate);
    vscode.workspace.onDidSaveTextDocument(validate);
    vscode.workspace.onDidChangeTextDocument(e => validate(e.document));
    // 3. SIGNATURE HELP PROVIDER
    const signatureProvider = vscode.languages.registerSignatureHelpProvider('extended', {
        provideSignatureHelp(document, position, token) {
            const range = document.getWordRangeAtPosition(position);
            const lineText = document.lineAt(position).text;
            const textBefore = lineText.substring(0, position.character);
            // Find the last '('
            let parenDepth = 0;
            let openParenIndex = -1;
            for (let i = textBefore.length - 1; i >= 0; i--) {
                if (textBefore[i] === ')')
                    parenDepth++;
                else if (textBefore[i] === '(') {
                    if (parenDepth > 0)
                        parenDepth--;
                    else {
                        openParenIndex = i;
                        break;
                    }
                }
            }
            if (openParenIndex === -1)
                return undefined;
            const methodCallText = textBefore.substring(0, openParenIndex).trimEnd();
            const methodMatch = methodCallText.match(/([a-zA-Z0-9_]+)$/);
            if (!methodMatch)
                return undefined;
            const methodName = methodMatch[1];
            const argsText = textBefore.substring(openParenIndex + 1);
            const paramCount = (argsText.match(/,/g) || []).length;
            const sigDataArray = signatures[methodName];
            if (sigDataArray && sigDataArray.length > 0) {
                const help = new vscode.SignatureHelp();
                help.signatures = sigDataArray.map(s => {
                    const info = new vscode.SignatureInformation(s.label, s.documentation);
                    info.parameters = s.parameters.map(p => {
                        return typeof p === 'string' ? new vscode.ParameterInformation(p) : p;
                    });
                    return info;
                });
                help.activeSignature = 0;
                help.activeParameter = paramCount;
                return help;
            }
            return undefined;
        }
    }, '(', ',');
    // 4. COMPLETION PROVIDER
    const completionProvider = vscode.languages.registerCompletionItemProvider('extended', {
        provideCompletionItems(document, position) {
            const linePrefix = document.lineAt(position).text.substr(0, position.character);
            // Bucket 3: root.
            if (linePrefix.endsWith('root.')) {
                return rootCompletions;
            }
            // Bucket 4: this.
            if (linePrefix.endsWith('this.')) {
                return thisCompletions;
            }
            // Bucket 5: NO suggestions for custom namespaces (t., o., etc.)
            // We strictly avoid suggesting things for these prefixes as they vary per client.
            if (linePrefix.match(/\b(t|o|ce[a-z]+|ds|ap|k|n|nt|u|g|p|r|d|c)\.$/)) {
                return undefined;
            }
            // Bucket 2: Dot Access (General methods and properties)
            if (linePrefix.endsWith('.')) {
                return [...methodCompletions, ...systemProperties];
            }
            // Bucket 1: Global Scope (default)
            const quoteCount = (linePrefix.match(/'/g) || []).length + (linePrefix.match(/"/g) || []).length;
            if (quoteCount % 2 === 0) {
                return globalKeywords;
            }
            return undefined;
        }
    }, '.' // Trigger on dot
    );
    context.subscriptions.push(hoverProvider, diagnosticCollection, signatureProvider, completionProvider);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map