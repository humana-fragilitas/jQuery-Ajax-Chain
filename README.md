jQuery Ajax Chain
==========

The **$.AjaxChain** jQuery helper class allows to perform multiple synchronously chained Ajax calls; its optional settings make possible to filter data and pass it between succeeding calls, manage custom errors, create caching mechanisms and conditionally halt queue progression.

Documentation
-----

### Constructor ###

<table>
   <thead>
      <tr>
         <td nowrap><b>name</b></td>
         <td nowrap><b>returns</b></td>
         <td nowrap><b>description</b></td>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code><b>$.AjaxChain()</b></code></td>
         <td><code>Promise</code></td>
         <td>The <code>$.ajaxChain</code> helper class returns a decorated instance of a jQuery <code>Promise</code> object (http://api.jquery.com/Types/#Promise).</td>
      </tr>
   <tbody>
</table>

### Public methods ###

<table>
   <thead>
      <tr>
         <td nowrap><b>name</b></td>
         <td nowrap><b>argument type</b></td>
         <td nowrap><b>chainable</b></td>
         <td nowrap><b>returns</b></td>
         <td nowrap><b>description</b></td>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code><b>enqueue()</b></code></td>
         <td><code>Object | Array</code></td>
         <td><code>yes</code></td>
         <td><code>Promise</code></td>
         <td>Enqueues one or more <a href="#configuration-object">configuration objects</a> for later processing.</td>
      </tr>
      <tr>
         <td><code><b>dequeue()</b></code></td>
         <td><code> - </code></td>
         <td><code>yes</code></td>
         <td><code>Promise</code></td>
         <td>Sequentially and synchronously dequeues the <a href="#configuration-object">configuration objects</a> enqueued via <code><b>enqueue()</b></code> method in the order they were added, triggering the related Ajax calls.</td>
      </tr>
      <tr>
         <td><code><b>clearQueue()</b></code></td>
         <td><code> - </code></td>
         <td><code>yes</code></td>
         <td><code>Promise</code></td>
         <td>Clears the currently queued configuration objects.</td>
      </tr>
      
      <tr>
         <td><code><b>state()</b></code></td>
         <td nowrap><code> - </code></td>
         <td><code>no</code></td>
         <td><code>String</code></td>
         <td><a href="http://api.jquery.com/deferred.state/" target="_blank">jQuery API Reference</a>.</td>
      </tr>
      
      <tr>
         <td><code><b>then()</b></code></td>
         <td nowrap><code>Function | Array</code></td>
         <td><code>yes</code></td>
         <td><code>Promise</code></td>
         <td><a href="http://api.jquery.com/deferred.then/" target="_blank">jQuery API Reference</a>.</td>
      </tr>

      <tr>
         <td><code><b>done()</b></code></td>
         <td nowrap><code>Function | Array</code></td>
         <td><code>yes</code></td>
         <td><code>Promise</code></td>
         <td><a href="http://api.jquery.com/deferred.done/" target="_blank">jQuery API Reference</a>.</td>
      </tr>
      
      <tr>
         <td><code><b>fail()</b></code></td>
         <td nowrap><code>Function | Array</code></td>
         <td><code>yes</code></td>
         <td><code>Promise</code></td>
         <td><a href="http://api.jquery.com/deferred.fail/" target="_blank">jQuery API Reference</a>.</td>
      </tr>
      
      <tr>
         <td><code><b>always()</b></code></td>
         <td nowrap><code>Function | Array</code></td>
         <td><code>yes</code></td>
         <td><code>Promise</code></td>
         <td><a href="http://api.jquery.com/deferred.always/" target="_blank">jQuery API Reference</a>.</td>
      </tr>
      
      <tr>
         <td><code><b>progress()</b></code></td>
         <td nowrap><code>Function | Array</code></td>
         <td><code>yes</code></td>
         <td><code>Promise</code></td>
         <td><a href="http://api.jquery.com/deferred.progress/" target="_blank">jQuery API Reference</a>.</td>
      </tr>
      
      <tr>
         <td colspan="5"><h4>Callback functions arguments</h4>
         <b>Note: </b>differently from the original jQuery implementation, callbacks specified as arguments of <code><b>then()</code></b>, <code><b>done()</code></b>, <code><b>fail()</code></b>, <code><b>always()</code></b> methods get passed an array of responses: <code>[response[,responseN, ...]]</code>.<br><br>
         Furthermore, callbacks specified as arguments of <code><b>progress</b>()</code> method get passed an object structured as follows:<br><br>
            <table>
               <thead>
                  <tr>
                     <td nowrap><b>key</b></td>
                     <td nowrap><b>key value type</b></td>
                     <td nowrap><b>key value</b></td>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td><code><b>index</b></code></td>
                     <td><code>Number</code></td>
                     <td>Dequeued Ajax call zero-based index</td>
                  </tr>
                  <tr>
                     <td><code><b>label</b></code></td>
                     <td><code>String</code></td>
                     <td>Dequeued Ajax call label, either user-defined or randomly generated</td>
                  </tr>
                  <tr>
                     <td><code><b>data</b></code></td>
                     <td><code> * </code></td>
                     <td>Dequeued Ajax call response</td>
                  </tr>
               </tbody>
            </table>
         </td>
      </tr>
      
   </tbody>
</table>

### Configuration object ###

<table>
   <thead>
      <tr>
         <td nowrap><b>key</b></td>
         <td nowrap><b>key value type</b></td>
         <td nowrap><b>optional</b></td>
         <td nowrap><b>description</b></td>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code><b>ajaxSettings</b></code></td>
         <td><code>Object</code></td>
         <td><code>no</code></td>
         <td>jQuery $.ajax method <a href="http://api.jquery.com/jQuery.ajax/#jQuery-ajax-settings" target="_blank">settings</a>.</td>
      </tr>
      <tr>
         <td><code><b>label</b></code></td>
         <td><code>String</code></td>
         <td><code>yes</code></td>
         <td>Configuration object label (see <code><b>progress()</b></code> callback functions <a href="#callback-functions-arguments">argument</a>).</td>
      </tr>
      <tr>
         <td><code><b>transform</b></code></td>
         <td><code>Function</code></td>
         <td><code>yes</code></td>
         <td>Returning a truthy value allows to arbitrarily overwrite the next queued Ajax call 'data' property value specified in the original jQuery $.ajax method configuration object ('ajaxSettings'). See <a href="#1-dynamically-passing-data-between-succeeding-ajax-calls">example #1</a>.</td>
      </tr>
      <tr>
         <td><code><b>appendToUrl</b></code></td>
         <td><code>Function</code></td>
         <td><code>yes</code></td>
         <td>Returning a truthy value (String) allows to append string fragments to the next queued Ajax call 'url' property value specified in original jQuery $.ajax method configuration object ('ajaxSettings'); handy when dealing with semantic urls. See <a href="#2-dynamically-appending-url-fragments-between-succeeding-ajax-calls">example #2</a>.</td>
      </tr>
      <tr>
         <td><code><b>hasErrors</b></code></td>
         <td><code>Function</code></td>
         <td><code>yes</code></td>
         <td>Returning a truthy value determines any registered fail callback(s) to be called immediately, passing the former as an argument; the queue is then rejected. See <a href="#3-dynamically-resolving-jquery-ajax-chain-queues-upon-custom-errors">example #3</a>.</td>
      </tr>
      <tr>
         <td><code><b>hasCache</b></code></td>
         <td><code>Function</code></td>
         <td><code>yes</code></td>
         <td> Returning a truthy value allows to prevent the related Ajax call from being executed, passing the former as a parameter to any registered handler(s); useful to create caching mechanisms. See <a href="#4-creating-caching-mechanisms">example #4</a>.</td>
      </tr>
      <tr>
         <td><code><b>hasHaltingCapabilities</b></code></td>
         <td><code>Function</code></td>
         <td><code>yes</code></td>
         <td>Returning a truthy value prevents the queue from further progressing to the succeeding Ajax calls; the queue is then resolved. See <a href="#5-halting-queue-upon-conditional-logic">example #5</a>.</td>
      </tr>
      <tr>
         <td><code><b>isSkippable</b></code></td>
         <td><code>Function</code></td>
         <td><code>yes</code></td>
         <td>Returning a truthy value prevents the queue from being halted in case of $.Ajax error. See <a href="#6-preventing-a-queue-from-being-halted-in-case-of-ajax-error">example #6</a>.</td>
      </tr>
      <tr>
         <td colspan="4"><h4>Optional functions arguments</h4>
         All functions specified as values of optional configuration object properties are passed the dequeued Ajax call response as argument.
         </td>
      </tr>
   </tbody>
<table>

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
                                  .first().attr('id');
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
        if ($tempXmlResponse &&
		    $tempXmlResponse.find("item").eq(0)
                            .find("categoryId")
							.text()
							.indexOf(categoryFilter) !== -1) {
            return "The following exception occurred: forbidden category n° " + categoryFilter;
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
**Note:** this project was packaged with [grunt-init-jquery](https://github.com/gruntjs/grunt-init-jquery).
