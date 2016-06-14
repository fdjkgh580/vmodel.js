$(function (){
    // 監聽指定的倉儲的模組都完成
    // ** 這支必須獨立測試，避免出錯 **

    var sec = 650;

    $.vmodel.create({
        selector: '.content',
        model: '--md_09_1',
        isinit: false,
        method: function (){
            var vs = this;
            this.autoload = ['say'];
            this.say = function (){
                setTimeout(function (){
                    console.log('md_09_1 create.');
                    vs.struct('say');
                }, sec * 0);
            }
        }
    });
    
    $.vmodel.create({
        selector: '.content',
        model: '--md_09_2',
        isinit: false,
        method: function (){
            var vs = this;
            this.autoload = ['say'];
            this.say = function (){
                setTimeout(function (){
                    console.log('md_09_2 create.');
                    vs.struct('say');
                }, sec * 1);
            }
        }
    });
    
    $.vmodel.create({
        selector: '.content',
        model: '--md_09_3',
        isinit: false,
        method: function (){
            var vs = this;
            this.autoload = ['say'];
            this.say = function (){
                setTimeout(function (){
                    console.log('md_09_3 create.');
                    vs.struct('say');
                }, sec * 2);
            }
        }
    });
    
    $.vmodel.create({
        selector: '.content',
        model: '--md_09_4',
        isinit: false,
        method: function (){
            var vs = this;
            this.autoload = ['say'];
            this.say = function (){
                setTimeout(function (){
                    console.log('md_09_4 create.');
                    vs.struct('say');
                }, sec * 3);
            }
        }
    });
    
    $.vmodel.create({
        selector: '.content',
        model: '--md_09_5',
        isinit: false,
        method: function (){
            var vs = this;
            this.autoload = ['say'];
            this.say = function (){
                setTimeout(function (){
                    console.log('md_09_5 create.');
                    vs.struct('say');
                }, sec * 4);
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
    $.vmodel.get("md_09_5", true, function (data){
        console.log(data.vname + " success.");
    });


    $.vmodel.end(['md_09_1', 'md_09_2'], function (storage){
        console.log('監聽的 md_09_1 與 md_09_2 完成');
        console.log(storage);
    });
    $.vmodel.end(function (storage){
        console.log('監聽所有的完成');
        console.log(storage);
    });
    
})