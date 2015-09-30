$(function (){
    // 8
    $(".content").vmodel("--content", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            vs.struct('say');
        }
    })
    $result = $.vmodel.get("content", true, function (){
        //...
    });

    $(".content").vmodel("--content_else", false, function (){
        var vs = this;
        this.autoload = ['say', 'hello'];
        this.say = function (){
        }
        this.hello = function (){
            vs.root.html("8");
            vs.struct(['say', 'hello']);
        }
    });
    
    $result = $.vmodel.get("content_else", true, function (){
        console.log('8: OK');
    });
})