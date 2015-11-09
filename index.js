//Import dependencies
var mydb = require('minsql');

//Function for return an error
function ReturnError()
{
  //Show the info
  console.error('doSQL: please read the documentation before using doSQL.');

  //Exit with error code
  process.exit(1);

  //Return
  return false;
}

//Function for check the output
function CheckCallback(error, action, results, callback)
{
  //Check for error
  if(error)
  {
    //Show error
    console.error('doSQL: error running ' + action + ':')
    console.error(error);

    //Run the callback with null argument
    callback(null);
  }
  else
  {
    //Callback with the results
    callback(results);
  }
}

//Connect to database
exports.Connect = function(obj)
{
  //Array with the arguments
  var dbargs = ['host', 'user', 'pass', 'db'];

  //Check all
  for(var i = 0; i < dbargs.length; i++)
  {
    //Check if is defined
    if(typeof obj[dbargs[i]] === 'undefined')
    {
      //Show error
      console.error('doSQL: undefined "' + dbargs[i] + '" on database connect.');

      //Exit
      return ReturnError();
    }
  }

  //Connect to minsql
  mydb.Connect(obj.host, obj.user, obj.pass, obj.db);
};

//Do
exports.Do = function(obj, callback)
{
  //Check callback
  if(typeof callback === 'undefined')
  {
    //Show error
    console.error('doSQL: you must provide a callback for the "Do" command.');

    //Exit
    return ReturnError();
  }

  //Check if obj is a string
  if(typeof obj === 'string')
  {
    //Make the query
    mydb.Query(obj, function(err, results){ CheckCallback(err, 'query', results, callback); });

    //Exit
    return false;
  }

  //obj musth have the do argument
  if(typeof obj.do === 'undefined')
  {
    //Show error
    console.error('doSQL: undefined key "do" on database query.');

    //Exit
    return ReturnError();
  }

  //Check the in and named option
  if(typeof obj.in === 'undefined' && typeof obj.named === 'undefined')
  {
    //Show error
    console.error('doSQL: undefined key "in" or "named" on database query.');
    console.error('doSQL: for "select", "update", "delete" or "insert", you must use "in" for set the table where you want to do the query.');
    console.error('doSQL: for "create table" or "drop table", you must use "named" for define the name of the table');

    //Exit
    return ReturnError();
  }
  else
  {
    //Get the table
    var table = (typeof obj.named === 'undefined')? obj.in : obj.named;
  }

  //Convert do to undercase
  obj.do = obj.do.toLowerCase();

  //Check the do option
  if(obj.do === 'select')
  {
    //Check where
    if(typeof obj.where === 'undefined'){ obj.where = null; }

    //Make the query
    mydb.Select(table, obj.where, function(err, results){ CheckCallback(err, 'select', results, callback); });
  }
  else if(obj.do === 'insert')
  {
    //Check for value
    if(typeof obj.values === 'undefined')
    {
      //Show error
      console.error('doSQL: undefined key "values" for insert into table');

      //Exit
      return ReturnError();
    }

    //Make the query
    mydb.Insert(table, obj.values, function(err){ CheckCallback(err, 'insert', [], callback); });
  }
  else if(obj.do === 'update')
  {
    //Check for set and where
    if(typeof obj.set === 'undefined' || typeof obj.where === 'undefined')
    {
      //Show error
      console.error('doSQL: undefined key "set" or "where" for update rows in table');

      //Return error
      return ReturnError();
    }

    //Make the query
    mydb.Update(table, obj.set, obj.where, function(err){ CheckCallback(err, 'update', [], callback); });
  }
  else if(obj.do === 'delete')
  {
    //Check where
    if(typeof obj.where === 'undefined')
    {
      //Show error
      console.error('doSQL: undefined key "where" for delete rows in table');

      //Return error
      return ReturnError();
    }

    //Make the query
    mydb.Delete(table, obj.where, function(err){ CheckCallback(err, 'delete', [], callback); });
  }
  else if(obj.do === 'create table')
  {
    //Check for defined by
    if(typeof obj.definedby === 'undefined')
    {
      //Show error
      console.error('doSQL: undefined key "definedby" for create table');

      //Return error
      return ReturnError();
    }

    //Make the query
    mydb.CreateTable(table, obj.definedby, function(err){ CheckCallback(err, 'create table', [], callback)});
  }
  else if(obj.do === 'drop table')
  {
    //Make the query
    mydb.DropTable(table, function(err){ CheckCallback(err, 'drop table', [], callback); });
  }
  else
  {
    //Show error
    console.error('doSQL: unknow action "' + obj.do + '"');

    //Return error
    return ReturnError();
  }
};
