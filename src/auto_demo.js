
$(function (){

    /* 自動化流程測試 */
     
    var sec = 20;

    function run (){
        $("body").dequeue("run");
    }

    setTimeout(function (){
        
        $("body").queue("run", [function (){
            $(".title").val("項目一");
            setTimeout(run, sec);
        }, function (){
            $(".clickme").click();
            setTimeout(run, sec);
        }, function (){
            $(".item").eq(0).click();
            setTimeout(run, sec);
        }, function (){
            $(".title").val("項目二");
            setTimeout(run, sec);
        }, function (){
            $(".clickme").click();
            setTimeout(run, sec);
        }, function (){
            $(".title").val("項目三");
            setTimeout(run, sec);
        }, function (){
            $(".clickme").click();
            setTimeout(run, sec);
        }, function (){
            $(".title").val("項目四");
            setTimeout(run, sec);
        }, function (){
            $(".clickme").click();
            setTimeout(run, sec);
        }, function (){
            $(".title").val("項目五");
            setTimeout(run, sec);
        }, function (){
            $(".clickme").click();
            setTimeout(run, sec);
        }, function (){
            $(".title").val("項目六");
            setTimeout(run, sec);
        }, function (){
            $(".clickme").click();
            setTimeout(run, sec);
        }, function (){
            $(".item").eq(0).click();
            setTimeout(run, sec);
        }, function (){
            $(".item").eq(0).click();
            setTimeout(run, sec);
        }, function (){
            $(".item").eq(0).click();
            setTimeout(run, sec);
        }, function (){
            $(".item").eq(0).click();
            setTimeout(run, sec);
        }, function (){
            $(".item").eq(0).click();
            setTimeout(run, sec);
        }, function (){
            console.log("end");
        }]);

        run();

    }, 200);
})