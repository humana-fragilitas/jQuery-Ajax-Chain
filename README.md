jQuery Ajax Chain
==========

The **$.AjaxChain** jQuery helper class allows to perform multiple synchronously chained Ajax calls; its optional settings make possible to filter data and pass it between succeeding calls, manage custom errors, create caching mechanisms and conditionally halt queue progression.

Documentation
-----

### Constructor ###

| *name* | *description* |
| :--    | :--           |
| **`$.AjaxChain():JQueryAjaxChain`** | The `$.ajaxChain` helper class extends the `JQueryPromise<T>` object ([http://api.jquery.com/Types/#Promise](http://api.jquery.com/Types/#Promise)) with custom methods. |

### Public methods ###

| *name* | *chainable* | *description* |
| :--    | :--             | :--         |
| **`enqueue(confObj: AjaxChainConfiguration | AjaxChainConfiguration[]):JQueryAjaxChain`** | `yes` | Enqueues one or more [configuration objects](#configuration-object) for later processing. |
| **`dequeue():JQueryAjaxChain`** | `yes` | Sequentially and synchronously dequeues the [configuration objects](#configuration-object) enqueued via **`enqueue()`** method in the order they were added, triggering the related Ajax calls. |
| **`clearQueue():JQueryAjaxChain`** | `yes` | Clears the currently queued configuration objects. |
| **`state():string`** | `no` | [jQuery API Reference](http://api.jquery.com/deferred.state/). |
| **`then<U>(doneFilter: (value?: T, ...values: any[]) => U | JQueryPromise<U>, failFilter?: (...reasons: any[]) => any, progressFilter?: (...progression: any[]) => any):JQueryPromise<U>`** | `yes` | [jQuery API Reference](http://api.jquery.com/deferred.then/). |
| **`done(doneCallback1?: JQueryPromiseCallback<T> | JQueryPromiseCallback<T>[], ...doneCallbackN: Array<JQueryPromiseCallback<T> | JQueryPromiseCallback<T>[]>):JQueryPromise<T>`** | `yes` | [jQuery API Reference](http://api.jquery.com/deferred.done/). |
| **`fail(failCallback1?: JQueryPromiseCallback<any>|JQueryPromiseCallback<any>[], ...failCallbacksN: Array<JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[]>):JQueryPromise<T>`** | `yes` | [jQuery API Reference](http://api.jquery.com/deferred.fail/). |
| **`always(alwaysCallback1?: JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[], ...alwaysCallbacksN: Array<JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[]>):JQueryPromise<T>`** | `yes` | [jQuery API Reference](http://api.jquery.com/deferred.always/). |
| **`progress(progressCallback1?: JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[], ...progressCallbackN: Array<JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[]>):JQueryPromise<T>`** | `yes` | [jQuery API Reference](http://api.jquery.com/deferred.progress/). |

#### Callback functions arguments

**Note:** differently from the original jQuery implementation, callbacks specified as arguments of **`then()`**, **`done()`**, **`fail()`**, **`always()`** methods get passed an array of responses: **`[response[,responseN, ...]]`**. Furthermore, callbacks specified as arguments of **`progress()`** method get passed an object structured as follows:

| *key* | *value* |
| :--   | :--         |
|  **`index:number`** | Dequeued Ajax call zero-based index |
|  **`label:string`** | Dequeued Ajax call label, either user-defined or randomly generated |
|  **`data:any`** | Dequeued Ajax call response |

### Configuration object ###

| *key* | *description* |
| :--   | :--           |
| **`ajaxSettings:JQueryAjaxSettings`** | jQuery $.ajax method [settings](http://api.jquery.com/jQuery.ajax/#jQuery-ajax-settings). |
| **`label?:string`** | Configuration object label (see **`progress()`** [callback functions argument](#callback-functions-arguments)). |
| **`transform?:Function`** | Returning a truthy value allows to arbitrarily overwrite the next queued Ajax call 'data' property value specified in the original jQuery $.ajax method configuration object ('ajaxSettings'). See [example #1](#1-dynamically-passing-data-between-succeeding-ajax-calls). |
| **`appendToUrl?:Function`** | Returning a truthy value (String) allows to append string fragments to the next queued Ajax call 'url' property value specified in original jQuery $.ajax method configuration object ('ajaxSettings'); handy when dealing with semantic urls. See [example #2](#2-dynamically-appending-url-fragments-between-succeeding-ajax-calls). |
| **`hasErrors?:Function`** | Returning a truthy value determines any registered fail callback(s) to be called immediately, passing the former as an argument; the queue is then rejected. See [example #3](#3-dynamically-resolving-queue-upon-custom-errors). |
| **`hasCache?:Function`** | Returning a truthy value allows to prevent the related Ajax call from being executed, passing the former as a parameter to any registered handler(s); useful to create caching mechanisms. See [example #4](#4-creating-caching-mechanisms). |
| **`hasHaltingCapabilities?:Function`** | Returning a truthy value prevents the queue from further progressing to the succeeding Ajax calls; the queue is then resolved. See [example #5](#5-halting-queue-upon-conditional-logic). |
| **`isSkippable?:Function`** | Returning a truthy value prevents the queue from being halted in case of $.Ajax error. See [example #6](#6-preventing-a-queue-from-being-halted-in-case-of-ajax-error). |

**Note:** All functions specified as values of optional configuration object properties (marked with a question mark) are passed the dequeued Ajax call response as argument.

Examples
-----

### Typical setup ###

```javascript
var ajaxChain = new $.AjaxChain();
ajaxChain.enqueue([configurationObject[,configurationObjectN, ... ]])
         .dequeue()
         .then(doneCallback, failCallback, progressCallback);
```
### Common configuration patterns ###
```xml
<!-- The succeeding examples assume the following xml response: -->

<?xml version = "1.0"?>
<items>
    <item id="000001">
        <name>Item #1</name>
        <categoryId>1</categoryId>
    </item>
    <item id="000002">
        <name>Item #2</name>
        <categoryId>2</categoryId>
    </item>
    <item id="000003">
        <name>Item #3</name>
        <categoryId>3</categoryId>
    </item>
</items>

```
##### 1. Dynamically passing data between succeeding Ajax calls:
```javascript
var ajaxChain,
    configurationObj1,
    configurationObj2;
ajaxChain = new $.AjaxChain();
configurationObj1 = {
    ajaxSettings: {
        type: "GET",
        dataType: "xml",
        url: "/items"
   },
   transform: function(xmlResponse){
        var nextCallDataObj;
        if (xmlResponse) {
            nextCallDataObj = {
                id: $(xmlResponse).find('item')
                                  .first().attr('id')
            };                   
            return nextCallDataObj;               
        }                  
        return false;              
   }
};
// configuration object omitted for brevity
configurationObj2 = { . . . };
ajaxChain.enqueue([configurationObj1, configurationObj2])
         .dequeue()
         .then(doneCallback, failCallback, progressCallback);
```
##### 2. Dynamically appending url fragments between succeeding Ajax calls:
```javascript
var ajaxChain,
    configurationObj1,
    configurationObj2;
ajaxChain = new $.AjaxChain();
configurationObj1 = {
    ajaxSettings: {
        type: "GET",
        dataType: "xml",
        url: "/items"
    },
    appendToUrl: function(xmlResponse){
        var nextCallUrlFragment = "";
        if (xmlResponse) {
            nextCallUrlFragment = "/" + $(xmlResponse).find('item')
                                                      .first()
                                                      .attr('id');
        };                 
        return nextCallUrlFragment;               
    }               
};
// configuration object omitted for brevity
configurationObj2 = { . . . };
ajaxChain.enqueue([configurationObj1, configurationObj2])
         .dequeue()
         .then(doneCallback, failCallback, progressCallback);
```
##### 3. Dynamically resolving queue upon custom errors:
```javascript
var ajaxChain,
    configurationObj1,
    configurationObj2;
ajaxChain = new $.AjaxChain();
configurationObj1 = {
    ajaxSettings: {
        type: "GET",
        dataType: "xml",
        url: "/items"
    },
    hasErrors: function(xmlResponse){
        var $tempXmlResponse,
            categoryFilter = "1";
        $tempXmlResponse = $(xmlResponse);
        // check current Ajax call response for errors
        if ($tempXmlResponse.find("item").eq(0)
                            .find("categoryId")
                            .text()
                            .indexOf(categoryFilter) !== -1) {
            return "[Exception] forbidden category id: " + categoryFilter;
        }
        return false;         
   }
};
// configuration object omitted for brevity
configurationObj2 = { . . . };
ajaxChain.enqueue([configurationObj1, configurationObj2])
         .dequeue()
         .then(doneCallback, failCallback, progressCallback);
```
##### 4. Creating caching mechanisms:
```javascript
var ajaxChain,
    configurationObj1,
    configurationObj2;
ajaxChain = new $.AjaxChain();
configurationObj1 = {
    ajaxSettings: {
        type: "GET",
        dataType: "xml",
        url: "/items"
    },
    hasCache: function(xmlResponse){  
        // retrieve possible cached results
        if (itemsCollection.length) {
            return itemsCollection.toJSON();
        }
        return false;     
    }
};
// configuration object omitted for brevity
configurationObj2 = { . . . };
ajaxChain.enqueue([configurationObj1, configurationObj2])
         .dequeue()
         .then(doneCallback, failCallback, progressCallback);
```
##### 5. Halting queue upon conditional logic:
```javascript
var ajaxChain,
    configurationObj1,
    configurationObj2;
ajaxChain = new $.AjaxChain();
configurationObj1 = {
    ajaxSettings: {
        type: "GET",
        dataType: "xml",
        url: "/items"
    },
    hasHaltingCapabilities: function(xmlResponse){
        var $tempXmlResponse;
        $tempXmlResponse = $(xmlResponse);
        if ($tempXmlResponse.find("item").eq(0)
                            .find("categoryId")
                            .text().indexOf("1") !== -1) {
            return true;
        }
        return false;        
    }
};
// configuration object omitted for brevity
configurationObj2 = { . . . };
ajaxChain.enqueue([configurationObj1, configurationObj2])
         .dequeue()
         .then(doneCallback, failCallback, progressCallback);
```
##### 6. Preventing a queue from being halted in case of $.Ajax error:
```javascript
var ajaxChain,
    configurationObj1,
    configurationObj2;
ajaxChain = new $.AjaxChain();
configurationObj1 = {
    ajaxSettings: {
        type: "GET",
        dataType: "xml",
        url: "/items"
    },
    isSkippable: function(xmlResponse){
        return true;
    }
};
// configuration object omitted for brevity
configurationObj2 = { . . . };
ajaxChain.enqueue([configurationObj1, configurationObj2])
         .dequeue()
         .then(doneCallback, failCallback, progressCallback);
```

### TypeScript ###

##### Visual Studio (NuGet) #####

1. Open the Package Manager Console
2. `Install-Package jquery-ajax-chain.TypeScript.DefinitelyTyped`

##### Node.js (TSD) #####

1. Open a shell in your project's scripts folder
2. `npm install tsd -g`
3. `tsd install jquery-ajax-chain --save`

### Testing ###

##### Headless #####

1. Open a shell in the package root folder
2. `npm install`
3. `bower install`
4. `grunt test:headless`

##### Browser #####

1. Open a shell in the package root folder
2. `npm install`
3. `bower install`
4. `grunt test:browser` (`--port` option available, e.g.: `grunt test:browser --port=8083`)

**Note:** this project was packaged with [grunt-init-jquery](https://github.com/gruntjs/grunt-init-jquery).
