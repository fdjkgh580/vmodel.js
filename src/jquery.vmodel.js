// v1.5
(function ($) {

    //整體使用
    $.vmodel = {};

    //內部全域的物件。也就是控制外部的  $(selector).vmodel(的匿名含式/物件)
    var local = null;

    // 實體化的存放倉儲，提供內部呼叫。
    var storage = {}; 

    
    // 內部全域的輔助方法
    $.vmodel.api = new function (){

        // 物件排序
        this.obj_sort = function (obj){
            var temp = [];
            var i = 0;
            
            $.each(obj, function(key, val) {
                temp[i++] = key;
            });
            
            temp.sort();

            var data = {};
            $.each(temp, function (key, val){
                data[val] = obj[val]
            });

            return data;
        }

        /**
         * 批次呼叫可自動掛載的 function
         * @param   autoload_method_ary     需要觸發的 function 名稱
         * @param   object                  也就是外部的實體化後的 $(selector).vmodel("匿名方法")
         */
        this.each_autoload = function (autoload_method_ary, obj){


            $.each(autoload_method_ary, function(key, name) {

                if ($.type(obj[name]) != "function") {
                    local.msg_error(name, "不存在。");
                }

                // 觸發方法
                obj[name]();
            });

        },

        /**
         * 若使用者有設定 autoload() 就會自動呼叫
         * @param object 也就是外部的實體化後的 $(selector).vmodel("匿名方法")
         */
        this.is_trigger_autocall = function (obj){
            if (obj.autoload) {

                var type = $.type(obj.autoload);

                if (type == "function") {
                    var result = obj.autoload();

                    // 如果 function 沒有回傳陣列，就不繼續
                    // 這情形會發生在已經由 autoload() 寫好要觸發的程序，所以不需要回傳陣列
                    if ($.type(result) == "array") {
                        ary = result;
                    }
                    else {
                        return false;
                    }
                }
                else if (type == "array") {
                    var ary = obj.autoload;
                }
                else {
                    local.msg_error("autoload", "格式錯誤，型態只能是 function 或 array。")
                }

                $.vmodel.api.each_autoload(ary, obj);
            }
        }

    }

    /**
     * 取得視覺化屬性紀錄
     * 
     */
    /**
     * [history description]
     * @param   name         倉儲命名
     * @return {[type]}      [description]
     */
    $.vmodel.history = function (name) {

        var storage = $.vmodel.get(name);
        var json = storage.root.attr("data-vmodel-history");
        var obj = $.parseJSON(json);
        var returnval = false;

        $.each(obj, function (key, info){
            if (info.vname != name) return true;
            returnval = info;
            return false;
        })
        return returnval;
    }



    /**
     * 取得倉儲
     * @param   string name    (選) 倉儲的存放名稱。當為空時，返回所有倉儲
     * @param   bool   p_2     (選) 預設 false
     * @param   bool   p_3     (選) callback 回調方法，並夾帶了該倉儲
     * @return  object
     */
    $.vmodel.get = function (name, p_2, p_3){

        var local = this;

        // 判斷是否可以觸發回調 callback，
        // 條件式當所有狀態都是 true
        this.chk_trigger_callback = function (obj){

            var allow = true;

            $.each(obj.fun_struct, function(index, bool) {

                // 如果遇到沒有初始化的，就終止檢查
                if (bool == false) {
                    allow = false;
                    return false;
                }

            });

            // 如果不允許就離開
            // 若 autoload 中的方法都已經建構完成，那就可以呼叫回調 
            return (allow == false) ? false : true;
        }


        // 視覺化屬性
        this.display_attr = function (name, target_obj){

            var d = new Date();

            // 建立一個物件
            var data = [{
                vname: name, // 倉儲名稱
                status: true, // 完成
                timestamp : Date.parse(d) + "." + d.getMilliseconds(), //時間戳記
            }];


            // 視覺狀態是否存在, 若存在代表已經有倉儲也是綁定在這個元素，而且已完成。
            // 這時候就合併已存在的，與新的。
            var attr = target_obj.root.attr("data-vmodel-history");
            if (attr) {
                var dej = $.parseJSON(attr);
                dej.push(data[0]); // 務必使用 data[0] 剝除外面的陣列。
                data = dej;
            }


            //視覺狀態
            var encode = JSON.stringify(data);
            target_obj.root.attr("data-vmodel-history", encode); 
        }

        // 返回所有倉儲
        if (!name) {
            return $.vmodel.api.obj_sort(storage);
        }

        var target_obj = storage[name];
        
        // 呼叫的倉儲並不存在
        if (!target_obj) {
            console.log("呼叫的倉儲名稱 "+ name +" 不存在。");
            return false;
        }

        // 若參數2指定 bool
        if ($.type(p_2) == "boolean") {

            // 當使用 true 的時候，會前往判斷，是否要觸發剛取得模組的 autoload()，若有就會優先觸發
            if (p_2 == true) {

                $.vmodel.api.is_trigger_autocall(target_obj);

                // 若有設定回調函數
                if ($.type(p_3) == "function") {

                    // 必須先擴充到該模組底下，並勉多個倉儲會互相干擾
                    target_obj.vmodel_get_callback = function (){
                        p_3(target_obj);
                    }


                    //監聽
                    var iid = setInterval(function (){

                        // 若全部狀態都完成
                        if (local.chk_trigger_callback(target_obj) == true) {
                            clearInterval(iid);

                            // 視覺化添加屬性
                            local.display_attr(name, target_obj);

                            // 觸發
                            target_obj.vmodel_get_callback();
                        }

                    }, 20);

                    // console.log(storage[name]);
                    return true
                }
            }
        }

        // 無論是否觸發使用者的 autoload(), 最後都會返回該實體化的物件
        return storage[name];
    }

    /**
     * 刪除指定的倉儲
     * @param   name (選)倉儲名稱, 不指定會清空所有倉儲
     */
    $.vmodel.delete = function (name){
        
        if (!name && name != '') {
            storage = {};
        } else {
            if (storage[name]) {
                delete storage[name];
            }
        }
        
        return this;
    }

    /**
     * 主要模式
     * @param  mix       p_1 若是 string 倉儲命名；若是 function 代表準備在內部實體化的方法 
     * @param  function  p_2 (選用) 若 p_1 為 string，就必須使用 p_2
     * @return this      
     */
    $.fn.vmodel = function(p_1, p_2, p_3) {

        // 內部
        local   = this;
        
        // 選擇器
        var selector = local.selector;

        // 若前兩個字元是定位符號，就自動去除
        this.remove_sign = function (str){
            return (str.substring(0, 2) == "--") ? str.substring(2) : str;
        }

        /**
         * 錯誤訊息
         * @param   method_name 提示錯誤的 function 名稱
         * @param   msg         錯誤訊息    
         */
        this.msg_error = function (method_name, msg){

            console.log("發生錯誤。『" + selector + "』呼叫的 function 『" + method_name + "』：" + msg);

        }

        // 初始化使用者指定的 autoload 每個方法的建構狀態
        this.def_fun_struct = function (){

            var ary   = [];
            var atype = $.type(obj.autoload);

            // 取得 autoload 的陣列
            if (atype == "array") {

                ary = obj.autoload;
            
            } else if (atype == "function") {
            
                // 若有回傳陣列才替換
                res = obj.autoload();
                if ($.type(res) == "array") ary = res;
            
            }

            // 為每一個方法，都設定為 false，代表該方法還沒有建構完成
            $.each(ary, function(index, fun_name) {
                obj.fun_struct[fun_name] = false;
            });
        }


        this.main = function (){

            //先初始化建構狀態
            local.def_fun_struct();

            // 觸發自動讀取
            if (p_2 === true) {
                $.vmodel.api.is_trigger_autocall(obj);
            }

            return obj;
        }

        

        // 若第一個參數為倉儲命名
        var vp_1 = $.type(p_1);
        if (vp_1 == "string") {

            // 去除定位符號
            p_1 = local.remove_sign(p_1);

            // 若第二個參數為布林值
            if ($.type(p_2) == "boolean") {

                var obj      = new p_3();
            
            }

            // 若不是布林值，代表就是應該是要匿名方法, 我們將他實體化
            else {
            
                var obj      = new p_2();
            
            }

        }
        else {

            // 這是使用者定義的function, 我們將他實體化
            var obj      = new p_1();

        }


        // 擴充，外部不可使用這些關鍵字
        var vname = (vp_1 == "string") ? p_1 : null;
        $.extend(obj, {

            vname : vname,

            // 根選擇器
            selector : selector,        

            // 根選擇器物件    
            root : $(this),

            // 在倉儲中建立一個 fun_struct 物件
            // 用來存放每個 autoload 的方法名稱，
            // 並預設建構狀態為 false, 等到使用者手動為 true，
            // 才代表這個方法完成建構。
            fun_struct : {},

            /**
             * 提供外部指定倉儲的模組化狀態。
             * @param   name   (選) autoload 指定的陣列倉儲名稱。可以是單一名稱會陣列。
             *                      如 "say" 或 ['say', 'hello']
             * @param   bool   (選) true:(預設)完成 | false : 未完成
             */
            struct : function (name, bool) {

                if ($.type(bool) != "boolean" && !bool) {
                    bool = true;
                }


                // 若使用字串
                if ($.type(name) == "string") {
                    if ($.type(obj.fun_struct[name]) != "boolean") {
                        console.log('找不到名稱為 ' + name + '的建構狀態');
                        return false;
                    }

                    // 設定指定狀態
                    obj.fun_struct[name] = bool;
                }

                // 若是陣列如 ['say', 'hello']
                else if ($.type(name) == "array"){
                    $.each(name, function (key, val){
                        obj.fun_struct[val] = bool;
                    })
                }
                else {
                    console.log('建構名稱須要指定');
                    return false;
                }

                return true;
            }
        });

        var result = this.main();

        // 放入倉儲
        if ($.type(p_1) == "string") {

            // 檢查是否已存在
            if (!storage[p_1]) {
                storage[p_1] = result;
            }
            else {
                console.log("倉儲名稱『" + p_1 + "』重複。");
                return false;
            }
        }

        // 返回實體化的，可供外部調用
        return this;
    }


}( jQuery ));