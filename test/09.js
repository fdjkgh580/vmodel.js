$(function (){
    // 監聽指定的倉儲的模組都完成
    // ** 這支必須獨立測試，避免出錯 **

    var sec = 650;


    $.vmodel.create({
        selector: '.content',
        model: '--md_09_1',
        isautoload: false,
        method: function (){
            var vs = this;
            this.autoload = ['say'];
            this.say = function (){
                console.log('md_09_1 create.');
                setTimeout(function (){
                    vs.struct('say');
                }, sec * 6);
            }
        }
    });
    
    $.vmodel.create({
        selector: '.content',
        model: '--md_09_2',
        isautoload: false,
        method: function (){
            var vs = this;
            this.autoload = ['say'];
            this.say = function (){
                console.log('md_09_2 create.');
                setTimeout(function (){
                    vs.struct('say');
                }, sec * 1);
            }
        }
    });
    
    $.vmodel.create({
        selector: '.content',
        model: '--md_09_3',
        isautoload: false,
        method: function (){
            var vs = this;
            this.autoload = ['say'];
            this.say = function (){
                console.log('md_09_3 create.');
                setTimeout(function (){
                    vs.struct('say');
                }, sec * 2);
            }
        }
    });
    
    $.vmodel.create({
        selector: '.content',
        model: '--md_09_4',
        isautoload: false,
        method: function (){
            var vs = this;
            this.autoload = ['say'];
            this.say = function (){
                console.log('md_09_4 create.');
                setTimeout(function (){
                    vs.struct('say');
                }, sec * 3);
            }
        }
    });
    
    

    // 全部啟用
    $.vmodel.get("md_09_1", true, function (data){
        console.log(data.vname + " success.");
    });
    $.vmodel.get("md_09_2", true, function (data){
        console.log(data.vname + " success.");
    });
    $.vmodel.get("md_09_3", true, function (data){
        console.log(data.vname + " success.");
    });
    $.vmodel.get("md_09_4", true, function (data){
        console.log(data.vname + " success.");
    });


    $.vmodel.end(['md_09_3', 'md_09_4'], function (storage){
        console.log('監聽的 md_09_3 與 md_09_4 完成');
        console.log(storage);
    });
    $.vmodel.end(function (storage){
        console.log('監聽所有的完成');
        console.log(storage);
    });
    
})