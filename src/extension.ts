import * as vscode from 'vscode';

const documentation: { [key: string]: string } = {
    // --- 1. Transactional Methods  ---
    'add': 'add(objectType, [prop1 := val1, ...]): Adds a new object under the context object.\n\n* **Limitation:** Cannot use templates from Template Category or Defaults.\n* **Example:** `o.137.add(Scorecard)` or `t.6938.add(Kpi, name := "Revenue")`',
    'affixLink': 'affixLink(templateObject): Links a model object to a template object.\n\n* **Example:** `t.8345.affixLink(t.432)`',
    'change': 'change(prop1 := val1, ...): Changes properties of an object or list of objects.\n\n* **Example:** `t.KP001.change(name := "Revenue")`',
    'clear': 'clear([prop1], ...): Clears property values or InputView variables.\n\n* **Object:** `myKpi.clear(description)`\n* **Session:** `clear(testStr)`',
    'copy': 'copy(object, [prop1 := val1, ...]): Copies an object to the context location.\n\n* **Example:** `t.870.copy(t.499, id := "MYNEWID")`',
    'delete': 'delete(): Deletes an object or list of objects.\n\n* **Example:** `t.9683.delete()`',
    'error': 'error(message): Triggers an error and immediately aborts the script execution.\n\n* **Example:** `IF x=0 THEN error("Zero value") ENDIF`',
    'generate': 'generate([includeId]): Outputs the transactional Extended code required to replicate the object(s).\n\n* **Params:** `includeId` (boolean) - if true, includes the specific ID assignments.',
    'link': 'link(templateObject): Copies a template object as a child, preserving the link to the template.\n\n* **Example:** `t.2389.link(t.500)`',
    'move': 'move(destinationObject): Moves an object to a new parent.\n\n* **Limitation:** Cannot move objects between different models.',
    'moveAfter': 'moveAfter(destinationObject): Moves an object to be ordered immediately after the specified object.',
    'moveBefore': 'moveBefore(destinationObject): Moves an object to be ordered immediately before the specified object.',
    'notify': 'notify(subject, [body], [recipients], [category]): Sends a system notification.\n\n* **Defaults:** If recipients are omitted, defaults to System Administrator.',
    'reset': 'reset([prop1], ...): Resets overridden properties of a linked object back to their template values.\n\n* **Example:** `t.67203.reset(name)`',
    'sendmail': 'sendmail(subject, body, recipients): Sends an email to the specified recipients.\n\n* **Example:** `sendmail("Update", "Check this", "user@example.com")`',
    'start': 'start(): Executes a runnable object, such as an Event Rule, Transformer Job, or Action Group.\n\n* **Example:** `t.81037.start()`',
    'unlink': 'unlink(): Removes the link from a linked object, turning it into a standalone object.',


    // --- 2. List & Object Methods  ---
    'ancestor': 'ancestor(type): Returns the first ancestor object of a matching type.\n\n* **Example:** `t.123.ancestor(Scorecard)`',
    'as': 'as(property): Returns a new list containing the values of the specified property for each object in the original list.\n\n* **Example:** `myKpis.as(responsible)`',
    'avg': 'avg(): Returns the average of numeric values in the list. Non-numeric values are excluded. Returns NA if empty.',
    'calculate': 'calculate([property]): Applies a specific context to an expression or property.\n\n* **Usage:** `myKpis.calculate(responsible)` or `calculate(actual, BOY, EOP)`',
    'children': 'children([type1], ...): Returns a list of first-level child objects, optionally filtered by type.\n\n* **Example:** `this.object.children(BarChart, LineChart)`',
    'contains': 'CONTAINS: Boolean operator. Checks if a list contains a specific item.\n\n* **Syntax:** `list CONTAINS item`',
    'count': 'count(): Counts the values in a map or list.',
    'descendants': 'descendants([type1], ...): Returns a list of all child objects from all levels (deep search), optionally filtered by type.',
    'distinct': 'distinct(): Returns a list with all duplicate elements removed.',
    'filter': 'filter(condition): Returns a list of elements that meet the specified boolean condition.\n\n* **Example:** `myKpis.filter(name = "*Revenue*")`',
    'first': 'first([n]): Returns the first element (if n is omitted) or a list of the first n elements.',
    'forEach': 'forEach(iterator: ...): Iterates through a list, executing the block for each item.\n\n* **Return:** The value of the *last* statement executed in the loop.',
    'get': 'get(key): Returns the value for a given key in a Map or retrieves an object from an ID space string.',
    'groupBy': 'groupBy(property): Groups items by a property. Used with aggregation functions like `.count()` or `.sum()`.',
    'indexOf': 'indexOf(substring, [startIndex]): Returns the index of the first occurrence of a substring. Returns MISSING if not found.',
    'isMissing': '**DEPRECATED**\n\nUse `variable = MISSING` or `variable != MISSING` instead.',
    'item': 'item(n): Returns the element at index n (0-based index).',
    'join': 'join(separator): Concatenates all items in a list into a single string, separated by the specified separator.',
    'last': 'last([n]): Returns the last element (if n is omitted) or a list of the last n elements.',
    'map': 'map(keyExp, [valueExp]): Converts a list into a Map structure, allowing for grouping and counting.',
    'max': 'max(): Returns the largest numeric value in the list.',
    'merge': 'merge(list2): Returns a new list containing all distinct elements from both lists (Set Union).',
    'min': 'min(): Returns the smallest numeric value in the list.',
    'remove': 'remove(item): Removes all instances of an item or a list of items from the list.',
    'reverse': 'reverse(): Returns a reversed version of the list.',
    'rref': 'rref([property], [type], [startDate], [endDate]): Performs a reverse lookup of objects that reference the current object via a specific property.\n\n* **Example:** `myKpi.rref(affects, ActionPlan)`',
    'size': 'size(): Returns the number of elements in a list or the length of a string.',
    'sort': 'sort([expression]): Returns a sorted version of the list (ascending order).',
    'sortReverse': 'sortReverse([expression]): Returns a sorted version of the list (descending order).',
    'strip': 'strip(): Removes extra leading, trailing, and inline spaces from a string.',
    'substring': 'substring(startIndex, [endIndex]): Returns a fragment of the string.',
    'sum': 'sum(): Returns the sum of numeric values in the list/map.',
    'tree': 'tree([childExp], [boolExp]): Creates a nested list structure (treelist) for tree tables.\n\n* **Example:** `root.organisation.tree(children)`',
    'union': 'union(list2): Returns a list containing all elements from both lists, *including* duplicates.',
    'url': 'url([icon], [text], [tooltip], [externalUrl]): Generates a clickable link structure for tables or properties.',
    'whenMissing': 'whenMissing(default): Provides a fallback value if the expression is MISSING.\n\n* **Example:** `myProp.whenMissing("No Data")`',

    // --- 3. Table Configuration Methods  ---
    'addColumn': 'addColumn(header, expression): Adds a new column to a table.',
    'addTimeColumns': 'addTimeColumns(value, periodType, startDate, endDate, columnName): Adds multiple columns for a range of time periods.',
    'addRow': 'addRow(obj, [val1], ...): Adds a new row to the table.\n\n* **Limitation:** Reusing the same context object in multiple rows is not supported.',
    'align': 'align(LEFT | RIGHT | CENTER): Sets alignment for a table, column, or row.',
    'collapse': 'collapse(): Hides child rows by default in a tree table.',
    'decimals': 'decimals(n): Sets the number of decimal places for a column.',
    'formattype': 'formattype(type): Changes formatting (e.g., PERCENTAGE, THOUSANDS, DATE, DURATION).',
    'hidden': 'hidden(): Hides a column by default.',
    'indent': 'indent(n): Indents a row.',
    'postfix': 'postfix(text): Adds a text postfix to values.',
    'prefix': 'prefix(text): Adds a text prefix to values.',
    'readonly': 'readonly(): Makes a table, column, or row read-only.',
    'style': 'style(style1, ...): Applies styles.\n\n* **Options:** bold, italics, wrapped, full, truncated, separator.',
    'table': 'table([prop1], ...): Creates a table from a list of objects.',
    
    // --- 4. Global Functions  ---
    'abs': 'abs(value): Returns the absolute value.',
    'AGG': 'AGG(expression, root): Performs an aggregation calculation over a hierarchy.',
    'cbrt': 'cbrt(value): Returns the cube root.',
    'ceil': 'ceil(value): Rounds up to the nearest integer.',
    'createtable': 'createtable([header1], ...): Creates an empty table with specified headers.',
    'date': 'date(string): Converts a string to a date object.\n\n* **Format:** "04-07-2018" or "17/05/2018".',
    'floor': 'floor(value): Rounds down to the nearest integer.',
    'LIST': 'LIST(item1, ...): Creates a list of items.',
    'MAP': 'MAP(key1; val1, ...): Creates a key-value map.',
    'md': 'md(markdownString): Converts a string containing Markdown into rich text/HTML.\n\n* **Note:** Supports ${variable} interpolation.',
    'num': 'num(value): Converts a value to a number.',
    'output': 'output(expression): Returns the literal formula string of an expression without evaluating it.',
    'pow': 'pow(base, exponent): Calculates the power of a base to an exponent.',
    'priority': 'priority(probability, consequence, [RiskSetting]): Calculates a Priority (Color) based on Risk Matrix settings.',
    'round': 'round(value): Rounds to the nearest integer (0.5 rounds up).',
    'sqrt': 'sqrt(value): Returns the square root.',
    'str': 'str(value): Converts a value to a string.',

    // --- 5. Model Roots ---
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

export function activate(context: vscode.ExtensionContext) {
    const hoverProvider = vscode.languages.registerHoverProvider('extended', {
        provideHover(document, position, token) {
            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);

            // 1. Direct Match (Methods, Functions)
            if (documentation[word]) {
                return new vscode.Hover(new vscode.MarkdownString(`**Extended Documentation:**\n\n${documentation[word]}`));
            }
            
            // 2. Namespaced Match (root.organisation, t.templateName)
            const line = document.lineAt(position).text;
            const fullWordMatch = line.match(/[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+/);
            
            if (fullWordMatch) {
                const fullWord = fullWordMatch[0];
                // Check if the cursor is actually hovering over this specific match
                const matchIndex = line.indexOf(fullWord);
                const matchRange = new vscode.Range(
                    position.line, 
                    matchIndex, 
                    position.line, 
                    matchIndex + fullWord.length
                );

                if (matchRange.contains(position) && documentation[fullWord]) {
                     return new vscode.Hover(new vscode.MarkdownString(`**Extended Documentation:**\n\n${documentation[fullWord]}`));
                }
            }

            return undefined;
        }
    });

    context.subscriptions.push(hoverProvider);
}

export function deactivate() {}