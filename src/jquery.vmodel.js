/**
 * v 1.1
 * 在 function 中可使用擴增的屬性
 *
 * this.root    會得到 $(selector);
 * this.select  會得到 $(selector) 中的 selector
 */
(function ($) {

    $.vmodel = {};

    //內部全域的物件。也就是控制外部的  $(selector).vmodel(的匿名含式/物件)
    $.vmodel.local = null;

    // 實體化的存放倉儲，提供內部呼叫。
    $.vmodel.storage = {}; 

    $.vmodel.api = {

        // 批次觸發需要 autoload 的方法
        EEEEE : function (autoload_method_ary, obj){
            $.each(autoload_method_ary, function(key, name) {

                if ($.type(obj[name]) != "function") {
                    $.vmodel.local.msg_error(name, "不存在。");
                }

                obj[name]();
            });
        }

    }


    /**
     * 取得倉儲
     * @param   string name    (選) 倉儲的存放名稱。當為空時，返回所有倉儲
     * @param   bool   isinit  (選) 預設 false
     * @return  object
     */
    $.vmodel.get = function (name, isinit){

        if (!name) {
            return $.vmodel.storage;
        }

        var target = $.vmodel.storage[name];
        
        if (!target) {
            console.log("呼叫的倉儲名稱 "+ name +" 不存在。");
            return false;
        }

        if (isinit == true) {
            console.log(target)
            
        }

        return $.vmodel.storage[name];
    }

    /**
     * 主要模式
     * @param  mix       p_1 若是 string 倉儲命名；若是 function 代表準備在內部實體化的方法 
     * @param  function  p_2 (選用) 若 p_1 為 string，就必須使用 p_2
     * @return this      
     */
    $.fn.vmodel = function(p_1, p_2, p_3) {

        // 內部
        $.vmodel.local   = this;
        
        // 選擇器
        var selector = $.vmodel.local.selector;

        // 若第一個參數為倉儲命名
        if ($.type(p_1) == "string") {

            // 若第二個參數為布林值
            if ($.type(p_2) == "boolean") {
                var obj      = new p_3();
            }
            else {
                var obj      = new p_2();
            }

        }
        else {
            // 這是使用者定義的function, 我們將他實體化
            var obj      = new p_1();
        }

        // 擴充，外部不可使用這些關鍵字
        obj.selector = selector;
        obj.root     = $(selector);



        /**
         * 錯誤訊息
         * @param   method_name 提示錯誤的 function 名稱
         * @param   msg         錯誤訊息    
         */
        this.msg_error = function (method_name, msg){

            console.log("發生錯誤。『" + selector + "』呼叫的 function 『" + method_name + "』：" + msg);

        }

        /**
         * 批次呼叫可自動掛載的 function
         * @param   ary    需要觸發的 function 名稱
         */
        // this.each_autoload_fun = function (ary){

        //     $.each(ary, function(key, name) {

        //         if ($.type(obj[name]) != "function") {
        //             $.vmodel.local.msg_error(name, "不存在。");
        //         }

        //         obj[name]();
        //     });
        // }

        // 若有設定 autocall() 就會自動呼叫
        this.autocall = function (){
            

            if (obj.autoload) {

                var type = $.type(obj.autoload);

                if (type == "function") {
                    var ary = obj.autoload();
                }
                else if (type == "array") {
                    var ary = obj.autoload;
                }
                else {
                    $.vmodel.local.msg_error("autoload", "格式錯誤，型態只能是 function 或 array。")
                }

                // $.vmodel.local.each_autoload_fun(ary);
                $.vmodel.api.EEEEE(ary, obj, $.vmodel.local)
            }
            

        }

        this.main = function (){

            if ($.type(p_2) == "boolean" && p_2 === false) {

            }
            else {
                // 觸發自動讀取
                $.vmodel.local.autocall(obj)
            }
            

            return obj;
        }

        var result = this.main();

        // 放入倉儲
        if ($.type(p_1) == "string") {
            $.vmodel.storage[p_1] = result;
        }

        // 返回實體化的，可供外部調用
        return this;
    }


    

}( jQuery ));