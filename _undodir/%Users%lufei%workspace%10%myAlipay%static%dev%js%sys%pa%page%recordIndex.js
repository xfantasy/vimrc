Vim�UnDo� MG����FT���S�ƀ+Y��k���e]�                                     N���    _�                              ����                                                                                                                                                                                                                                                                                                                                                 V        N���    �             �                  /**�                * Alipay.com Inc.   / * Copyright (c) 2005-2009 All Rights Reserved.    * 消费记录一期    * @name AP.product.record    * @namespace	    * @author		jiangbo.xi      * @version		0.2   & * @example		/consume/record/index.htm   � *				/consume/record/historyIndex.htm	消费记录历史页面只是index.htm的子集，没有应用到record对象的全部功能   ) * @param cfg.dom 一些dom元素的id值    */   !AP.widget.Record = new AP.Class({        initialize: function (cfg) {            for (var i in cfg.dom) {   (            this[i] = D.get(cfg.dom[i]);   	        }       },           /**   B     * @description	交易评价、加好友等链接的xbox窗口        * @param url {string}        * @return		void        */       initXBox: function (url) {           new AP.widget.xBox({   $            el: D.query(".js-xbox"),               type: "iframe",   "            value: function (el) {                   return el.href;               },               modal: true,               hasHead: false,               fixed: false,   !            autoFitPosition: true           });       },           /**   A     * @description 关键字输入框内的淡灰色提示文字        */   "    initKeywordTips: function () {           var that = this;       U        //样式控制：提示文字显示为灰色，关键字显示为正常颜色   3        E.on(that.keyword, "keyup", function (ev) {       ?            if (this.value == this.getAttribute("data-tips")) {   ,                D.addClass(this, "ft-gray");   g                that.keywordType.options[this.getAttribute("rel-option")].setAttribute("old-data", "");               } else {   /                D.removeClass(this, "ft-gray");               }           });               /**   )         * 在元素失去焦点时检测   @         * 如果当前值==提示文字，那么显示为灰色   Y         * 如果当前值为空，那么修改值为提示文字内容，显示为灰色             * 否则显示为黑色   E         * @description oldValue:用于保存用户当前的输入值            */   2        E.on(that.keyword, "blur", function (ev) {               var oldValue;       ?            if (this.value == this.getAttribute("data-tips")) {   ,                D.addClass(this, "ft-gray");   *            } else if (this.value == "") {   &                oldValue = this.value;   B                this.value = this.getAttribute("data-tips") || "";   ,                D.addClass(this, "ft-gray");               } else {   &                oldValue = this.value;   /                D.removeClass(this, "ft-gray");               }                   /**   F             * 时检测是否与option建立了关联（rel-option）   �             * 如果有，那么将oldValue保存到对应的option里，在下次切换回这个option时将值写回关键字输入框                */   #            if (that.keywordType) {   {                if (this.getAttribute("rel-option") && typeof oldValue != "undefined" && this.getAttribute("rel-option")) {   q                    that.keywordType.options[this.getAttribute("rel-option")].setAttribute("old-data", oldValue);                   }               }           });       '        //focus时去掉data-tips内容   3        E.on(that.keyword, "focus", function (ev) {   ?            if (this.value == this.getAttribute("data-tips")) {                    this.value = "";               }           });       },           /**   D     * 选择不同的option时，在keyword里显示不同的提示   �     * option的old-data还存有切换options时keyword里的数据，这些数据在重新切回option时将回填入keyword内        */   %    initSelectDataTips: function () {           var that = this;       b        //绑定change事件，当改变关键字类型时对应的改变keyword里的提示内容   8        E.on(that.keywordType, "change", function (ev) {   )            var target = E.getTarget(ev);   C            var selectedOpt = target.options[target.selectedIndex];   A            var dataTips = selectedOpt.getAttribute("data-tips");       7            if (selectedOpt.getAttribute("old-data")) {   Y                //如果之前有值，将值回填 ( keyword.blur事件中的oldValue )    J                that.keyword.value = selectedOpt.getAttribute("old-data");   &                that.keyword.select();   7                D.removeClass(that.keyword, "ft-gray");               } else {   C                //将option里的data-tips的值写入keyword控件   A                that.keyword.setAttribute("data-tips", dataTips);   .                that.keyword.value = dataTips;   4                D.addClass(that.keyword, "ft-gray");               }       *            //将option与keyword相关联   J            that.keyword.setAttribute("rel-option", target.selectedIndex);           });       },           /**   k     * @description 分页功能，点击对应的标签时把rel-value里的值写入queryForm，并提交        */       initToPage: function () {           var that = this;       >        E.on(D.query(".form-element"), "click", function (e) {   $            var el = E.getTarget(e);   -            var key = el.getAttribute("rel");   <            var value = el.getAttribute("rel-value").trim();       .            that.queryForm[key].value = value;                    formFreeFlag = true;               submitQueryForm();                    E.preventDefault(e);           });       },           /**   /     * @description 切换表格的tab选项卡        * @param        */       initTabCard: function () {           var that = this;       F        var tabCard = D.query("#J-table-consume .pane-title ul li a");   .        E.on(tabCard, "click", function (ev) {   !            E.preventDefault(ev);       3            that.queryForm.currentPageNo.value = 1;   H            that.queryForm.currentTab.value = this.getAttribute("data");                    formFreeFlag = true;               submitQueryForm();           });       },           /** 初始化日历   L     * @param maxDate {Date, 由服务器端抛出的今天的日期,可选}        */   &    initCalendar: function (maxDate) {   &        var getMaxDate = function () {               var month = [];   +            for (var i = 1; i <= 12; i++) {                   month.push(i);               }   0            if (typeof maxDate == "undefined") {   %                var now = new Date();               } else {   ,                var now = new Date(maxDate);               }   Y            return month[now.getMonth()] + '/' + now.getDate() + '/' + now.getFullYear();   	        }                   /**    �         * @description 特殊的：matchDate对象会匹配页面中的元素，当日历中选择的日期跟matchDate中的日期匹配时，页面上对应的元素会高亮(class="selected")   ;         * @param matchDate {today(今天):string, date: [    U         *		{日期范围:number, 日期格式(y:年|m:月|d:日):string, id:string},            *		...   ]}            */   P        var calendar = new AP.widget.calendar('calendar', 'calendarContainer', {   "            maxdate: getMaxDate(),   "            show_dropfilter: true,               dropfilter: {   "                startYear: '2004',   L                endYear: new Date(D.get("J-date-today").value).getFullYear()               },               matchDate: {   3                today: D.get("J-date-today").value,                   date: [   (                    [1, 'd', "J-today"],   ,                    [7, 'd', "J-seven-day"],   +                    [30, 'd', "J-a-month"],   .                    [90, 'd', "J-three-month"]                   ]               }   !        }, [D.query('.i-date')]);       },           /**   2     * @description 初始化交易场所选择框   C     * @param l: {string} 被点击的元素的id，相当于select   A     * @param c: {string} 弹出框的id，相当于options列表   /     * @param adjust: {number,number} 偏移量        */   /    initBizTypeCombo: function (l, c, adjust) {           var that = this;               if (l) {   !            l.hideFocus = 'true';   /            E.on(c, "mouseover", function (e) {   4                AP.cache._bizType_mouseout_ = false;               });       2            //移出鼠标200毫秒后隐藏菜单   .            E.on(c, "mouseout", function (e) {   3                AP.cache._bizType_mouseout_ = true;   (                setTimeout(function () {   6                    if (AP.cache._bizType_mouseout_) {   1                        D.addClass(c, "fn-hide");   3                        D.setXY(c, [-9999, -9999]);                       }                   }, 200);               });                   //展开菜单   /            E.on(l, "click", function (ev, c) {   %                E.preventDefault(ev);   <                D.addClass("js-status-pop-menu", "fn-hide");   :                D.addClass("js-date-pop-menu", "fn-hide");   ,                D.removeClass(c, "fn-hide");                   D.setXY(c, [   [                D.getX(E.getTarget(ev)) + adjust[0], D.getY(E.getTarget(ev)) + adjust[1]]);               }, c);       )            //返回值到hidden组件中   C            E.on(D.query("dl a", c), "click", function (ev, argu) {                    var l = argu[0],                        c = argu[1];       %                E.preventDefault(ev);       &                that.setBizType(this);               }, [l, c]);       %            D.addClass(c, "fn-hide");   '            D.setXY(c, [-9999, -9999]);   	        }       },           /**   G     * @description 选择不同交易场所时的显示不同的选项   D     * @param aLink	{dom el}　被点击的a标签，相当于select        */   "    setBizType: function (aLink) {           //设置表单数据   3        var l = D.get("J-select-record-type-link"),   4            c = D.get("js-select-record-type-menu"),   8            bizType = D.get(l.getAttribute("data-rel"));       d        //保存以前的值，当两个值一样时，不用执行更换右边高级筛选项功能   9        bizType.setAttribute("old-value", bizType.value);   3        bizType.value = aLink.getAttribute("data");                //选中对应的a标签   6        D.removeClass(D.query("dl a", c), "selected");   &        D.addClass(aLink, "selected");       4        //更改交易场所select内显示的文字   &        l.innerHTML = aLink.innerHTML;   I        D.query(".pop-select-title a", c)[0].innerHTML = aLink.innerHTML;       ^        //设置“资金流向”和“交易类型”、“关键字”等表单过滤条件   .        this.setAdvancedOption(bizType.value);               //收起菜单   !        D.addClass(c, "fn-hide");       },           /**   k     * @description 设置“关键字”和“资金流向”、“交易类型”的状态，联动菜单   y     * @param bizType {string} 对应的消费场所类型，在bizTypeList对象里总能找到与之对应的json对象        */   +    setAdvancedOption: function (bizType) {       a        //如果当前选项和之前的选项都是用normal类型，那么就不用更换列表   R        //var oldType = D.get("J-record-type").getAttribute("old-value") || 99999;   #        //if (oldType == bizType) {           //    return false;           //}       9        var keywordType = D.get("J-keyword-type-select"),   !            keywordTypeHTML = [],   %            sub; //存储子对象用   B        if (typeof bizTypeList['type' + bizType] == 'undefined') {               //normal   %            sub = bizTypeList.normal;           } else {   0            sub = bizTypeList['type' + bizType];   	        }               //生成select选项           var selectedStatus;   7        for (var i = 0; i <= sub.key.length - 1; i++) {                selectedStatus = "";                   //容错   <            if (typeof sub.key[i].dataTips == "undefined") {   )                sub.key[i].dataTips = "";               }   <            if (typeof sub.key[i].selected == "undefined") {   *                sub.key[i].selected = "0";               }       *            //生成关键字 && data-tips   -            if (sub.key[i].selected == '1') {   L                this.keyword.setAttribute("data-tips", sub.key[i].dataTips);   ;                this.keyword.setAttribute("rel-option", i);   9                this.keyword.value = sub.key[i].dataTips;   (				D.addClass(this.keyword, "ft-gray");       .                selectedStatus = ' selected ';               }       �            keywordTypeHTML.push('<option value="' + sub.key[i].value + '" ' + selectedStatus + ' data-tips="' + sub.key[i].dataTips + '" >' + sub.key[i].label + '</option>');   	        }   �        keywordType.innerHTML = '<select name="keyword-type" id="' + this.keywordType.id + '">' + keywordTypeHTML.join("") + '</select>';       "        //生成右边过滤条件           var domStr = [];   7        for (var i = 0; i <= sub.opt.length - 1; i++) {   N            if (sub.opt[i].type == 'checkbox' || sub.opt[i].type == 'radio') {   �                domStr.push('<div class="fm-item fm-selectbox"><label class="fm-label label-description">' + sub.opt[i].label + '：</label>');   G                for (var j = 0; j <= sub.opt[i].list.length - 1; j++) {  x                    domStr.push('<input class="form-d-element" type="' + sub.opt[i].type + '" name="' + sub.opt[i].name + '" ' + (sub.opt[i].list[j].checked == 1 ? ' checked ' : '') + ' value="' + sub.opt[i].list[j].value + '" id="' + sub.opt[i].list[j].id + '" /> <label for="' + sub.opt[i].list[j].id + '"" class="fm-label-clasp" >' + sub.opt[i].list[j].label + '</label>');                   }   &                domStr.push('</div>');               }   	        }   @        D.get("J-filter-condition").innerHTML = domStr.join("");       \        //因为select重新生成了，所以将this.keywordType里的dom对象也要更新   6        this.keywordType = D.get(this.keywordType.id);       ]        //重新绑定select上的onchange事件——用于在关键字控件上显示提示   "        this.initSelectDataTips();       },               +    //切换“高级筛选/简单筛选”   !    switchFilter: function (ev) {   %        var target = E.getTarget(ev);   '        var filter = D.get("J-filter");       $        if (filter.value * 1 == 1) {               filter.value = 2;   4            target.innerHTML = "恢复简单筛选";       =            D.removeClass("J-keyword-type-outer", "fn-hide");   ;            D.removeClass("J-filter-condition", "fn-hide");           } else {               filter.value = 1;   .            target.innerHTML = "高级筛选";       :            D.addClass("J-keyword-type-outer", "fn-hide");   8            D.addClass("J-filter-condition", "fn-hide");   	        }               E.preventDefault(ev);           },           /**   r     * @description 初始化topSearchFrom，将根据queryForm里的值重写bizTypeList里对应的json子对象        */   !    initFormStatus: function () {   		var that = this;       (        //高亮能够匹配的时间段   7		//如果J-end的时间段等于今天，那么就....   `		if (D.get("J-date-today").value.replace(/\//g,"") == D.get("J-end").value.replace(/\./g,"")) {       H			var startTime = new Date(D.get("J-start").value.replace(/\./g, "/"));   D			var endTime = new Date(D.get("J-end").value.replace(/\./g, "/"));       4			var differDay = (endTime - startTime) / 86400000;   			var matchDate = "";       			if (differDay == 0) {   				matchDate = "J-today";   			} else if (differDay == 6) {   				matchDate = "J-seven-day";    			} else if (differDay == 29) {   				matchDate = "J-a-month";    			} else if (differDay == 89) {    				matchDate = "J-three-month";   			}   			   %			D.addClass(matchDate, "selected");   		}                    var keywordAndType = [];   <        var queryFormKeyword = that.queryForm.keyword.value;   >        var keywordSplitIndex = queryFormKeyword.indexOf("_");       M        keywordAndType[0] = queryFormKeyword.substring(0, keywordSplitIndex);   &        if (keywordSplitIndex != -1) {   k            keywordAndType[1] = queryFormKeyword.substring(keywordSplitIndex + 1, queryFormKeyword.length);   	        }   		   		           /*    W		 * @description 根据queryForm的初始条件，生成表单中的高级筛选条件   T		 * 1. 用subBizTypeList保存原来的值，然后修改bizTypeList中对应的值   1		 * 2. 用bizTypeList的值生成页面dom元素   c		 * 3. 用subBizTypeList里的值重新回填到bizTypeList里，以让表单的重置功能生效   		 */   		(function(){   			var tmpBizTypeList = {};           (			var cloneJSON = function(jsonObj) {     				var buf;     %				if (jsonObj instanceof Array) {     					buf = [];     					var i = jsonObj.length;     					while (i--) {     '						buf[i] = cloneJSON(jsonObj[i]);     					}     					return buf;     +				}else if (jsonObj instanceof Object){     					buf = {};     					for (var k in jsonObj) {     '						buf[k] = cloneJSON(jsonObj[k]);     					}     					return buf;     				}else{     					return jsonObj;     				}    			}        -			//#1.1 暂存对应的bizTypeList的结果   `            if (typeof bizTypeList['type' + that.queryForm.consumePlace.value] == "undefined") {   :				tmpBizTypeList.normal = cloneJSON(bizTypeList.normal);   			} else {   �				tmpBizTypeList["type" + that.queryForm.consumePlace.value] = cloneJSON(bizTypeList["type" + that.queryForm.consumePlace.value]);   			}   		   !			//#1.2 修改bizTypeList的值   !            var keyList, optList;   4            var selectIndex = keywordAndType[0] - 1;   `            if (typeof bizTypeList['type' + that.queryForm.consumePlace.value] == "undefined") {   1                keyList = bizTypeList.normal.key;   1                optList = bizTypeList.normal.opt;               } else {   V                keyList = bizTypeList["type" + that.queryForm.consumePlace.value].key;   V                optList = bizTypeList["type" + that.queryForm.consumePlace.value].opt;               }       F            for (var i = 0, len = keyList.length - 1; i <= len; i++) {   '                if (selectIndex == i) {   .                    keyList[i].selected = "1";                   } else {   .                    keyList[i].selected = "0";                   }               }       4            //#1.3 修改右边的高级筛选条件   F            for (var i = 0, len = optList.length - 1; i <= len; i++) {   P                var optValue = that.queryForm[optList[i].name].value.split("_");   +                if (optValue.length == 0) {                       break;                   }       f                for (var j = 0, subOptListLen = optList[i].list.length - 1; j <= subOptListLen; j++) {   K                    if (optValue.indexOf(optList[i].list[j].value) != -1) {   7                        optList[i].list[j].checked = 1;                       } else {   7                        optList[i].list[j].checked = 0;                       }                   }               }           +			//#2. 根据json值生成高级筛选项   F			that.setBizType(D.get("type" + that.queryForm.consumePlace.value));   			       #			//#3. 回填tmpBizTypeList的值   `            if (typeof bizTypeList['type' + that.queryForm.consumePlace.value] == "undefined") {   /				bizTypeList.normal = tmpBizTypeList.normal;   			} else {   y				bizTypeList["type" + that.queryForm.consumePlace.value] = tmpBizTypeList["type" + that.queryForm.consumePlace.value];   			}               })();                   //回填关键字   H        if (keywordAndType[1] != "" && keywordAndType[1] != undefined) {               //回填关键字   3            this.keyword.value = keywordAndType[1];   h            this.keywordType.options[keywordAndType[0] - 1].setAttribute("old-data", keywordAndType[1]);           } else {       >            //如果有data－tips，也要显示再keyword内   n            var dataTips = this.keywordType.options[this.keywordType.selectedIndex].getAttribute("data-tips");   -            if (dataTips && dataTips != "") {   .                this.keyword.value = dataTips;   4                D.addClass(this.keyword, "ft-gray");               }       	        }               },           /**   ,     * @description 切换统计金额显示   W     *				首次请求从服务器得到数据，第二次时直接切换显示就ok了        */   !    showStatInfo: function (ev) {   $        var aLink = E.getTarget(ev);   		aLink.style.cursor = "wait";       %        //切换统计金额的显示   &        var switchShow = function () {   >            if (aLink.getAttribute("data-show-status") == 0) {   :                aLink.setAttribute("data-show-status", 1);       8                D.removeClass("J-stat-info", "fn-hide");   =				D.removeClass(D.query(".stat-info-cash-out"), "fn-hide");   <				D.removeClass(D.query(".stat-info-cash-in"), "fn-hide");       =                D.addClass(aLink, "show-stat-info-selected");               } else {   :                aLink.setAttribute("data-show-status", 0);       5                D.addClass("J-stat-info", "fn-hide");   :				D.addClass(D.query(".stat-info-cash-out"), "fn-hide");   9				D.addClass(D.query(".stat-info-cash-in"), "fn-hide");       @                D.removeClass(aLink, "show-stat-info-selected");               }   	        }       5        //countInfoData : 保存统计金额的数据   C        if (typeof amountData != "undefined" && amountData != "") {               switchShow();   "			aLink.style.cursor = "pointer";               return false;   	        }           @		var api = new AP.core.ajax('/consume/record/statistic.json', {   			callback : {   				success : function(rsp){   $					aLink.style.cursor = "pointer";       .					var rsp = L.JSON.parse(rsp.responseText);   *					var countInfo = D.get("J-stat-info");   					if (rsp.stat == "ok") {   						//成功   #						amountData = rsp.statisticVO;       						//回填数据到页面   						//out   S						D.query(".outTotalCount", countInfo)[0].innerHTML = amountData.outTotalCount;   U						D.query(".outTotalAmount", countInfo)[0].innerHTML = amountData.outTotalAmount;   a						D.query(".successOutTotalCount", countInfo)[0].innerHTML = amountData.successOutTotalCount;   c						D.query(".successOutTotalAmount", countInfo)[0].innerHTML = amountData.successOutTotalAmount;   e						D.query(".inProcessOutTotalCount", countInfo)[0].innerHTML = amountData.inProcessOutTotalCount;   g						D.query(".inProcessOutTotalAmount", countInfo)[0].innerHTML = amountData.inProcessOutTotalAmount;       
						//in   Q						D.query(".inTotalCount", countInfo)[0].innerHTML = amountData.inTotalCount;   S						D.query(".inTotalAmount", countInfo)[0].innerHTML = amountData.inTotalAmount;   _						D.query(".successInTotalCount", countInfo)[0].innerHTML = amountData.successInTotalCount;   a						D.query(".successInTotalAmount", countInfo)[0].innerHTML = amountData.successInTotalAmount;   c						D.query(".inProcessInTotalCount", countInfo)[0].innerHTML = amountData.inProcessInTotalCount;   e						D.query(".inProcessInTotalAmount", countInfo)[0].innerHTML = amountData.inProcessInTotalAmount;       						switchShow();           %					} else if (rsp.stat == "fail") {   						//失败   						var msg = rsp.msg;       B						D.query(".tip-angle-content", countInfo)[0].innerHTML = msg;   ?						D.removeClass(D.query(".t-error", countInfo), "fn-hide");   *						D.removeClass(countInfo, "fn-hide");   3						D.addClass(aLink, "show-stat-info-selected");       #					} else if(rsp.stat == "deny"){   !						if(AP.core.callfromiframe){   3							//如果是iframe但非box则刷新付页面   %							self.parent.location.reload();   						}else{   "							location.href = rsp.target;   						}   					}   				},   				failure : function(rsp){   L					D.query(".tip-angle-content", countInfo)[0].innerHTML = "查询失败";   >					D.removeClass(D.query(".t-error", countInfo), "fn-hide");   )					D.removeClass(countInfo, "fn-hide");   2					D.addClass(aLink, "show-stat-info-selected");   $					aLink.style.cursor = "pointer";   				}   			},   			format: "JSON",   			method: 'POST'   		});   		api.submit('queryForm');   		               E.preventDefault(ev);       },           //交易金额上的浮窗       popDealInfo: function () {   A        E.on(D.query(".amount-pay"), "mouseover", function (ev) {   )            var target = E.getTarget(ev),   /                parentNode = target.parentNode,   A                amountInfo = D.query(".amount-info", parentNode),   /                popInfo = D.get("amount-info");       )            if (amountInfo.length <= 0) {                   return false;               }       R            D.query(".container", popInfo)[0].innerHTML = amountInfo[0].innerHTML;       )            var offset = D.getXY(target);   .            D.removeClass(popInfo, "fn-hide");       "            D.setStyles(popInfo, {   I                "left": (offset[0] + target.offsetWidth / 2) - 23 + "px",   D                "top": (offset[1] - popInfo.offsetHeight - 5) + "px"               });           });       @        E.on(D.query(".amount-pay"), "mouseout", function (ev) {   /            var popInfo = D.get("amount-info");   +            D.addClass(popInfo, "fn-hide");           });           },           //表头得排序功能       orderTable: function () {           var that = this;   <        E.on(D.query(".ico-order"), "click", function (ev) {   )            var target = E.getTarget(ev);   1            var orderBy = that.queryForm.orderBy;       %            if (orderBy.value == 1) {   "                orderBy.value = 2;               } else {   "                orderBy.value = 1;               }   3            that.queryForm.currentPageNo.value = 1;                    formFreeFlag = true;               submitQueryForm();       !            E.preventDefault(ev);           });       },           /**   N     * @description 重置时，高级筛选项直接根据json的数据生成        */       setReset: function () {           var that = this;   7        var resetLink = D.get("J-topSearchForm-reset");       0        E.on(resetLink, "click", function (ev) {   !            E.preventDefault(ev);           			//only ie7   ,			var filterType = D.get("J-filter").value;       ,            //重置表单其它部分的值   $            that.searchForm.reset();       			//only ie7   (			D.get("J-filter").value = filterType;           #            //对应的日期高亮   8            D.removeClass(D.get("J-today"), "selected");   <            D.removeClass(D.get("J-seven-day"), "selected");   :            D.removeClass(D.get("J-a-month"), "selected");   >            D.removeClass(D.get("J-three-month"), "selected");       9            if (that.queryForm.customerType.value == 1) {   =                D.addClass(D.get("J-seven-day"), "selected");               } else {   ;                D.addClass(D.get("J-a-month"), "selected");               }                       //重置时间   <            var now = new Date(D.get("J-date-today").value);   �            var nowDate = now.getFullYear() + "." + (now.getMonth() < 9 ? "0" : "") + (now.getMonth() + 1) + "." + (now.getDate() < 10 ? "0" : "") + now.getDate();       -            //大小C的默认日期不一致   u            var startTime = new Date(now.setDate(now.getDate() - (that.queryForm.customerType.value == 1 ? 6 : 29)));   �            var startDate = startTime.getFullYear() + "." + (startTime.getMonth() < 9 ? "0" : "") + (startTime.getMonth() + 1) + "." + (startTime.getDate() < 10 ? "0" : "") + startTime.getDate();       /            D.get("J-start").value = startDate;   +            D.get("J-end").value = nowDate;           +            //消费场所&&高级筛选项   .            that.setBizType(D.get("type101"));                   return false;           });       },           /**   i     * @description 点击今天、7天、一个月、三个月时，快速设置日期到对应的日期   p     * @notice 这里的一个月和三个月并非以自然月为计算单位，而是以30天和90天为基数        */       setDate: function () {   0        var setDate = D.query(".J-set-date")[0];   .        E.on(setDate, "click", function (ev) {   )            var target = E.getTarget(ev);   !            E.preventDefault(ev);       ,            var startTag = D.get("J-start"),   (                endTag = D.get("J-end"),   >                sTime = new Date(D.get("J-date-today").value),   >                eTime = new Date(D.get("J-date-today").value);       6            if (target.tagName.toUpperCase() == "A") {                   //设置样式   A                D.removeClass(D.query("a", setDate), "selected");   /                D.addClass(target, "selected");                       //设置日期                   //今天   -                if (target.id == "J-today") {   7                    eTime.setDate(eTime.getDate() - 1);                   }                       //7天   1                if (target.id == "J-seven-day") {   7                    eTime.setDate(eTime.getDate() - 7);                   }       "                //一个月(30天)   /                if (target.id == "J-a-month") {   ;                    //eTime.setMonth(eTime.getMonth() - 1);   8                    eTime.setDate(eTime.getDate() - 30);                   }                       //三个月   3                if (target.id == "J-three-month") {   ;                    //eTime.setMonth(eTime.getMonth() - 3);   8                    eTime.setDate(eTime.getDate() - 90);                   }       3                eTime.setDate(eTime.getDate() + 1);       �                endTag.value = sTime.getFullYear() + "." + (sTime.getMonth() < 9 ? "0" : "") + (sTime.getMonth() + 1) + "." + (sTime.getDate() < 10 ? "0" : "") + sTime.getDate();   �                startTag.value = eTime.getFullYear() + "." + (eTime.getMonth() < 9 ? "0" : "") + (eTime.getMonth() + 1) + "." + (eTime.getDate() < 10 ? "0" : "") + eTime.getDate();                       }           });       }   });            5��