# vmodel.js
這是一項模組化 jQuery 的編寫框架。非常適合用在網頁上大量的 UI 設計。透過抽象與實作的分離，物件與模組可有效重複利用，也方便 IDE 查找和維護。

一般我們會這麼寫 jQuery
```javascript
$("form").on("click", ".register", function (){});
$("form").on("click", ".login", function (){});
```
這是實作的方法，一旦結構大了會非常不好維護，IDE 也很難搜尋(如 sublimetext 快捷鍵 ctrl + R)。所以試圖從這個角度來解決問題：

1. 我們需要在外層添加抽象的邏輯行為。日後查找問題，應該是思考抽象的邏輯行為。
2. 模組化，我們需要有個根節點作為綁定和識別。讓各種模組綁定在不同的根節點，可以降低瀏覽器的負擔。而且容易維護。

-----------------

# 資源
- [範例](https://github.com/fdjkgh580/vmodel.js/blob/master/README.md#範例)
- [說明書](https://github.com/fdjkgh580/vmodel.js/blob/master/README.md#說明書)

----

# 範例
## 基本用法 
[線上看](http://jsfiddle.net/qs4v3cc4/)
```javascript
$(".demo_1").vmodel(function (){
    this.autoload = ['get'];

    this.get = function (){
        // 使用 this.root 可以取得 $(".box_wrap")
        this.root.on("click", ".say", function (){
            alert("Demo. Hello World")
        })
    }
})
```
```html
<div class="demo_1">
    <input type="button" class="say" value="click me">
</div>
```

## 取得內部元素
[線上看](http://jsfiddle.net/qhp3awsg/)
```javascript
$(".demo_2").vmodel(function (){
    
    var _this = this;

    this.autoload = ['get_title'];

    this.get_title = function (){
        this.root.on("click", ".say", function (){
            // 改用 _this
            alert( _this.root.find(".title").val() );
        })
    }
})
```
```html
<div class="demo_2">
    <input type="text" class="title" value="Demo2. Hello World">
    <input type="button" class="say" value="click me">
</div>
```

## 複製自己
[線上看](http://jsfiddle.net/rzedtspr/1/)
```javascript
$(function (){
    $(".demo_3").vmodel(function (){
        var _this = this;
        this.autoload = ['clone'];
        this.clone = function (){
            this.root.on("click", ".clone", function (){
                $(this).clone().appendTo(_this.selector)
            })
        }
    });
});
```
```html
<div class="demo_3">
    <input type="button" class="clone" value="clone">
</div>
```

## UI 設計
[線上看](http://jsfiddle.net/79382rvb/)
```javascript
$(".demo_4").vmodel(function (){

    var _this = this;

    //按鈕的背景顏色
    this.bgcolor = {
        "default" : "#F52121",
        "hover"   : "#F75252",
        "click"   : "#2EC16A"
    }

    // 可紀錄原本按鈕的文字
    this.def_button_str;

    this.autoload = ['create_button', 'event'];

    //建立的總程序
    this.create_button = function (){
        this.add_ele()
            .set_style();

        //先把文字記錄起來，供還原使用
        this.def_button_str = this.root.find(".newbutton").val();
    }


    //事件
    this.event = function (){

        //想要綁定的事件
        this.root.on({

            mouseover: function (){
                $(this).css({
                    background: _this.bgcolor.hover,
                });
            },

            mouseleave: function (){
                $(this).css({
                    background: _this.bgcolor.default,
                });

                //還原文字
                _this.reset_button_str();
            },
            click: function (){
                $(this).css({
                    background: _this.bgcolor.click,
                });
                $(this).val("O");
            }

        }, ".newbutton");
    }

    // 還原按鈕文字
    this.reset_button_str = function (){
        var string = this.def_button_str;
        this.root.find(".newbutton").val(string);
    }

    //添加樣式
    this.set_style = function (){
        this.root.find(".newbutton").css({
            position: "relative",
            border: "none",
            background: this.bgcolor.default,
            color: "white",
            padding: "7px 0",
            width: "100px",
            borderRadius: "5px",
            fontSize: "20px",
            transition: "0.3s all",
            cursor: "pointer"
        })
    }

    //添加按鈕元素
    this.add_ele = function (){
        this.root.append('<input class="newbutton" type="button" value="Button">');

        //可以串接使用
        return this;
    }
});
```
```html
<div class="demo_4"></div>
```

## 模組間的交互運用
[線上看](http://jsfiddle.net/gyxoe4ec/)
```javascript
// 控制鈕模組
$(".demo_5 .ctrl").vmodel("d5/ctrl", function (){

    var _this = this;
    
    this.autoload = ['first_add', 'first_delete'];

    // 增加
    this.first_add = function (){
        this.root.on("click", ".add", function (){

            //動作
            $.vmodel.get("d5/action").add();

            // 更新資訊
            $.vmodel.get("d5/info").update();
        })
    }

    // 刪除
    this.first_delete = function (){
        this.root.on("click", ".delete", function (){

            //動作...
            var act = $.vmodel.get("d5/action");
            var who = act.child_last();
            act.delete(who);

            // 更新資訊
            $.vmodel.get("d5/info").update();
        })
    }
})

// 動作模組
$(".demo_5 .action").vmodel("d5/action", function (){
    
    this.add = function (){ //添加
        this.root.append('<li>item</li>');
    }

    this.delete = function (selector){ // 刪除
        this.root.find(selector).remove();
    }

    this.child_last = function (){ //取得最後元素
        return this.root.find("li").last();
    }
})

//資訊模組
$(".demo_5 .info").vmodel("d5/info", function (){

    this.autoload = ['init'];

    // 初始化
    this.init = function (){
        this.update();
    }

    // 更新
    this.update = function (){
        var total = this.total();
        this.root.find(".num").html(total);
    }

    //取得目前總數量
    this.total = function (){
        var act_obj = $.vmodel.get("d5/action");
        return act_obj.root.find("li").length;
    }
});
```
```html
<div class="demo_5">
    <div class="ctrl">
        <button class="add">添加</button>
        <button class="delete">刪除</button>
    </div>
    <p class="info">目前 <span class="num"></span> 個</p>
    <ul class="action"></ul>
</div>
```

# 說明書

## .vmodel()
```javascript
$(function (){
    $("根選擇器").vmodel(function (){
    })
})
```
或
```javascript
$(function (){
    $("根選擇器").vmodel("自訂倉儲名稱", function (){
    })
})
```
自訂倉儲名稱，可以讓你由 vmodel() 外部程式去呼叫想要公開的方法。例如
```javascript
$(".tool").vmodel("tool", function (){
    function name() {
        return "製圖筆";
    }
    this.call = function (){
        return this.name();
    }
})
```
那麼，我們在外部可以使用這個方法來呼叫 call()
```javascript
$.vmodel.get("tool").call();
```

## .vmodel() 內部寫法與概念
在 function 命名上，我們盡量取一個邏輯上的名稱。至於是如何實做，我們寫在裡面。這方便讓邏輯與實作分離，也有利於 IDE 搜尋你的程式結構，有助於維護上的方便。例如這裡的 this.open 這個打開動作，是一個行為上的概念。但是誰要打開以及如何打開，這種實作的方式我們就寫在內部 $this.root.on("click", ".book", function(){ })

```javascript
$(".tool").vmodel("tool", function (){
    this.open = function (){
        $this.root.on("click", ".book", function (){
            //....
        })
    }
})
```

## $.model.get([storage])
可以返回你的倉儲名稱。當不指定 storage 可以返回所有的倉儲。


## this.autoload = ['方法名稱']
## this.autoload = function (){ return ['方法名稱'] }
這是選用的。當我們有命名這項屬性或方法時，可以讓 jQuery 優先觸發。通常用在綁定事件這類的情況，當頁面一載入後，jQuery 就會跟著觸發。
```javascript
$(".box").vmodel(function (){
    this.autoload = ['bind_click', 'auto'];
    this.bind_click = function (){
        this.root.on("click", "button", function (){
            //......
        })
    }
    
    this.auto = function (){
        setInterval(function (){
            //......
        }, 1000);
    }
})
```

# 有2個擴增的屬性可以讓你呼叫。

## this.root
會得到 $(selector);
```javascript
$(".box").vmodel(function (){
    this.say = function (){
        // 記得只能用在公開的 function 內部
        // 等同 $(".box").find(".item").length;
        var num = this.root.find(".item").length;
    }
})
```

## this.selector
會得到 $(selector) 中的 selector
```javascript
$(".box").vmodel(function (){
    this.say = function (){
        // 記得只能用在公開的 function 內部
        // 等同 .box 
        var who = this.selector;
    }
})
```



