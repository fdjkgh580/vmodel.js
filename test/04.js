$(function (){
    // 4 $.vmodel.get() 第三個參數 callback 或 true
    $(".content").vmodel("--content", false, function (){
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
    });

    var result = $.vmodel.get("content", true, function (storage){
        console.log("4-2 callback: OK");

        //刪除並清除視覺屬性
        $.vmodel.delete();
        $(".content").removeAttr("data-vmodel-history");

        //建立測試第三個屬性為 true 僅僅啟用監聽
        $(".content").vmodel("--content", false, function (){
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
        });
        $.vmodel.get("content", true, true);

        setTimeout(function (){
            var his = $.vmodel.history('content');
            if (his.vname == "content") {
                console.log("4-3: OK");
            }
        }, 500)



    });
    if (result === true) {
        console.log('4-1: OK');
    }


    

    
})