/* jshint globalstrict: true */
'use strict';

function initWatchValue (){}
function Scope (){
    this.$$wathers=[];
    this.$$lastDirtyWatch = null;
}

Scope.prototype.$watch = function(watchFn, listenerFn){
    var watcher={
        watchFn : watchFn,
        listenerFn : listenerFn||function(){},
        last : initWatchValue
    };

    this.$$wathers.push(watcher);
    this.$$lastDirtyWatch = null;
};

Scope.prototype.$digest = function (){
    var ttl = 10;
    var dirty;
    this.$$lastDirtyWatch = null;
    do{
        dirty = this.$$digestOnce();
        if(dirty && !(ttl--)){
            throw "10 digest iteration reached";
        }
    }while(dirty);
};

Scope.prototype.$$digestOnce = function(){
    var self = this;
    var newValue , oldValue, dirty;
    _.forEach(this.$$wathers, function(watcher){
        newValue = watcher.watchFn(self);
        oldValue = watcher.last;
        if(newValue !== oldValue){
            self.$$lastDirtyWatch = watcher;
            watcher.last = newValue;
            watcher.listenerFn(newValue,
                               (oldValue === initWatchValue ? newValue:oldValue),
                               self);
            dirty  = true;
        }
        else if (self.$$lastDirtyWatch === watcher){
            return false;
        }
    });
    return dirty;
};
