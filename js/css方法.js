var css = (function(){
    function css(elem,attr,value) {
        switch (arguments.length) {
            case 2:
                if(typeof attr == 'object'){
                    for(var i in attr){
                        elem.style[i] = attr[i];
                    }
                }else{
                    return elem.currentStyle ? elem.currentStyle[attr] : getComputedStyle(elem)[attr];
                }
                break;
            case 3:
                elem.style[attr] = value;
                break;
        }
}

    return{
        css : css
    };
})();