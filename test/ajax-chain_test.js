(function($){

    /* global sinon */
    
    // sinon fake server setup
    
    var tempSinonServer;
    
    tempSinonServer = sinon.fakeServer.create();
    tempSinonServer.autoRespond = true;
    
    // sinon server routes
                                
    tempSinonServer.respondWith("GET", /\/test-call-0/,
                                [200, { "Content-Type": "text/plain" },
                                "test-call-0-response"]);

    tempSinonServer.respondWith("GET", /\/test-call-1/,
                                [200, { "Content-Type": "text/plain" },
                                "test-call-1-response"]);
                                
    tempSinonServer.respondWith("GET", /\/test-call\?id=1/,
                                [200, { "Content-Type": "text/plain" },
                                "test-call-1-response"]);

    tempSinonServer.respondWith("GET", /\/test-call-2/,
                                [200, { "Content-Type": "text/plain" },
                                "test-call-2-response"]);                               
    
    tempSinonServer.respondWith("GET", /\/http-500-error/,
                                [500, { "Content-Type": "text/plain" },
                                ""]);
                                        
    // QUnit module: public methods
    
    module('jQuery Ajax Chain: public methods');
    
    // QUnit test: public methods: all methods are chainable
    
    QUnit.test('All public methods should be chainable.', function(){

        var tempAjaxChain;
        
        // test expectations
        expect(3);
        
        // default assignments
        tempAjaxChain = new $.AjaxChain();

        deepEqual(tempAjaxChain.enqueue(), tempAjaxChain, 'enqueue() method returns the same Promise object instance returned by $.AjaxChain constructor.');
        deepEqual(tempAjaxChain.dequeue(), tempAjaxChain, 'dequeue() method returns the same Promise object instance returned by $.AjaxChain constructor.');
        deepEqual(tempAjaxChain.clearQueue(), tempAjaxChain, 'clearQueue() method returns the same Promise object instance returned by $.AjaxChain constructor.');
        
    }); 
    
    // QUnit test: public methods: enqueue() and dequeue()
    
    QUnit.asyncTest('enqueue() and dequeue()', function(){

        var tempAjaxChain;
        
        // test expectations
        expect(1);
        
        // default assignments
        tempAjaxChain = new $.AjaxChain();
        
        // AjaxChain configuration
        tempAjaxChain.enqueue([{ ajaxSettings: { url: "/test-call-0" } },
                               { ajaxSettings: { url: "/test-call-1" } },
                               { ajaxSettings: { url: "/test-call-2" } }]).dequeue().done(function(response){

            strictEqual(response.length, 3, 'Enqueuing and subsequently dequeuing [n] valid and successful configuration objects via enqueue() and dequeue() public methods causes the $.AjaxChain Promise object instance done handler to be called with an array containing [n] results as argument.');
            
            QUnit.start();

        }); 
    
    });

    // QUnit test: clearQueue()
    
    QUnit.asyncTest('clearQueue()', function(){

        var tempAjaxChain;
        
        // test expectations
        expect(1);
        
        // default assignments
        tempAjaxChain = new $.AjaxChain();                             
        
        // AjaxChain configuration
        tempAjaxChain.enqueue({ ajaxSettings: { url: "/test-call-0" } }).clearQueue().enqueue({ ajaxSettings: { url: "/test-call-1" } }).dequeue().done(function(response){

            strictEqual(response[0], "test-call-1-response", 'The public method dequeue() allows to remove any currently queued configuration object(s).');
            
            QUnit.start();

        });
    
    });
    
    // QUnit module: configuration options
    
    // QUnit test: transform option
    
    module('jQuery Ajax Chain: configuration options');
    
    QUnit.asyncTest('transform function', function(){

        var tempAjaxChain;
        
        // test expectations
        expect(1);
        
        // default assignments
        tempAjaxChain = new $.AjaxChain();                             
        
        // AjaxChain configuration
        tempAjaxChain.enqueue([{ ajaxSettings: { url: "/test-call-0" }, transform: function(response){ if (response === "test-call-0-response") { return { id: "1" }; } } },
                               { ajaxSettings: { url: "/test-call" } }]).dequeue().done(function(response){

            strictEqual(response[1], "test-call-1-response", 'Returning a truthy value allows to pass current Ajax call processed results to the next queued one, overwriting its "data" property value specified in the "ajaxSettings" object.');
            
            QUnit.start();

        });
    
    });
    
    // QUnit test: appendToUrl option
    
    QUnit.asyncTest('appendToUrl function', function(){

        var tempAjaxChain;
        
        // test expectations
        expect(1);
        
        // default assignments
        tempAjaxChain = new $.AjaxChain();                             
        
        // AjaxChain configuration
        tempAjaxChain.enqueue([{ ajaxSettings: { url: "/test-call-0" }, appendToUrl: function(response){ if (response === "test-call-0-response") { return "-1"; } } },
                               { ajaxSettings: { url: "/test-call" } }]).dequeue().done(function(response){

            strictEqual(response[1], "test-call-1-response", 'Returning a truthy value (String) allows to append to the next queued Ajax call "ajaxSettings" object "url" property value an arbitrary string.');
            
            QUnit.start();

        });
    
    });

    // QUnit test: hasErrors option
    
    QUnit.asyncTest('hasErrors function', function(){

        var tempAjaxChain;
        
        // test expectations
        expect(1);
        
        // default assignments
        tempAjaxChain = new $.AjaxChain();                             
        
        // AjaxChain configuration
        tempAjaxChain.enqueue([{ ajaxSettings: { url: "/test-call-0" }, hasErrors: function(response){ if (response === "test-call-0-response") { return true; } } },
                               { ajaxSettings: { url: "/test-call-1" }}]).dequeue().fail(function(response){

            strictEqual(response.length, 1, 'Returning a truthy value allows to immediately resolve the queue.');
            
            QUnit.start();

        });
    
    });
    
    // QUnit test: hasCache option
    
    QUnit.asyncTest('hasCache function', function(){

        var tempAjaxChain;
        
        // test expectations
        expect(1);
        
        // default assignments
        tempAjaxChain = new $.AjaxChain();                             
        
        // AjaxChain configuration
        tempAjaxChain.enqueue([{ ajaxSettings: { url: "/test-call-0" }, hasCache: function(){ return "test-call-0-cached-response"; } }]).dequeue().done(function(response){

            strictEqual(response[0], "test-call-0-cached-response", 'Returning a truthy value allows to prevent the current Ajax call from being executed: any success handlers attached to it are passed the returned truthy value.');
            
            QUnit.start();

        });
    
    });
    
    // QUnit test: hasHaltingCapabilities option
        
    QUnit.asyncTest('hasHaltingCapabilities function', function(){

        var tempAjaxChain;
        
        // test expectations
        expect(1);
        
        // default assignments
        tempAjaxChain = new $.AjaxChain();                             
        
        // AjaxChain configuration
        tempAjaxChain.enqueue([{ ajaxSettings: { url: "/test-call-0" }, hasHaltingCapabilities: function(response){ if (response === "test-call-0-response") { return "test-call-0-cached-response"; } } },
                               { ajaxSettings: { url: "/test-call-1" }}]).dequeue().done(function(response){

            strictEqual(response.length, 1, 'Returning a truthy allows to prevent the next queued Ajax call from being executed.');
            
            QUnit.start();

        });
    
    });
    
    // QUnit test: isSkippable option
    
    QUnit.asyncTest('isSkippable function', function(){

        var tempAjaxChain;
        
        // test expectations
        expect(1);
        
        // default assignments
        tempAjaxChain = new $.AjaxChain();                             
        
        // AjaxChain configuration
        tempAjaxChain.enqueue([{ ajaxSettings: { url: "/http-500-error" }, isSkippable: function(){ return true; } },
                               { ajaxSettings: { url: "/test-call-1" }}]).dequeue().done(function(response){

            strictEqual(response.length, 2, 'Returning a truthy value prevents the queue from being halted in case of $.Ajax error.');
            
            QUnit.start();

        });
    
    });
    
}(jQuery));
