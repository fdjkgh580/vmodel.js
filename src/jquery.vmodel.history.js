(function ($) {

    /**
     * 取得視覺化屬性紀錄
     * @param   model_name         倉儲名稱
     * @return               有找到會返回視覺化的屬性物件；反之為 false
     */
    $.vmodel.history = function (model_name) {

        var returnval = false;

        // 找到綁在跟目錄的視覺化屬性
        var storage   = $.vmodel.get(model_name);
        var json      = storage.root.attr("data-vmodel-history");
        if (!json) return false;
        var obj       = $.parseJSON(json);

        // 搜尋
        $.each(obj, function (key, info){
            if (info.vname != model_name) return true;
            returnval = info;
            return false;
        });

        return returnval;
    }

}( jQuery ));