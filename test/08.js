$(function (){

    // 監聽所有倉儲的模組都完成
    // ** 這支必須獨立測試，避免出錯 **

    $(".content").vmodel("--content_8_1", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            vs.struct('say', true);
        }
    });
    $(".content").vmodel("--content_8_2", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            setTimeout(function (){
                vs.struct('say', true);
            }, 1000);
        }
    });
    $(".content").vmodel("--content_8_3", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            setTimeout(function (){
                vs.struct('say', true);
            }, 2000);
        }
    });

    $.vmodel.get("content_8_1", true, true);
    console.log('8: 監聽 content_8_1 但不回調');

    $.vmodel.get("content_8_2", true, function (){
        console.log('8: 監聽 content_8_2: OK');
    });
    $.vmodel.get("content_8_3", true, function (){
        console.log('8: 監聽 content_8_3: OK');
    });

    $.vmodel.end(function (){
        console.log('所有模組都完成了');
    })
    
    
    
})