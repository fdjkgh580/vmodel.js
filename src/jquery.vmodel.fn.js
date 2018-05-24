(function ($) {

    $.fn.vmodel = function (param){
        if ($.type(param) !== "object") {
            console.log("參數型態需要是 object");
            return false;
        }
        $.vmodel.create(param);
    }

}( jQuery ));