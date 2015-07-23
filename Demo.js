$(function (){

    // 按鈕模型
    $(".open").vmodel("md/button", false, function (){
        var vs = this;
        this.autoload = ['bind_click'];
        //綁定點擊
        this.bind_click = function (){
            vs.root.on("click", function (){
                vs.hide();
                $.vmodel.get("md/dialog").show();
            });
        }
        //隱藏
        this.hide = function (){
            vs.root.hide();
        }
        //顯示
        this.show = function (){
            vs.root.fadeIn(50);
        }
    });

    // 對話模型
    $(".dialog").vmodel("md/dialog", false, function (){
        var vs = this;
        this.autoload = ['init', 'bind_close', 'bind_item_hover'];
        //初始化，將項目模型加入到指定的位置
        this.init = function (){
            var where = vs.root.find(".list");
            $.vmodel.get("md/item").append_to(where);
        }
        //顯示
        this.show = function (){
            //漸層出現視窗後
            vs.root.fadeIn();
            
            //item 顯示特效
            var target = vs.root.find(".item");
            $.vmodel.get("md/item").each_animate(target, 0);
        }
        //隱藏
        this.hide = function (callback){
            //視窗關閉動畫
            vs.root.transit({
                opacity: 0,
                y: -100
            }, 300, function (){
                //要還原供下次使用
                vs.root.hide().css({
                    opacity: 1,
                    y: 0
                })
            });

            //使用同步返回
            setTimeout(function (){
                callback();
            }, 200);

            //項目也要還原
            $.vmodel.get("md/item").reset_style(vs.root.find(".item"));
            
        }
        //綁定關閉
        this.bind_close = function (){
            vs.root.on("click", ".close", function (){
                vs.hide(function (){
                    $.vmodel.get("md/button").show();
                });
                return false;
            })
        }
        //綁定移入移出的樣式
        this.bind_item_hover = function (){
            vs.root.on({
                //移入
                mouseover : function (){
                    $.vmodel.get("md/item").over($(this));
                    return false;
                },
                //移出
                mouseleave : function (){
                    var who = vs.root.find(".item");
                    $.vmodel.get("md/item").simple_style(who);
                }
            }, ".item");
        }
        
    });
    
    //項目模型
    $(".item").vmodel("md/item", false, function (){
        var vs = this;
        this.autoload = [];
        //加入到特定位置
        this.append_to = function (selector){
            var data = ['Favorite', 'Download', 'Share'];
            $.each(data, function(key, val) {
                vs.get_element(val).appendTo(selector)
            });
        }
        //取得可用元素
        this.get_element = function (text){
            var ele = vs.root.clone(true).removeAttr("hidden");
            ele.text(text);

            //預設偏移樣式
            ele = vs.reset_style(ele);
            return ele;
        }

        // 預設或還原樣式
        this.reset_style = function (ele){
            return ele.css({
                y: 70,
                opacity: 0
            })
        }

        // 移入樣式
        this.over = function (selector){
            selector.transit({
                scale: 1.03,
                zIndex: 1,
                boxShadow: "rgb(52, 52, 52) 0px 27px 36px -32px"
            }, 400)
        }

        // 一般樣式
        this.simple_style = function (selector){
            selector.css({
                scale: 1,
                zIndex: 0,
                boxShadow: "none"
            })
        }

        //逐一顯示特效
        this.each_animate = function (who, index){
            
            who.eq(index).transit({
                y: 0,
                opacity: 1
            })
            var next = index + 1;
            if (who.eq(next).length > 0) {
                setTimeout(function (){
                    vs.each_animate(who, next);
                }, 50)
            }
        }
        
    });
    
    // 初始化
    $.vmodel.get("md/button", true);
    $.vmodel.get("md/dialog", true);
    
})