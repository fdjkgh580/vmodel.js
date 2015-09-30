$(function (){

    //9
    $(".content").vmodel("--content", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            vs.root.html('9-1');
            vs.struct('say');
        }
    });
    $.vmodel.get("content", true, function (){
        var result = $.vmodel.history('content');
        if (result.vname == "content" && result.status == true) {
            console.log('9-1: OK');
        } 
    });


    $(".content").vmodel("--content2", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            vs.root.html('9-2');
            vs.struct('say');
        }
    });
    $.vmodel.get("content2", true, function (){
        var result = $.vmodel.history('content2');
        if (result.vname == "content2" && result.status == true) {
            console.log('9-2: OK');
        } 
    });
    
})