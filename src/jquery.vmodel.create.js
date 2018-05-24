(function ($) {

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
        this.msg_error = function (msg){
            console.log("錯誤！" + param.model + ' ' + msg);
        }


        // 初始化使用者指定的 autoload 每個方法的建構狀態
        this.define_autoload_struct = function (obj, autoload_func){
            // 為每一個方法，都設定為 false，代表該方法還沒有建構完成
            $.each(autoload_func, function(index, fun_name) {
                obj.fun_struct[fun_name] = false;
            });
        }

        // 外部擴充方法
        this.ext_expend = function (obj, model_name){
            var vname = (model_name != null) ? model_name : null;
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
                 * @param   model_name   autoload 指定的陣列倉儲名稱。可以是單一名稱會陣列。
                 *                 如 "say" 或 ['say', 'hello']
                 * @param   bool   (選) true:(預設)完成 | false : 未完成
                 */
                struct : function (model_name, status) {

                    if ($.type(status) != "boolean" && !status) {
                        status = true;
                    }


                    // 若使用字串
                    if ($.type(model_name) == "string") {
                        if ($.type(obj.fun_struct[model_name]) != "boolean") {
                            local.msg_error('找不到名稱為 ' + model_name + '的建構狀態');
                            return false;
                        }

                        // 設定指定狀態
                        obj.fun_struct[model_name] = status;
                    }

                    // 若是陣列如 ['say', 'hello']
                    else if ($.type(model_name) == "array"){
                        $.each(model_name, function (key, val){
                            obj.fun_struct[val] = status;
                        })
                    }
                    else {
                        local.msg_error('建構名稱須要指定');
                        return false;
                    }

                    return true;
                }
            });
            return obj;
        }

        // 放入倉儲
        this.put_storage = function (model_name, realobj){

            if (model_name != null) {

                // 檢查是否已存在
                if (!$.vmodel._storage[model_name]) {
                    $.vmodel._storage[model_name] = realobj;
                }
                else {
                    local.msg_error("倉儲名稱已被使用。");
                    return false;
                }
            }

            return true;
        }

        this.main = function (param){

            // 判斷 jQ 版本是否允許
            if (!$.vmodel.api.isallow_jqver(false)) throw ($.vmodel.api.isallow_jqver(true));

            // 確認必填參數
            $.vmodel.api.check_input_param({
                selector : param.selector, 
                model_name : param.model, 
                isautoload : param.isautoload, 
                method : param.method
            });

            // 參數對應
            var pary       = $.vmodel.api.vmodel_param_match(param.selector, param.model, param.isautoload, param.method);
            var selector   = pary[0];
            var model_name = pary[1]; 
            var isautoload = pary[2]; 
            var realobj    = pary[3];

            // 擴充，外部不可使用這些關鍵字
            var realobj    = local.ext_expend(realobj, model_name);
            
            // 取得 autoload 的方法陣列
            var result = $.vmodel.api.get_autoload_funame(realobj);
            if (result.status === false) {
                local.msg_error(result.message);
                return false;
            }

            var fnameary = result.data;

            // 先定義建構狀態
            local.define_autoload_struct(realobj, fnameary);

            // 放入倉儲
            var result = local.put_storage(model_name, realobj);
            if (result === false) return false;

            // 最後才觸發 autoload 。
            // 這是因為當前的物件，才能被任何倉儲裡的方法取得。
            // 例如自己呼叫自己。
            if (isautoload === true) {

                var result = $.vmodel.api.is_trigger_autoload(realobj, fnameary);

                if (result.status === false) {
                    local.msg_error(result.message);
                    return false;
                }
            }
            
            return this;
        }

        // 返回實體化的，可供外部調用
        return local.main(param);
    }
    

}( jQuery ));