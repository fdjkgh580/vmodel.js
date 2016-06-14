(function ($) {

    var version = "1.5.4";

    // 實體化的存放倉儲，提供內部呼叫。
    var storage = {}; 

    //整體使用
    $.vmodel = {};


    
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
         * @param   autoload_method_ary     需要觸發的 function 名稱陣列
         * @param   object                  也就是外部的實體化後的 $(selector).vmodel("匿名方法")
         */
        this.each_autoload = function (autoload_method_ary, obj){

            if (!autoload_method_ary) return false;

            $.each(autoload_method_ary, function(key, name) {

                if ($.type(obj[name]) != "function") {
                    local.msg_error(name, "不存在。");
                    return false;
                }

                // 觸發方法
                obj[name]();
            });

            return true;
        },

        /**
         * 若使用者有設定 autoload() 就會自動呼叫陣列中指定的方法
         * @param obj      也就是外部的實體化後的 $(selector).vmodel("匿名方法")
         * @param fnameary 須要自動讀取的方法陣列
         */
        this.is_trigger_autoload = function (obj, fnameary){

            try {
                if (!fnameary) {
                    throw "須要指定方法名稱陣列";
                }
                if ($.type(fnameary) != "array") {
                    throw 'is_trigger_autoload() 代入的方法名稱必須要是陣列';
                }
                var result = $.vmodel.api.each_autoload(fnameary, obj);
                return true;
            }
            catch(e) {
                console.log(e);
                return false;
            }
        }

        // 從物件中取得 autoload 的方法陣列
        this.get_autoload_funame = function (obj){
            var ary   = [];
            var atype = $.type(obj.autoload);

            try{
                // 取得 autoload 的陣列
                if (atype == "array") {
                    ary = obj.autoload;
                } 
                else if (atype == "function") {
                
                    // 若有回傳陣列才替換
                    res = obj.autoload();
                    if ($.type(res) == "array") {
                        ary = res;
                    }
                    else {
                        throw obj.vname + " 的 get_autoload_funame() 最終需要得到的型態應該是陣列。";
                    }
                }

                else {
                    throw obj.vname + " 的 autoload 須要是陣列或 function。";
                }

                return ary;
            }
            catch(e) {
                console.log(e);
                return false;
            }
        }
    }

    // 呼叫版本名稱
    $.vmodel.version = function (){
        return version;
    }

    
    /**
     * 當指定多組的倉儲模組化完成後，要觸發的方法
     *
     * 注意，這需要每個模組都使用監聽完成視覺化，也就是 $.vmodel.get() 第三個參數
     * 
     * @param   array | function     end_p1       監聽指定要完成的倉儲名稱陣列 | 回調方法
     * @param   function             end_p2       回調方法, 並夾帶已經完成的倉儲物件
     */
    $.vmodel.end = function (end_p1, end_p2){

        var local = this;

        var issuccess = true;

        /**
         * 組合成一個陣列回傳參數
         * @param   end_p1 
         * @param   end_p2 
         * @return  [要監聽的倉儲物件, callback()]
         */
        this.param_match = function(end_p1, end_p2) {
            var returnary = [];

            // 只有一個參數，就取得所有倉儲
            if ($.type(end_p1) == "function") {
                var storage = $.vmodel.get();
                returnary = [storage, end_p1];
            }
            // 兩個參數，代表有指定要取得的倉儲
            else {

                var obj = {};
                $.each(end_p1, function(key, name) {
                    obj[name] = $.vmodel.get(name);
                });
                returnary = [obj, end_p2];
            }

            return returnary;
        }

        //命名方便使用
        var pary     = local.param_match(end_p1, end_p2);
        var storage  = pary[0];
        var callback = pary[1];
        end_p1 = end_p2 = null;

        var id = setInterval(function (){

            var iscallback = true;

            // 檢查每個倉儲的視覺化狀態
            $.each(storage, function (storage_name, obj){

                var history = $.vmodel.history(obj.vname);

                // false 代表還沒有完成，那就檢查下一個倉儲，且不觸發 callback
                if (history == false) {
                    iscallback = false;
                    return true;
                }

                iscallback = true;
            });


            if (iscallback) {
                callback(storage);
                clearInterval(id);
            }


        }, 0);
        
    }


    /**
     * 取得視覺化屬性紀錄
     * @param   name         倉儲名稱
     * @return               有找到會返回視覺化的屬性物件；反之為 false
     */
    $.vmodel.history = function (name) {

        var returnval = false;

        // 找到綁在跟目錄的視覺化屬性
        var storage   = $.vmodel.get(name);
        var json      = storage.root.attr("data-vmodel-history");
        if (!json) return false;
        var obj       = $.parseJSON(json);

        // 搜尋
        $.each(obj, function (key, info){
            if (info.vname != name) return true;
            returnval = info;
            return false;
        });

        return returnval;
    }


    /**
     * 取得倉儲
     * @param   string            name    (選) 倉儲的存放名稱。當為空時，返回所有倉儲
     * @param   bool              p_2     (選) 預設 false, 是否觸發倉儲 autoload
     * @param   function | bool   p_3     (選) 是否啟用監聽並添加視覺化屬性。
     *                                         注意，這是非同步。
     *                                         function :   監聽直到完成模組後會觸發 callback，並夾帶了該倉儲。
     *                                         true :       true 僅啟用監聽。
     *                                         
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

        // 僅做對應參數的輔助
        this.param_match = function (name, p_2, p_3) {
            var returnary = [];
            var type_name = $.type(name);

            // 返回所有倉儲
            if (!name) {
                returnary = [name, null, null];
            }
            // 指定一個倉儲名稱
            else if (type_name == "string") {
                returnary = [name, p_2, p_3];
            }

            return returnary;
        }

        // 重新命名
        var pary     = local.param_match(name, p_2, p_3);
        var name     = pary[0];
        var autoload = pary[1];
        var listen   = pary[2];
        pary = p_2 = p_3 = null;


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

        // 若參數2指定 bool 且為 true 的時候，會前往判斷，是否要觸發剛取得模組的 autoload()，若有就會優先觸發
        if ($.type(autoload) == "boolean" && autoload == true) {

            // 觸發 autoload()
            var fnameary = $.vmodel.api.get_autoload_funame(target_obj);
            var result   = $.vmodel.api.is_trigger_autoload(target_obj, fnameary);
            // console.log(result); // for debugs

            // 若有啟用監聽或回調函數
            var type_listen = $.type(listen);
            if (type_listen == "function" || (type_listen == "boolean" && listen == true)) {

                // 若是回調
                if (type_listen == "function") {
                    // 必須先擴充到該模組底下，並勉多個倉儲會互相干擾
                    target_obj.vmodel_get_callback = function (){
                        listen(target_obj);
                    }
                }


                //監聽
                var iid = setInterval(function (){

                    // 若全部狀態都完成
                    if (local.chk_trigger_callback(target_obj) == true) {
                        clearInterval(iid);

                        // 視覺化添加屬性
                        local.display_attr(name, target_obj);

                        // 觸發回調
                        if (type_listen == "boolean") return true;
                        target_obj.vmodel_get_callback();
                    }

                }, 20);

                return true
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

    $.vmodel.create = function (param){
        
        // 內部
        var local   = this;

        // 選擇器
        var selector = param.selector;
        
        /**
         * 錯誤訊息
         * @param   method_name 提示錯誤的 function 名稱
         * @param   msg         錯誤訊息    
         */
        this.msg_error = function (method_name, msg){
            console.log("錯誤：『" + selector + "』呼叫的 function 『" + method_name + "』：" + msg);
        }


        // 初始化使用者指定的 autoload 每個方法的建構狀態
        this.define_autoload_struct = function (obj, autoload_func){
            // 為每一個方法，都設定為 false，代表該方法還沒有建構完成
            $.each(autoload_func, function(index, fun_name) {
                obj.fun_struct[fun_name] = false;
            });
        }

        // 外部擴充方法
        this.ext_expend = function (obj, name){
            var vname = (name != null) ? name : null;
            $.extend(obj, {

                vname : vname,

                // 根選擇器
                selector : selector,        

                // 根選擇器物件    
                root : $(selector),

                // 在倉儲中建立一個 fun_struct 物件
                // 用來存放每個 autoload 的方法名稱，
                // 並預設建構狀態為 false, 等到使用者手動為 true，
                // 才代表這個方法完成建構。
                fun_struct : {},

                /**
                 * 提供外部指定倉儲的模組化狀態。
                 * @param   name   autoload 指定的陣列倉儲名稱。可以是單一名稱會陣列。
                 *                 如 "say" 或 ['say', 'hello']
                 * @param   bool   (選) true:(預設)完成 | false : 未完成
                 */
                struct : function (name, status) {

                    if ($.type(status) != "boolean" && !status) {
                        status = true;
                    }


                    // 若使用字串
                    if ($.type(name) == "string") {
                        if ($.type(obj.fun_struct[name]) != "boolean") {
                            console.log('找不到名稱為 ' + name + '的建構狀態');
                            return false;
                        }

                        // 設定指定狀態
                        obj.fun_struct[name] = status;
                    }

                    // 若是陣列如 ['say', 'hello']
                    else if ($.type(name) == "array"){
                        $.each(name, function (key, val){
                            obj.fun_struct[val] = status;
                        })
                    }
                    else {
                        console.log('建構名稱須要指定');
                        return false;
                    }

                    return true;
                }
            });
            return obj;
        }

        // 放入倉儲
        this.put_storage = function (name, realobj){

            if (name != null) {

                // 檢查是否已存在
                if (!storage[name]) {
                    storage[name] = realobj;
                }
                else {
                    console.log("倉儲名稱『" + name + "』重複。");
                    return false;
                }
            }
        }

        this.main = function (param){

            try 
            {
                if (!param.selector) throw("須要指定選擇器");
                if (!param.model) throw("須要替模型命名");
                if (param.isinit === undefined) throw("須要指定是否啟用");
                if (!param.method) throw("須要指定方法");


                // 參數對應
                var name       = param.model;
                var isautoload = param.isinit;
                var realobj    = param.method;

                // 擴充，外部不可使用這些關鍵字
                var realobj    = local.ext_expend(realobj, name);
                
                // 取得 autoload 的方法陣列
                var fnameary = $.vmodel.api.get_autoload_funame(realobj);

                // 先定義建構狀態
                local.define_autoload_struct(realobj, fnameary);

                // 放入倉儲
                local.put_storage(name, realobj);

                // 最後才觸發 autoload 。
                // 這是因為當前的物件，才能被任何倉儲裡的方法取得。
                // 例如自己呼叫自己。
                if (isautoload === true) {
                    var result = $.vmodel.api.is_trigger_autoload(realobj, fnameary);
                    if (result === false) local.msg_error("is_trigger_autoload", "發生錯誤");
                }
                
                return this;
            }
            catch(err)
            {
                console.log(err);
                return false;
            }
        }

        // 返回實體化的，可供外部調用
        return local.main(param);
    }

    $.fn.vmodel = function (p_1, p_2, p_3, p_4){

        var local   = this;


        // 若前兩個字元是定位符號，就自動去除
        this.remove_sign = function (str){
            return (str.substring(0, 2) == "--") ? str.substring(2) : str;
        }

        /**
         * 組合成一個陣列回傳參數
         * @return  [選擇器, 倉儲名稱, 是否啟用 autoload, 實體化物件]
         */
        this.param_match = function (p_1, p_2, p_3, p_4){

            var selector = p_1;

            // 去除定位符號
            var model_name = local.remove_sign(p_2);

            var isautoload = p_3;

            var method    = new p_4();

            return [selector, model_name, isautoload, method];
        }

        this.main = function (p_1, p_2, p_3, p_4){
            
            // 參數對應
            var pary       = local.param_match(p_1, p_2, p_3, p_4);
            var selector   = pary[0];
            var model_name       = pary[1]; 
            var isautoload = pary[2]; 
            var method    = pary[3];

            p_1 = p_2 = p_3 = p_4 = null;


            $.vmodel.create({
                selector: selector,
                model: '--' + model_name,
                isinit: isautoload,
                method: method
            });


        }

        return local.main(p_1, p_2, p_3, p_4);        

    }


}( jQuery ));