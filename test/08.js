$(function (){

    // 監聽所有倉儲的模組都完成
    // ** 這支必須獨立測試，避免出錯 **
    $.vmodel.create({
        selector: '.content',
        model: '--content_8_1',
        isautoload: true,
        method: function (){
            var vs = this;
            this.autoload = ['say'];
            this.say = function (){
                vs.struct('say', true);
            }
        }
    });

    $.vmodel.create({
        selector: '.content',
        model: '--content_8_2',
        isautoload: true,
        method: function (){
            var vs = this;
            this.autoload = ['say'];
            this.say = function (){
                setTimeout(function (){
                    vs.struct('say', true);
                }, 1000);
            }
        }
    });
    
    $.vmodel.create({
        selector: '.content',
        model: '--content_8_3',
        isautoload: true,
        method: function (){
            var vs = this;
            this.autoload = ['say'];
            this.say = function (){
                setTimeout(function (){
                    vs.struct('say', true);
                }, 2000);
            }
        }
    });
    

    $.vmodel.get("content_8_1", true, true);
    console.log('8-1 監聽 content_8_1 但不回調');

    $.vmodel.get("content_8_2", true, function (){
        console.log('8-2 監聽 content_8_2');
    });
    $.vmodel.get("content_8_3", true, function (){
        console.log('8-3 監聽 content_8_3');
    });

    $.vmodel.end(function (){
        console.log('8-4 所有模組都完成了');
        console.log('8: OK');
    })
    
    
    
})