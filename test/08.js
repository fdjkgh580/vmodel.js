$(function (){


    // 這支必須獨立測試
    $(".content").vmodel("--content_1", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            vs.struct('say', true);
        }
    });

    $.vmodel.get("content_1", true, function(){});
            

    $.vmodel.end(function (){
        console.log('end');
    })
    
    
    
})