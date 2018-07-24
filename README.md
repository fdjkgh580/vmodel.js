# 安裝
- 現在可以透過 NPM 進行安裝。
````
npm i vmodel.js
````

# API
## $.vmodel.create()
建立一個封閉式的模組

### 模板說明
這個範例流程式這麼跑的
- 定義好模組，包括模組名稱、綁定的根節點。
- 透過 $.vmodel.get() 啟動，而不是 isautoload: true 啟動。(好處是當有多個 vmodel 模組需要相互呼叫的時候，才不會有呼叫不到模組的狀況發生。一般來說建議 isautoload: false 並使用 $.vmodel.get(model_name, true) 的方式啟動。)
- vmodel 自動觸發了 init() 的方法
````javascript
$.vmodel.create({
    selector: '.container',
    model: '--hello',
    isautoload: false,
    method: function (){
        var vs = this;
        this.autoload = ['init'];
        this.init = function (){
            
        }
    }
});

$.vmodel.get('hello', true);
````
- selector：想要綁定的根，可以是任何選擇器，包含 'window'。
- model：模組名稱，呼叫時可用 hello 即可。若是文件搜尋可搜尋 --hello 方便編輯器定位。
- isautoload：是否自動讀取，若為 true 將在讀取完程式碼後立即自動觸發 method.autoload。
- method：我們要設計的公開/私有方法都在這裡。


### method
- vs：方便在 method 內部呼叫根
- vs.root：等於 $('.container')
- vs.root.on：等於 $('.container').on(...);
- vs.selector：等於 .container
- vs.struct('method_name'); 標記這個結構已完成，參閱後方 $.vmodel.get() 使用。
- autoload：指定當初始化想要自動觸發的公開方法，可以是 [] 或是匿名函式。注意，匿名函式務必 return []。
````javascript
this.autoload = ['init', 'say']
// 或
this.autoload = function (){
    // 可以執行你想要的程式碼...
    return ['say'];
}
````

### 公開方法
需要掛在 this 底下，可透過 $.vmodel.get('模組名稱') 呼叫。例如我們有個方法
````javascript
this.say_my_name = function (){
    console.log('Jason')
}
````
那麼就可以透過這麼方式執行
````javascript
$.vmodel.get('hello').say_my_name(); // => Jason
````

### 私有方法
若我們有一些零碎處理的函式，不打算讓外不呼叫，那麼可以這麼寫
````javascript
var _key = '123456';

var _mixkey = function (){
    return 'A' + _key;
}

this.get_key = function (){
    return _mixkey();
}
````
這樣外部只能呼叫 ````$.vmodel.get('hello').get_key()```` 而不能呼叫 ````_key```` 與 ````_mixkey()````。

## $.vmodel.get(model_name, p2, p3)
- model_name：模組名稱
- p2：true | false 是否啟用自動觸發
- p3：是否啟用監聽並添加視覺化屬性。注意，這是非同步。function: 監聽直到完成模組後會觸發 callback，並夾帶了該倉儲。true: 僅啟用監聽。使用此方法，需要讓 autoload 自動觸發的對應方法，都使用 ````vs.struct(method_name)```` 標記。
- return：模組的物件，若要呼叫公開方法，可以使用 ````$.vmodel.get('hello').get_key()```` 這種方式。
````javascript
$.vmodel.create({
    selector: '.container',
    model: '--tool',
    isautoload: false,
    method: function (){
        var vs = this;
        this.autoload = ['call'];
        this.call = function (){
            setTimeout(function (){
                console.log('setTimeout')
                vs.struct("call"); //在終點務必標記方法名稱，代表這個方法執行完畢
            }, 2000);
        }
    }
});

$.vmodel.get("tool", true, function (){
    console.log('完成觸發')
});
````
過 2 秒後會顯示以下
````
setTimeout
完成觸發
````

## $.vmodel.end([], function (){})
當指定多組的倉儲模組化完成後，要觸發的方法
````javascript
// 模組 tool
$.vmodel.create({
    selector: '.container',
    model: '--tool',
    isautoload: false,
    method: function (){
        var vs = this;
        this.autoload = ['call'];
        this.call = function (){
            setTimeout(function (){
                console.log('setTimeout call')
                vs.struct("call");
            }, 2000);
        }
    }
});

// 模組 apple
$.vmodel.create({
    selector: '.container',
    model: '--box',
    isautoload: false,
    method: function (){
        var vs = this;
        this.autoload = ['apple'];
        this.apple = function (){
            setTimeout(function (){
                console.log('setTimeout apple')
                vs.struct("apple");
            }, 4000);
        }
    }
});

// 過 2 秒後會觸發
$.vmodel.get("tool", true, function (){
    console.log('完成觸發 tool')
});

// 過 4 秒後會觸發
$.vmodel.get("box", true, function (){
    console.log('完成觸發 box')
});


$.vmodel.end(['tool', 'box'],function (){
    console.log('所有模組都觸發完畢')
});

````
依序會顯示
````
setTimeout call
完成觸發 tool
setTimeout apple
完成觸發 box
所有模組都觸發完畢
````

## $.vmodel.delete(model_name)
刪除指定的模組。注意如果內部綁訂了 Dom 事件，事件並不會因此而撤銷。
````javascript
var obj = $.vmodel.get("tool");
console.log(obj); // => method {autoload: Array(1), ......

$.vmodel.delete("tool");

var obj = $.vmodel.get("tool"); // => 呼叫的倉儲名稱 tool 不存在。
console.log(obj); // => false
````
## $.vmodel.history(model_name)
取得視覺化屬性紀錄
- status：是否已經完成啟用
- vname：模組名稱
- timestamp：完成啟用的時間戳記
````javascript
$.vmodel.get("tool", true, function (){
    console.log('完成觸發 tool')
    console.log($.vmodel.history('tool'));
});
````

## $.vmodel.version()
取得這個版本的編號。
````javascript
console.log($.vmodel.version()); // => 1.6.1
````
