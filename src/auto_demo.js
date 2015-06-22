
$(function (){

    /* 自動化流程測試 */


    //1.
     
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
            console.log("run() OK");
        }]);

        run();

    }, 200);



    //2.
    setTimeout(function (){
        function run_stack(){
            $("body").dequeue("run_stack");
        }
        function getset(N, Y){
            if ($(".stack").html() != N) {
                console.log("run_stack 中斷, .stack html() 不可以是 " + N);
                return false;
            }
            $.vmodel.get("model_stack", true);
            if ($(".stack").html() != Y) {
                console.log(".stack html() 應該要 " + Y);
            }
        }
        $("body").queue("run_stack", [
            function (){
                var N = "0";
                var Y = "1";
                getset(N, Y);
                run_stack();
            },
            function (){
                var N = "1";
                var Y = "2";
                getset(N, Y);
                console.log("run_stack() OK!!");
                
            }
        ]);
        run_stack();
    }, 200);
    
})