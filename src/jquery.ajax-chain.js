;(function(factory){

    if (typeof define === 'function' && define.amd) {
    
        // amd: register jquery plugin as an anonymous module
        define(['jquery'], factory);
    
    } else {
    
        // register jquery plugin in browser global object
        factory(jQuery);
        
    }
    
}(function($){
    
    /**
     * @module $
     * @class AjaxChain
     * @constructor
     * @return {Object} Promise object instance (http://api.jquery.com/Types/#Promise)
     */
     
    $.AjaxChain = function AjaxChain(){
        
        'use strict';
        
        var queries = [],
            queriesLength,
            queriesResults = [],
            currentQueryObj,
            deferred,
            AjaxChainQuery;
        
        // Master Deferred (http://api.jquery.com/category/deferred-object/) object instance
        deferred = new $.Deferred();
        
        /***********************************************/
        /* Private methods                             */
        /***********************************************/
        
        /**
         * Enqueues configuration objects for later processing
         *  
         * @method _enqueue
         * @param {Array|Object} confObj Either an array containing one or more configuration
         *                               objects or a single configuration object
         * @private
         */
        
        function _enqueue(confObj){
            
            var tempArguments,
                tempArgumentsLength,
                tempArgument,
                i;
            
            if ($.isArray(confObj)) {
            
                tempArguments = confObj;
            
            } else {
                
                tempArguments = [];
                tempArguments.push(confObj);
            
            }
            
            tempArgumentsLength = tempArguments.length;
            
            for (i = 0; i < tempArgumentsLength; i += 1) {
                
                tempArgument = tempArguments[i];
                
                if (typeof tempArgument === 'object') {
                    
                    queries.push(new AjaxChainQuery(tempArgument, queries.length));
                    
                }
            
            }
            
            return deferred.promise();
        
        } // _enqueue()
        
        /**
         * Dequeues current queue
         *  
         * @method _dequeue
         * @param {Object} [data] optionally overwrites the next queued Ajax call
         *                   'data' property value specified in the original jQuery $.ajax method
         *                   configuration object (see 'ajaxSettings' property of $.AjaxChain configuration object)
         * @param {String} [urlFragment] optionally allows to append string fragments
         *                               to the next queued Ajax call 'url' property value specified in the original jQuery $.ajax
         *                               method configuration object (see 'ajaxSettings' property of $.AjaxChain configuration object);
         *                               handy when dealing with semantic urls 
         * @private
         */
        
        function _dequeue(data, urlFragment){

            if (currentQueryObj = queries.shift()) {
            
                currentQueryObj.execute(data, urlFragment).
                                progress(queryPromiseProgressHandler).
                                done(queryPromiseDoneHandler).
                                fail(queryPromiseFailHandler);
                            
            }
                            
            return deferred.promise();        
        
        } // _dequeue()
        
        /**
         * Clears current queue
         *  
         * @method _clearQueue
         * @private
         */
        
        function _clearQueue(){
        
            queries.length = 0;
            
            return deferred.promise();
        
        } // _clearQueue()
        
        /***********************************************/
        /* Promise object handlers                     */
        /***********************************************/
        
        function queryPromiseDoneHandler(response){
            
            var tempData,
                tempUrlFragment;
            
            queriesLength = queries.length;
            
            // Store dequeued Ajax call response
            queriesResults.push(response);
            
            // Has current AjaxChainQuery object any halting capabilities ?
            if (currentQueryObj.hasHaltingCapabilities(response)) {
                
                deferred.resolve(queriesResults);
                return;
            
            }
            
            // Proceed to next AjaxChainQuery object (if available)
            if (queriesLength > 0) {
                
                // Apply possible AjaxChainQuery object data and url transformation functions 
                if (!currentQueryObj.hasFailed()) {
                
                    if (currentQueryObj.transform) {
                    
                        tempData = currentQueryObj.transform(response);
                    
                    }
                    
                    if (currentQueryObj.appendToUrl) {
                    
                        tempUrlFragment = currentQueryObj.appendToUrl(response);
                    
                    }
                
                }
                
                _dequeue(tempData, tempUrlFragment);
        
            } else {
            
                // Resolve the entire queue with the currently stored results
                deferred.resolve(queriesResults);
            
            }
            
        } // queryPromiseDoneHandler()
        
        function queryPromiseProgressHandler(response){

            deferred.notify({ index: currentQueryObj.getIndex(),
                              label: currentQueryObj.getLabel(),
                              data: response });
        
        } // queryPromiseProgressHandler()
        
        function queryPromiseFailHandler(response){
            
            // Is current AjaxChainQuery object skippable in case of error ?
            if (!currentQueryObj.isSkippable(response)) {
                
                queriesResults.push(response);
                deferred.reject(queriesResults);
            
            } else {
                
                // Forward error data to success callback
                queryPromiseDoneHandler(response);
                
            }
        
        } // queryPromiseFailHandler()
        
        /**
         * $.ajax jQuery method wrapper; implements a $.Deferred (http://api.jquery.com/category/deferred-object/)
         * object in order to notify custom events in relation to XMLHTTPRequest's progression and/or
         * exitus and/or certain programmatically defined conditions
         *
         * @class AjaxChainQuery
         * @constructor
         */
         
        AjaxChainQuery = function AjaxChainQuery(querySettings, index){
        
            var _LABEL_PREFIX_,
                tempQuerySettings,
                tempIndex,
                tempLabel,
                ajaxSettings,
                hasFailed,
                transform,
                
                appendToUrl,
                hasCache,
                hasErrors,
                isSkippable,
                hasHaltingCapabilities,
                _execute,
                _hasFailed,
                _getIndex,
                _getLabel,
                deferred;
                
            // default assignments
            _LABEL_PREFIX_ = 'ajax_chain_class_';
            hasFailed = false;
            tempIndex = index;
            
            // create master Deferred (http://api.jquery.com/category/deferred-object/) instance
            deferred = new $.Deferred();
            
            // Merge user defined parameters with defaults
            tempQuerySettings = querySettings || {};
            tempLabel = tempQuerySettings.label || _getPseudoUniqueID(_LABEL_PREFIX_);
            ajaxSettings = tempQuerySettings.ajaxSettings || {};
            transform = tempQuerySettings.transform || defaultTransform;
            appendToUrl = tempQuerySettings.appendToUrl || defaultAppendToUrl;
            hasCache = tempQuerySettings.hasCache || defaultHasCache;
            hasErrors = tempQuerySettings.hasErrors || defaultHasErrors;
            isSkippable = tempQuerySettings.isSkippable || defaultIsSkippable;
            hasHaltingCapabilities = tempQuerySettings.hasHaltingCapabilities || defaultHasHaltingCapabilities;
            
            /* jshint unused:false */
            
            /**
             * Returning a truthy value allows to arbitrarily overwrite the next queued Ajax call
             * 'data' property value specified in the original jQuery $.ajax method configuration object
             * (see 'ajaxSettings' property of $.AjaxChain configuration object)
             */                           
            
            function defaultTransform(response){
            
                return null;
            
            }
            
            /**
             * Returning a truthy value (String) allows to append string fragments
             * to the next queued Ajax call 'url' property value specified in original jQuery $.ajax
             * method configuration object (see 'ajaxSettings' property of $.AjaxChain configuration object);
             * handy when dealing with semantic urls 
             */  
            
            function defaultAppendToUrl(response){
            
                return '';
            
            }
            
            /**
             * Returning a truthy value allows to prevent the related Ajax call
             * from being executed, passing the former as a parameter to any 
             * registered handler(s); useful to create caching mechanisms
             */
            
            function defaultHasCache(response){
            
                return false;
            
            }
            
            /**
             * Returning a truthy value determines any registered fail callback(s)
             * to be called immediately, passing the former as an argument;
             * the queue is then rejected
             */

            function defaultHasErrors(response){
            
                return false;
            
            }
            
            /**
             * Returning a truthy value allows to prevent the queue from
             * being halted in case of Ajax error
             */
            
            function defaultIsSkippable(response){
            
                return false;
            
            }
            
            /**
             * Returning a truthy value prevents from further
             * progressing to the succeeding Ajax calls;
             * the queue is then resolved
             */
            
            function defaultHasHaltingCapabilities(response){
                
                return false;
            
            }
            
            /***********************************************/
            /* Promise object handlers                     */
            /***********************************************/
            
            function promiseDoneHandler(response){
                
                var tempHasErrors;
                
                tempHasErrors = hasErrors(response);
                
                if (tempHasErrors) {
                    
                    deferred.reject(tempHasErrors);
                
                } else {

                    deferred.notify(response);
                    deferred.resolve(response);
                    
                }
                
            }
            
            /* jshint unused:false */
            
            function promiseFailHandler(response){
                
                hasFailed = true;
                deferred.reject(response);
            
            }
            
            /**
             * Triggers execution of embedded $.ajax function
             *  
             * @method _execute
             * @param [data] Data to be optionally passed as 'data'
             *               property value of the $.ajax method settings
             * @private
             * @return {Object} AjaxChainQuery instance own Promise object (http://api.jquery.com/Types/#Promise)
             */
             
            _execute = function _execute(data, urlFragment){
                
                var tempHasCache,
                    tempTrimmedUrlFragment;
                
                tempHasCache = hasCache();
                tempTrimmedUrlFragment = $.trim(urlFragment);
                
                if (data) { ajaxSettings.data = data; }
                if (tempTrimmedUrlFragment) { ajaxSettings.url += tempTrimmedUrlFragment; }
                
                if (tempHasCache) {
                    
                    promiseDoneHandler(tempHasCache);
                
                } else {
                    
                    $.ajax(ajaxSettings).
                      done(promiseDoneHandler).
                      fail(promiseFailHandler);
                
                }
                
                return deferred.promise();
            
            }; // _execute()
            
            /**
             * Allows to check wheter $.ajax call has failed
             *  
             * @method _hasFailed
             * @private
             * @return {Boolean} Boolean value indicating wheter $.ajax call has failed
             */
            
            _hasFailed = function _hasFailed(){
            
                return hasFailed;
            
            }; // _hasFailed()
            
            /**
             * Gets AjaxChainQuery instance index
             *  
             * @method _getIndex
             * @private
             * @return {Number} AjaxChainQuery instance index
             */
            
            _getIndex = function _getIndex(){
                
                return tempIndex;
            
            }; // _getIndex()
            
            /**
             * Gets AjaxChainQuery instance label
             *  
             * @method _getLabel
             * @private
             * @return {String} AjaxChainQuery instance label
             */
            
            _getLabel = function _getLabel(){
            
                return tempLabel;
            
            }; // _getLabel()
            
            /***********************************************/
            /* Utility functions                           */
            /***********************************************/
            
            /**
             * generates a pseudo-unique id in the following format:
             * [prefix][year;month;day;milliseconds]_[20 chars random hash]
             */
             
            function _getPseudoUniqueID(prefix){
                
                var dateObject,
                    timestamp,
                    randomhash,
                    pseudoUniqueID;
                
                // generates a lenght-variable random literal hash
                function getRandomHash(){
                
                    var tempRandomHash = '',
                        characters,
                        hashLength,
                        i;
                    
                    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    hashLength = 20;

                    for (i = 0; i < hashLength; i += 1) {
                    
                        tempRandomHash += characters.charAt(Math.floor(Math.random() * characters.length));
                    
                    }

                    return tempRandomHash;
                
                } // getRandomHash()
                
                // create timestamp
                dateObject = new Date();
                timestamp = dateObject.getFullYear().toString() +
                            dateObject.getMonth().toString() +
                            dateObject.getDate().toString() +
                            dateObject.getTime().toString();
                
                // create random hash
                randomhash = getRandomHash();
                
                // concatenate lead type, timestamp and random hash
                pseudoUniqueID = prefix + timestamp + '_' + randomhash;
                
                return pseudoUniqueID; 
            
            } // _getPseudoUniqueID()
            
            /***********************************************/
            /* Public methods                              */
            /***********************************************/
            
            return {
                
                /**
                 * Returning a truthy value allows to arbitrarily overwrite the next queued Ajax call
                 * 'data' property value specified in the original jQuery $.ajax method configuration object
                 * (see 'ajaxSettings' property of $.AjaxChain configuration object)
                 *  
                 * @method transform
                 * @return {Type}
                 */
                
                transform: transform,
                
                /**
                 * Returning a truthy value (String) allows to append string fragments
                 * to the next queued Ajax call 'url' property value specified in original jQuery $.ajax
                 * method configuration object (see 'ajaxSettings' property of $.AjaxChain configuration object);
                 * handy when dealing with semantic urls 
                 */
                 
                appendToUrl: appendToUrl,
                    
                /**
                 * Returning a truthy value allows to prevent the queue from
                 * being halted in case of Ajax error
                 *  
                 * @method isSkippable
                 * @return {Type}
                 */
                
                isSkippable: isSkippable,
                
                /**
                 * Returning a truthy value prevents from further progressing to the succeeding Ajax calls;
                 * the queue is then resolved
                 *
                 * @method hasHaltingCapabilities
                 * @return {Type}
                 */
                
                hasHaltingCapabilities: hasHaltingCapabilities,
                
                /**
                 * Triggers execution of $.ajax query
                 *  
                 * @method execute
                 * @param [data] Data to be optionally passed as 'data'
                 *               property value of the $.ajax method settings
                 * @return {Object} AjaxChainQuery instance own Promise object (http://api.jquery.com/Types/#Promise)
                 */
                
                execute: _execute,
                
                /**
                 * Allows to check wheter $.ajax call has failed
                 *  
                 * @method hasFailed
                 * @return {Boolean} Boolean value indicating wheter $.ajax call has failed
                 */
                
                hasFailed: _hasFailed,
                
                /**
                 * Gets AjaxChainQuery instance index
                 *  
                 * @method getIndex
                 * @return {Number} AjaxChainQuery instance index
                 */
                
                getIndex: _getIndex,
                
                /**
                 * Gets AjaxChainQuery instance label
                 *  
                 * @method getLabel
                 * @return {String} AjaxChainQuery instance label
                 */
                
                getLabel: _getLabel
            
            };
        
        }; // AjaxChainQuery()
        
        /***********************************************/
        /* Public methods                              */
        /***********************************************/
        
        /**
         * Enqueues configuration objects for later processing
         *  
         * @method _enqueue
         * @param {Object} One or more configuration objects
         */
        
        deferred.promise().enqueue = _enqueue;
        
        /**
         * Dequeues current queue
         *  
         * @method _dequeue
         */
        
        deferred.promise().dequeue = _dequeue;
        
        /**
         * Clears current queue
         *  
         * @method _clearQueue
         */
        
        deferred.promise().clearQueue = _clearQueue;
        
        return deferred.promise();
    
    }; // AjaxChain()
    
}));