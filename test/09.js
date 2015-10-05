$(function (){
    // 監聽指定的倉儲的模組都完成
    // ** 這支必須獨立測試，避免出錯 **

    var sec = 650;

    $(".content").vmodel("--md_09_1", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            setTimeout(function (){
                console.log('create md_09_1 success');
                vs.struct('say');
            }, sec * 0);
        }
    });
    $(".content").vmodel("--md_09_2", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            setTimeout(function (){
                console.log('create md_09_2 success');
                vs.struct('say');
            }, sec * 1);
        }
    });
    $(".content").vmodel("--md_09_3", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            setTimeout(function (){
                console.log('create md_09_3 success');
                vs.struct('say');
            }, sec * 2);
        }
    });
    $(".content").vmodel("--md_09_4", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            setTimeout(function (){
                console.log('create md_09_4 success');
                vs.struct('say');
            }, sec * 3);
        }
    });
    $(".content").vmodel("--md_09_5", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            setTimeout(function (){
                console.log('create md_09_5 success');
                vs.struct('say');
            }, sec * 4);
        }
    });

    // 全部啟用
    $.vmodel.get("md_09_1", true, true);
    $.vmodel.get("md_09_2", true, true);
    $.vmodel.get("md_09_3", true, true);
    $.vmodel.get("md_09_4", true, true);
    $.vmodel.get("md_09_5", true, true);


    $.vmodel.end(['md_09_1', 'md_09_2'], function (){
        console.log('監聽的 md_09_1 與 md_09_2 完成');
    });
    $.vmodel.end(function (){
        console.log('監聽所有的完成');
    });
    
})