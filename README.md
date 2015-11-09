# doSQL

Easy and intuitive way to do queries to a MySQL database using only JSON.

[![npm](https://img.shields.io/npm/v/dosql.svg?style=flat-square)](https://www.npmjs.com/package/dosql)
[![npm](https://img.shields.io/npm/dt/dosql.svg?style=flat-square)](https://www.npmjs.com/package/dosql)

## Install

Install **doSQL** using NPM:

```sh
npm install --save dosql
```

## Usage

### Connect(obj)

Use this for connect to a database. For example:

```javascript
//Import
var db = require('dosql');

//Connect to database
db.Connect({host: '<YOUR_HOST>', user: '<YOUR_USER>', pass: '<YOUR_PASS>', db: '<YOUR_DATABASE>'});
```


### Do(obj, callback)

Run a query defined by `obj` object, and then call your `callback` function with the results.

The `obj` object must contain the next keys:

- `in`: string with the table where you want to do the query.
- `do`: action

`callback` will get only argument, called `result`:

- `result` will be `null` if an error occurred running the query.
- `result` will be an array if no error occurred.

#### Examples

For **select** data, you can optionally add a `where` key, containing an object with the keys that the rows must satisfy. On version `0.2.1`, the `where` argument can be a string for a complex query.

```javascript
//Example 1 - Select all rows from table

// SELECT * FROM yourtable
db.Do({in: 'yourtable', do: 'select'}, function(result){

  //result is an array containing the selected rows
  //If there was a problem doing the query, result will be NULL    

  //Do something with "result"

});
```

```javascript
//Example2 - Select only rows that satisfy the conditions

// SELECT * FROM yourtable WHERE key1="value1" AND key2="value2";
db.Do({in: 'yourtable', do: 'select', where: {'key1': 'value1', 'key2': 'value2'}}, function(result){

  //result is an array containing the selected rows
  //If there was a problem doing the query, result will be NULL    

  //Do something with "result"

});
```

For **insert** data, you must add a `values` key. It can be an object with the values for insert into your table, or an array with some objects.

```javascript
//Example 1 - Insert only one row to your table

// INSERT INTO yourtable (k1, k2, k3) VALUES ("v1", "v2", "v3");
db.Do({in: 'yourtable', do: 'insert', values: {k1:'v1',k2:'v2',k3:'v3'}}, function(result){

  //result will be NULL if something went wrong. Else, result will be an empty array

});
```

```javascript
//Example 2 - Insert two rows to your table

// INSERT INTO yourtable (k1, k2, k3) VALUES ("v1", "v2", "v3"),("v4", "v5", "v6");
var val = [{k1: 'v1', k2: 'v2', k3: 'v3'},{k1: 'v4', k2: 'v5', k3: 'v6'}];
db.Do({in: 'yourtable', do: 'insert', values:val}, function(result){

  //result will be NULL if something went wrong. Else, result will be an empty array

});
```

For **update** rows, you must add a `set` and `where` keys.

```javascript
//Example1 - Update some rows

// UPDATE yourtable SET key1="va1" WHERE key2="va2"
db.Do({in: 'yourtable', do: 'update', set: {key1: 'va1'}, where: {key2: 'va2'}}, function(result){

  //result will be NULL if something went wrong. Else, result will be an empty array

});
```

For **delete** rows, you must add a `where` key:

```javascript
//Example1 - Delete some rows

// DELETE yourtable WHERE key="value"
db.Do({in: 'yourtable', do: 'delete', where: {key: 'value'}}, function(result){

  //result will be NULL if something went wrong. Else, result will be an empty array

});
```

## Tip

You can use `if(result)` for check if something went wrong. For example,

```javascript
db.Do({in: 'yourtable', do: 'select'}, function(result){

  //Check result
  if(result)
  {
    //All is OK, you can now access to the rows
  }
  else
  {
    //Oups, something went wrong. See the Node logs
  }
});
```

## License

**doSQL** is under the [MIT](LICENSE) license.
