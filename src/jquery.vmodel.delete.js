(function ($) {

    /**
     * 刪除指定的倉儲
     * @param   model_name (選)倉儲名稱, 不指定會清空所有倉儲
     */
    $.vmodel.delete = function (model_name){
        
        if (!model_name && model_name != '') {
            $.vmodel._storage = {};
        } else {
            if ($.vmodel._storage[model_name]) {
                delete $.vmodel._storage[model_name];
            }
        }
        
        return this;
    }

}( jQuery ));