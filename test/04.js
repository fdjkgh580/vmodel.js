$(function (){

    // 4 $.vmodel.get() 第三個參數 callback 或 true
    $.vmodel.create({
        selector: '.content',
        model: '--content_4_1',
        isautoload: false,
        method: function (){
            var vs = this;
            this.autoload = ['say', 'hello'];
            this.say = function (){
                vs.root.html(null);
                vs.struct('say', true);
            }
            this.hello = function (){
                vs.root.html("5");
                vs.struct('hello', true);
            }
        }
    });


    var result = $.vmodel.get("content_4_1", true, function (storage){
        console.log("4-2 callback");

        //刪除並清除視覺屬性
        $(".content").removeAttr("data-vmodel-history");

        // 

        $.vmodel.create({
            selector: '.content',
            model: '--content_4_2',
            isautoload: false,
            method: function (){
                var vs = this;
                this.autoload = ['say', 'hello'];
                this.say = function (){
                    vs.root.html(null);
                    vs.struct('say', true);
                }

                this.hello = function (){
                    vs.root.html("5");
                    vs.struct('hello', true);
                }
            }
        });
        
        $.vmodel.get("content_4_2", true, true);

        setTimeout(function (){
            var his = $.vmodel.history('content_4_2');
            if (his.vname == "content_4_2") {
                console.log("4-3");
                console.log("4: OK");
            }
        }, 500)



    });
    if (result === true) {
        console.log('4-1');
    }


    

    
})