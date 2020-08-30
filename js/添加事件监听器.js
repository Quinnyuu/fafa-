var EventUtil = (function () {
    var addEvent = function (oElement,eventType,funcName) {//兼容IE
        oElement.addEventListener ? oElement.addEventListener(eventType,funcName,false) : oElement.attachEvent('on' + eventType,funcName);
    };
    var removeEvent = function () {
        oElement.removeEventListener ? oElement.removeEventListener(eventType,funcName) : oElement.detachEvent('on' + eventType,funcName);
    };
    return{
        addEvent : addEvent,
        removeEvent : removeEvent
    };
})()