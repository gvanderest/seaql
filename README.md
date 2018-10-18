# SeaQL

Library for generating some SQL, primarily targeting MySQL and Postgres databases.

## Installation

## Examples

### Insert

```js
import { insert } from "seaql";

const sql = insert({ firstName: "Guillaume", lastName: "VanderEst" }).into("customers").stringify();

# INSERT INTO customers (firstName, lastName) VALUES ('Guillaume', 'VanderEst');
```

### Select

```js
import { select } from "seaql";

const sql = select(["id"]).from("customers").where({ firstName: "Guillaume", lastName: "VanderEst" });

# SELECT id FROM customers WHERE firstName = 'Guillaume' AND lastName = 'VanderEst';
```

### Update

```js
import { update } from "seaql";

const sql = update("customers").set({ firstName: "Edward", lastName: "Nigma" }).where({ id: 12345 });

# UPDATE customers SET firstName = 'Edward', lastName = 'Nigma' WHERE id = 12345;
```

### Delete

Alternatively, `del` can be used.  As `delete` is a reserved JavaScript keyword.

```js
import { remove } from "seaql";

const sql = remove("customers").where({ id: 12345 });

# DELETE customers WHERE id = 12345;
```


## Future
* Value escaping
* Handling primitives vs arrays flexibly
* Table+Field combinations
* Field aliasing
* Joins
* Nested SeaQL subqueries
* Parsing from SQL
* Aggregate functions
* Nesting of OR and AND clauses using arrays/objects
* Limits
* Filtering
* Ordering
* Partitioning?
* Engine-specific optimizations
* Returning clauses
