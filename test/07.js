$(function (){

    //7 利用 $.vmodel.history() 取得視覺化屬性
    $.vmodel.create({
        selector: '.content',
        model: '--content_7_1',
        isautoload: false,
        method: function (){
            var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            vs.struct('say');
        }
        }
    });
    
    
    $.vmodel.get("content_7_1", true, function (){
        var result = $.vmodel.history('content_7_1');
        if (result.data.vname == "content_7_1" && result.status == true) {
            console.log('7-1');
        } 
    });

    $.vmodel.create({
        selector: '.content',
        model: '--content_7_2',
        isautoload: false,
        method: function (){
            var vs = this;
            this.autoload = ['say'];
            this.say = function (){
                vs.struct('say');
            }
        }
    });

    $.vmodel.get("content_7_2", true, function (){
        var result = $.vmodel.history('content_7_2');
        if (result.data.vname == "content_7_2" && result.status == true) {
            console.log('7-2');
        } 
    });

    $.vmodel.create({
        selector: window,
        model: '--window',
        isautoload: false,
        method: function (){
            var vs = this;
            this.autoload = ['say'];
            this.say = function (){
                vs.struct('say');
            }
        }
    });
    
    $.vmodel.get("window", true, function (){
        var result = $.vmodel.history('window');
        if (result.data.vname == "window" && result.status == true) {
            console.log('7-3');
        }
    });

    $.vmodel.create({
        selector: document,
        model: '--document',
        isautoload: true,
        method: function (){
            var vs = this;
            this.autoload = ['say'];
            this.say = function (){
                vs.struct('say');
            }
        }
    });

    $.vmodel.get("document", true, function (){
        var result = $.vmodel.history('document');
        if (result.data.vname == "document" && result.status == true) {
            console.log('7-4');
            console.log('7: OK');
        }
    });
})