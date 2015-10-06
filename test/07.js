$(function (){

    //7 利用 $.vmodel.history() 取得視覺化屬性
    $(".content").vmodel("--content_7_1", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            vs.struct('say');
        }
    });
    $.vmodel.get("content_7_1", true, function (){
        var result = $.vmodel.history('content_7_1');
        if (result.vname == "content_7_1" && result.status == true) {
            console.log('7-1');
        } 
    });


    $(".content").vmodel("--content_7_2", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            vs.struct('say');
        }
    });
    $.vmodel.get("content_7_2", true, function (){
        var result = $.vmodel.history('content_7_2');
        if (result.vname == "content_7_2" && result.status == true) {
            console.log('7-2');
        } 
    });

    $(window).vmodel("--window", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            vs.struct('say');
        }
    });
    $.vmodel.get("window", true, function (){
        var result = $.vmodel.history('window');
        if (result.vname == "window" && result.status == true) {
            console.log('7-3');
        }
    });

    $(document).vmodel("--document", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            vs.struct('say');
        }
    });
    $.vmodel.get("document", true, function (){
        var result = $.vmodel.history('document');
        if (result.vname == "document" && result.status == true) {
            console.log('7-4');
            console.log('7: OK');
        }
    });
    
    
    
})