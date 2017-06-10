/* jshint globalstrict: true */
'use strict';

function Scope (){
    this.$$wathers=[];
}

Scope.prototype.$watch = function(watchFn, listenerFn){
    var watcher={
        watchFn : watchFn,
        listenerFn : listenerFn
    };

    this.$$wathers.push(watcher);
};

Scope.prototype.$digest = function (){
    _.forEach (this.$$wathers, function(watcher){
        watcher.listenerFn();
    });
};
