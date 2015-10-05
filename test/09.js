$(function (){
    // 監聽指定的倉儲的模組都完成
    // ** 這支必須獨立測試，避免出錯 **

    $(".content").vmodel("--md_01", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            setTimeout(function (){
                console.log('create md_01 success');
                vs.struct('say');
            }, 500);
        }
    });
    $(".content").vmodel("--md_02", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            setTimeout(function (){
                console.log('create md_02 success');
                vs.struct('say');
            }, 1000);
        }
    });
    $(".content").vmodel("--md_03", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            setTimeout(function (){
                console.log('create md_03 success');
                vs.struct('say');
            }, 3000);
        }
    });

    $.vmodel.get("md_01", true, true);
    $.vmodel.get("md_02", true, true);
    $.vmodel.get("md_03", true, true);
    $.vmodel.end(['md_01', 'md_02'], function (){
        
    })
    
})