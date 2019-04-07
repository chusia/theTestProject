(function (factory) {
    if (typeof define === "function" && define.amd) {
 
        // AMD. Register as an anonymous module.
        define(["../widgets/datepicker"], factory);
    } else {
 
        // Browser globals
        factory(jQuery.datepicker);
    }
 
}(function (datepicker) {
    var old_generateMonthYearHeader = $.datepicker._generateMonthYearHeader;
    var old_get = $.datepicker._get;
	var old_CloseFn = $.datepicker._updateDatepicker;

	$.extend($.datepicker, {
		_generateMonthYearHeader: function (inst, drawMonth, drawYear, minDate, maxDate, secondary, monthNames, monthNamesShort) {
            var htmlYearMonth = old_generateMonthYearHeader.apply(this, [inst, drawMonth, drawYear, minDate, maxDate, secondary, monthNames, monthNamesShort]);
            if ($(htmlYearMonth).find(".ui-datepicker-year").length > 0) {
                htmlYearMonth = $(htmlYearMonth).find(".ui-datepicker-year").find("option").each(function (i, e) {
                    if (Number(e.value) - 1911 > 0) $(e).text((Number(e.innerText) - 1911) + "年");
                }).end().end().get(0).outerHTML;
            }
            return htmlYearMonth;
        },
	    formatDate: function (format, date, settings) {
	        var d = date.getDate();
				var m = date.getMonth()+1;
				var y = date.getFullYear();			
				var fm = function(v){			
				    return (v<10 ? '0' : '')+v;
				};			
				return (y-1911) +''+ fm(m) +''+ fm(d);
	    },
	    parseDate: function (format, value, settings) {
	        var v = new String(value);
	        var Y,M,D;
	        if(v.length==7){
	            Y = v.substring(0,3)-0+1911;
	            M = v.substring(3,5)-0-1;
	            D = v.substring(5,7)-0;
	            return (new Date(Y,M,D));
	        }else if(v.length==6){
	            Y = v.substring(0,2)-0+1911;
	            M = v.substring(2,4)-0-1;
	            D = v.substring(4,6)-0;
	            return (new Date(Y,M,D));
	        }
	        return (new Date());
	    },
	    formatYear:function(v){
	    	return '民國'+(v-1911)+'年';
			}
	});	

    datepicker.regional["zh-TW"] = {
        closeText: "關閉",
        prevText: "<上個月",
        nextText: "下個月>",
        currentText: "今天",
        monthNames: ["一月", "二月", "三月", "四月", "五月", "六月",
        "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月",
        "七月", "八月", "九月", "十月", "十一月", "十二月"],
        dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        dayNamesShort: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
        dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
        weekHeader: "週",
        dateFormat: "yymmdd",
        firstDay: 1,
        isRTL: false,
        changeYear: true,
		changeMonth: true,
		yearRange: "-100:+20",
        showMonthAfterYear: true,
        onSelect: function (dateText, inst) {
            var dateFormate = inst.settings.dateFormat == null ? "yymmdd" : inst.settings.dateFormat; //取出格式文字
            var reM = /m+/g;
            var reD = /d+/g;
            var objDate = {
                y: inst.selectedYear - 1911 < 0 ? inst.selectedYear : padLeft((inst.selectedYear - 1911).toString(),3,"0"),
                m: padLeft(String(inst.selectedMonth + 1),2,"0"),
                d: padLeft(String(inst.selectedDay),2,"0")
            };
            $.each(objDate, function (k, v) {
                var re = new RegExp(k + "+");
                dateFormate = dateFormate.replace(re, v);
            });
            inst.input.val(dateFormate);
        }
    };
    datepicker.setDefaults(datepicker.regional["zh-TW"]);
 
    return datepicker.regional["zh-TW"];
 
}));
 
function padLeft(str, length, sign) {
    if (str.length >= length) return str;
    else return padLeft(sign + str, length, sign);
}


