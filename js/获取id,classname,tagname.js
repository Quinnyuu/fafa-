//封装获取id,class,tagname的方法
var get = (function(){
    var byId = function(id) {
        return document.getElementById(id);
    }
    var byTagName = function(tagName,obj) {
        return (obj || document).getElementsByTagName(tagName);
    }
    var byClassName = function (className,oParent) {
        var aClass = [];
        var aElem = this.byTagName('*',oParent);
        var reClass = new RegExp('(^|)' + className + '(|$)');
        for(var i = 0;i < aElem.length;i++){
            reClass.test(aElem[i].className) && (aClass.push(aElem[i]));
        }
        return aClass;
    }
    return{
        byId : byId,
        byTagName : byTagName,
        byClassName : byClassName
    }
})();