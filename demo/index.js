$(function (){

    // 表單模組
    $(".form").vmodel("md/form", false, function (){

        var vs = this;

        this.autoload = ['init_position', 'submit'];

        // 初始化會被搬移到 .box 底下
        this.init_position = function (){
            vs.root.appendTo(".box");
        }

        // 取得輸入的文字
        this.user_say = function (){
            var val = vs.root.find(".text").val();
            return $.trim(val);
        }

        // 取得使用者是誰
        this.user_name = function (){
            return $.trim(vs.root.find(".userdata").attr("data-user-name"));
        }

        // 負責放到 .comment
        this.put = function (user, say, callback){
            $.vmodel.get("md/comment").say(user, say);
            if (callback) callback();
        }

        //送出時...
        this.submit = function (){
            vs.root.on("submit", ".userdata", function (){
                var user = vs.user_name();
                var say = vs.user_say();
                vs.put(user, say, function (){
                    //發送後可以做一些事情...
                });

                return false;
            })
        }

        // 清空
        this.clean = function (){
            vs.root.find(".text").val(null);
        }

    });

    // 列表模組
    $(".list").vmodel("md/list", false, function (){

        var vs = this;

        this.autoload = ['init_position'];

        // 這裡只負責推送到 .box ，為了範例簡單，我們這裡不推到 message。
        this.init_position = function (){
            vs.root.appendTo(".box");
        }

    });


    // 整體框的主要模組
    $(".box").vmodel("md/box", false, function (){

        var vs = this;

        this.autoload = ['init'];

        this.init = function (){

            //只放置表單、與列表框到指定的位置。
            //目前 .list 應該不會有任何資料，一直到使用者送出表單。
            vs.create_form()
                .create_list();
        }

        //初始化使用者表單
        this.create_form = function (){
            $.vmodel.get("md/form", true);
            return vs;
        }

        //初始化列表
        this.create_list = function (){
            $.vmodel.get("md/list", true);
        }

    });

    //討論模組
    $(".comment").vmodel("md/comment", false, function (){

        var vs = this;

        // 使用者說了什麼
        this.say = function (name, say){
            
            vs.set(name, say)
                .post_to(".box .list");

            // 記得清空
            $.vmodel.get("md/form").clean();

            // 也可以把模板清空
            vs.clean();

            return vs;
        }

        // 將數據放入模板
        this.set = function (name, say){
            vs.root.find(".name").html(name);
            vs.root.find(".say").html(say);

            // 我們加入時間
            var NowDate = new Date();
            vs.root.find(".current").html(NowDate.toLocaleTimeString());
            return vs;
        }

        // 放到列表中
        this.post_to = function(selector){
            //需要先拔除原本的 hidden 屬性才能顯示。
            var obj = vs.root.clone()
            obj.removeAttr('hidden').prependTo(selector);
            return vs;
        }

        // 清空
        this.clean = function (){
            vs.root.find(".name").html(null);
            vs.root.find(".say").html(null);
            vs.root.find(".current").html(null);
        }

    });

    //訊息模組。這個模組是主動式的。也就是當使用者送出資料以後，並不見得會馬上啟用訊息模組。
    $(".message").vmodel("md/message", false, function (){
        
        var vs = this;

        this.autoload = ['interval'];

        // 定時更新
        this.interval = function (){

            //這裡使用 setInterval 作範例，實際上可透過其他效能較好的方式
            setInterval(function (){
                vs.update();
            }, 2000);
        }


        // 更新訊息
        this.update = function (){
            
            // 應該是由 AJAX 向遠端更新訊息。因為遠端的關係，通常會比較慢才取回資料。
            // 我們這邊只假設是本地數據。並延遲觸發來模擬遠端的感覺。

            setTimeout(function (){

                var NowDate = new Date();

                var data = [{
                    name: "小華",
                    say: "哈囉!",
                    current: NowDate.toLocaleTimeString()
                }];

                var comment = $.vmodel.get("md/comment");

                $.each(data, function(index, ele) {
                    comment
                        .set(ele.name, ele.say, ele.current)
                        .post_to(vs.selector + " .liwrap");
                });

            }, 200);
            
        }
    });

    // 全部都定義好了，我們去觸發 box 模組與 message 模組吧
    $.vmodel.get("md/box", true);
    $.vmodel.get("md/message", true);


})