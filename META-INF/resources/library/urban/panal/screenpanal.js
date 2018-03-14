define(["knockout", "durandal/app", "jquery", "i18nCommon", "core", "mask", "panalManager", "string", "ui", "resizable"],
    function (ko, app, $, i18n, core, mask, PanalManager, stringUtils) {
        var panalUtils, ScreenPanal;

        ScreenPanal = function (content, settings, param) {
            this.settings = $.extend({}, ScreenPanal.defaultSettings, settings);
            this.settings.sourceTitle = this.settings.title;
            this.content = content;
            this.param = param;     //参数用来传递给panal页面使用的参数
        };

        ScreenPanal.defaultSettings = {
            parent: null,
            width: null,
            height: null,
            draggable: true,
            resizable: false,
            minBtn: true,
            maxBtn: false,
            closeBtn: true,
            max: false,             //初始化为最大化窗口
            heightMax: false,       //初始化为高度最大化
            titleShow: true,
            title: "",
            panalListTitle: "",     //在桌面的面板列表上显示的标题，用在title为空的情况
            top: null,
            left: null,
            right: null,
            bottom: null,
            margin: 0,
            dockPosition: "",       //left/right/bottom 在哪个边停靠,为空表示非停靠式panal
            currentState: "expand", //expand,shrink 伸缩状态
            modal: false,           //是否模态
            contentOpacity: 0.95,   //内容透明度默认设置为 0.95
            headOpacity: 1,         //标题透明度默认不透明
            transition: false,      //转场动画
            multi: false,           //是否只可能存在一个页面，如果可能被多次打开，请设置为true
            multiId: null,          //用来标识被多次打开的字符串
            closeOther: false,
            headShow: true,         //隐藏标题栏
            fullScreen: false,      //全屏（遮盖上下工具栏）
            onFocus: function (e) { },
            onBlur: function (e) { },
            onClick: function (e) { },
            onDbClick: function (e) { },
            onStartDrag: function (e, ui) { },
            onDrag: function (e, ui) { },
            onStopDrag: function (e, ui) { },
            onResize: function (e) { },
            onClose: function () { },
            onBeforeClose: function () { return true; }
        };

        /** 初始化面板 **/
        ScreenPanal.prototype.init = function (closeOther) {
            ScreenPanal.initPanal(this);
            ScreenPanal.initHead(this);
            ScreenPanal.initButton(this);
            ScreenPanal.initContent(this);
            this.renderPanal(this.settings.currentState);
            PanalManager.panalEvent();
            this.active();
            PanalManager.regPanal(this, closeOther);
        };

        /** 初始化面板 **/
        ScreenPanal.initPanal = function (p) {
            p.panalElement = $(ScreenPanal.view);
            p.panalElement.attr("panal-id", p.panalId);
            p._headElement = p.panalElement.find(".app-screenpanal-head");
            p._contentElement = p.panalElement.find(".app-screenpanal-content");

            if (p.settings.dockPosition) { // 停靠式
                p.settings.minBtn = false;
                if (p.settings.dockPosition == "bottom") {
                    p.panalElement.append($(ScreenPanal.dockButtonViewH));
                } else {
                    p.panalElement.append($(ScreenPanal.dockButtonViewV));
                }
                p._dockButton = p.panalElement.find(".app-screenpanal-dockbutton");
            } else { // 悬浮式
                if (p.settings.width == null && p.settings.height == null) { // 全屏
                    p.panalElement.addClass("screen-background");
                    p._headElement.remove();
                } else { // 非全屏
                    if (p.settings.draggable) { // 拖拽式
                        p._headElement.css({ "cursor": "move" });
                        p.panalElement.draggable({
                            containment: [-(p.settings.width), 0, ($(window).width() + p.settings.width), ($(window).height() + p.settings.height)],
                            scroll: false,
                            iframeFix: true,
                            handle: p._headElement,
                            start: p.settings.onStartDrag,
                            drag: p.settings.onDrag,
                            stop: p.settings.onStopDrag
                        });
                    } else {
                        p._headElement.css({ "cursor": "auto" });
                    }
                    p.panalElement.click(function () {
                        p.settings.onClick();
                    });
                }
            }

            // draggable方法会使panalElement的position属性设为relative
            p.panalElement.css("position", "absolute");
            p.panalElement.appendTo(p.settings.parent);
        };

        /** 初始化面板标头 **/
        ScreenPanal.initHead = function (p) {
            //模态panal不能使用最小化按钮
            if (p.settings.modal) {
                p.settings.minBtn = false;
            }
            //设置标题
            if (p.settings.title) {
                p._headElement.find(".app-screenpanal-head-title").text(p.settings.title);
            } else {
                if (!p.settings.closeBtn) {
                    p._headElement.hide();
                    p.settings.titleShow = false;
                } else {
                    p._headElement.css("border-bottom", "none");
                }
            }
            p._headElement.click(function () {
                p.active();
            });
        };

        /** 初始化面板内容 **/
        ScreenPanal.initContent = function (p) {
            p.uniqueID = core.generateId("app-panal");
            p._contentElement.attr("id", p.uniqueID);
            p._contentElement.css({
                position: "absolute",
                top: p.settings.titleShow ? p._headElement.height() : 0,
                left: 0,
                bottom: 0
            });
            //载入页面内容
            if (typeof (p.content) == 'string') {
                if (p.settings.transition) {
                    app.setRoot(p.content, "entrance", p.uniqueID);
                } else {
                    app.setRoot(p.content, null, p.uniqueID);
                }
            } else {
                p.content.css({ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 });
                p._contentElement.append(p.content);
            }
        };

        /** 初始化面板按钮 **/
        ScreenPanal.initButton = function (p) {
            if (p.settings.closeBtn) {
                //关闭操作
                p.panalElement.find(".app-screenpanal-head-button-btn-close").click(function () {
                    if (p.settings.onBeforeClose())
                        p.close();
                }).attr("title", i18n.textCommonPanalCloseBtn);
            } else {
                p.panalElement.find(".app-screenpanal-head-button-btn-close").hide();
            }
            if (p.settings.minBtn) {
                p._headElement.find(".app-screenpanal-head-button-btn-min").click(function () {
                    p.minElement = $(ScreenPanal.minView);
                    p.minElement.css({
                        "position": "absolute",
                        "width": 150,
                        "height": 30,
                        "left": p.panalElement[0].offsetLeft,
                        "top": p.panalElement[0].offsetTop
                    });
                    p.minElement.find(".app-screenpanal-min-title").text(p.settings.title);
                    p.minElement.appendTo($("body"));
                    p.hide();

                    p.minElement.find(".app-screenpanal-min-button-btn-restore").click(function () {
                        p.show();
                        p.minElement.remove();
                    });
                }).attr("title", i18n.textCommonPanalMinBtn);
            } else {
                p.panalElement.find(".app-screenpanal-head-button-btn-min").hide();
            }
            if (p.settings.dockPosition) {
                p._dockButton.click(function () {
                    if (p.settings.dockPosition == "left") {
                        if (p.currentState == "shrink") {
                            p.currentState = "expand";
                            p.panalElement.animate({ left: 0 });
                        } else {
                            p.currentState = "shrink";
                            p.panalElement.animate({ left: -p.panalElement.width() + p._dockButton.width() });
                        }
                    } else if (p.settings.dockPosition == "right") {
                        if (p.currentState == "shrink") {
                            p.currentState = "expand";
                            p.panalElement.animate({ right: 0 });
                        } else {
                            p.currentState = "shrink";
                            p.panalElement.animate({ right: -p.panalElement.width() + p._dockButton.width() });
                        }
                    } else if (p.settings.dockPosition == "bottom") {
                        if (p.currentState == "shrink") {
                            p.currentState = "expand";
                            p.panalElement.animate({ bottom: 0 });
                        } else {
                            p.currentState = "shrink";
                            p.panalElement.animate({ bottom: -p.panalElement.height() + p._dockButton.height() });
                        }
                    }
                });
            }
        };

        /** 激活面板 **/
        ScreenPanal.prototype.active = function () {
            if (!this.settings.modal) {
                this.zIndex = PanalManager.getNextZIndex();
            } else {
                if (!this._mask) {
                    this._mask = mask.getInstance();
                }
                this._mask.show();
                this.zIndex = PanalManager.getNextModalZIndex();
            }
            this.panalElement.css("z-index", this.zIndex);
            this._headElement.removeClass("app-screenpanal-inactive");
            this.settings.onFocus(this);
            PanalManager.activeAfter(this);
        };

        ScreenPanal.prototype.renderPanal = function (state) {
            if (this.settings.dockPosition) { // 停靠式
                if (this.settings.dockPosition == "left") {
                    if (typeof (this.content) != "string" && this.settings.width) {
                        this.content.width(this.settings.width - this._dockButton.width());
                    }
                    if (this.settings.top == null || this.settings.bottom == null) {
                        this.panalElement.css({
                            width: this.settings.width,
                            height: this.settings.height,
                            top: this.settings.top
                        });
                    } else {
                        this.panalElement.css({
                            width: this.settings.width,
                            top: this.settings.top,
                            bottom: this.settings.bottom
                        });
                    }
                    this._headElement.addClass("app-screenpanal-dock-head");
                    this._contentElement.css({ right: this._dockButton.width() });
                    this._dockButton.css({
                        position: "absolute",
                        right: 0,
                        top: (this.panalElement.height() - this._dockButton.height()) / 2
                    });
                    if (state == "expand") {
                        this.panalElement.css({ left: 0 });
                    } else {
                        this.panalElement.css({ left: -this.settings.width + this._dockButton.width() });
                    }
                } else if (this.settings.dockPosition == "right") {
                    if (typeof (this.content) != "string" && this.settings.width) {
                        this.content.width(this.settings.width - this._dockButton.width());
                    }
                    if (this.settings.top == null || this.settings.bottom == null) {
                        this.panalElement.css({
                            width: this.settings.width,
                            height: this.settings.height,
                            top: this.settings.top
                        });
                    } else {
                        this.panalElement.css({
                            width: this.settings.width,
                            top: this.settings.top,
                            bottom: this.settings.bottom
                        });
                    }
                    this._headElement.addClass("app-screenpanal-dock-head");
                    this._contentElement.css({ left: this._dockButton.width() });
                    this._dockButton.css({
                        position: "absolute",
                        left: 0,
                        top: (this.panalElement.height() - this._dockButton.height()) / 2
                    });
                    if (state == "expand") {
                        this.panalElement.css({ right: 0 });
                    } else {
                        this.panalElement.css({ right: -this.settings.width + this._dockButton.width() });
                    }
                } else if (this.settings.dockPosition == "bottom") {
                    if (this.settings.left == null || this.settings.right == null) {
                        this.panalElement.css({
                            width: this.settings.width,
                            height: this.settings.height,
                            left: this.settings.left,
                            bottom: this.settings.bottom
                        });
                    } else {
                        this.panalElement.css({
                            height: this.settings.height,
                            left: this.settings.left,
                            right: this.settings.right,
                            bottom: this.settings.bottom
                        });
                    }
                    this._headElement.addClass("app-screenpanal-dock-head");
                    this._dockButton.css({
                        position: "absolute",
                        top: 0,
                        left: (this.panalElement.width() - this._dockButton.width()) / 2
                    });
                    if (state == "expand") {
                        this.panalElement.css({ bottom: 0 });
                    } else {
                        this.panalElement.css({ bottom: -this.settings.height + this._dockButton.height() });
                    }
                }
            } else { // 悬浮式
                if (this.settings.width == null && this.settings.height == null) { // 全屏
                    this._contentElement.css({
                        "border": "none",
                        "top": this.settings.top || 0
                    });
                } else {
                    this.panalElement.css({
                        "border": "none",
                        "border-radius": "5px"
                    });
                    this._headElement.addClass("app-screenpanal-drag-head");
                    this._contentElement.addClass("app-screenpanal-drag-content");
                }
                this.resize(this.settings);
            }
        }

        /** 不激活面板 **/
        ScreenPanal.prototype.inActive = function (activePanal) {
            this._headElement.addClass("app-screenpanal-inactive");
            this.settings.onBlur(activePanal);
        };

        /** 最大化面板 **/
        ScreenPanal.prototype.max = function () {
            var width = 10, height = 75, top = '70px', bottom = '5px', left = '5px';
            if (this.settings.fullScreen) {
                width = 0;
                height = 0;
                top = '0px';
                bottom = '0px';
                left = '0px';
            }
            this.resize({
                "left": left,
                "top": top,
                "bottom": bottom,
                "width": document.documentElement.clientWidth - width,
                "height": document.documentElement.clientHeight - height
            });
        };

        ScreenPanal.prototype.hide = function () {
            this.panalElement.hide();
        };

        /** 移动面板 **/
        ScreenPanal.prototype.move = function (x, y) {
            if (this.settings.left) {
                this.settings.left = this.settings.left + x;
                this.panalElement.css({ "left": this.settings.left });
            } else if (this.settings.right) {
                this.settings.right = this.settings.right - x;
                this.panalElement.css({ "right": this.settings.right });
            }
            if (this.settings.top) {
                this.settings.top = this.settings.top + y;
                this.panalElement.css({ "top": this.settings.top });
            } else if (this.settings.bottom) {
                this.settings.bottom = this.settings.bottom - y;
                this.panalElement.css({ "bottom": this.settings.bottom });
            }
        };

        /** 移动面板到 **/
        ScreenPanal.prototype.moveTo = function (x, y) {
            this.settings.left = x;
            this.settings.right = null;
            this.settings.top = y;
            this.settings.bottom = null;
            this.panalElement.css({
                "left": this.settings.left,
                "right": this.settings.right,
                "top": this.settings.top,
                "bottom": this.settings.bottom
            });
        };

        /** 更新标题 **/
        ScreenPanal.prototype.updateTitle = function (title, titleTip) {
            this.settings.title = title;
            this._headElement.find(".app-screenpanal-head-title").text(title);
            if (titleTip) {
                this._headElement.find(".app-screenpanal-head-title").attr("title", titleTip);
            } else {
                this._headElement.find(".app-screenpanal-head-title").attr("title", "");
            }
        };

        ScreenPanal.prototype.getPanalElement = function () {
            return this.panalElement;
        };

        ScreenPanal.prototype.show = function () {
            this.panalElement.show();
        };

        ScreenPanal.prototype.isShow = function () {
            return this.panalElement.is(':visible');
        };

        /**closeByAnother:表示由于打开其他的panal，而关闭了此panal，与点击关闭按钮关闭此panal相区别**/
        ScreenPanal.prototype.close = function (closeByAnother) {
            if (this.settings.modal) {
                this._mask.remove();
                this._mask = null;
            }
            this.settings.onClose();
            PanalManager.unRegPanal(this);
            this.panalElement.remove();
            this.minElement && this.minElement.remove();
            if (!closeByAnother) {
                if (PanalManager.getPanalCount() == 0) {
                    app.trigger("desktop:menu:unselect");
                }
            }
        };

        /** 与close的区别只有是否调用回调函数 **/
        ScreenPanal.prototype.cancelClose = function () {
            if (this.settings.modal) {
                this._mask.remove();
                this._mask = null;
            }
            PanalManager.unRegPanal(this);
            this.panalElement.remove();
        };

        ScreenPanal.prototype.center = function () {
            this.panalElement.css({
                "left": (document.documentElement.clientWidth - this.panalElement.width()) / 2,
                "top": (document.documentElement.clientHeight - this.panalElement.height()) / 2
            });
        };

		/** 
		*初始化panal大小和位置
		*@param setting {width,height,top,right,right,bottom}
		*/
        ScreenPanal.prototype.resize = function (setting) {
            if (setting) {
                if (setting.width == null && setting.height == null) {
                    this.panalElement.css({
                        "left": 0,
                        "top": 0,
                        "right": 0,
                        "bottom": 0
                    });
                } else {
                    if (setting.left == null && setting.right == null) {
                        setting.left = (document.documentElement.clientWidth - setting.width) / 2;
                    }
                    if (setting.top == null && setting.bottom == null) {
                        setting.top = (document.documentElement.clientHeight - setting.height) / 2;
                    }
                    this.panalElement.css({
                        "left": setting.left,
                        "top": setting.top,
                        "right": setting.right,
                        "bottom": setting.bottom
                    });
                    if (setting.width) {
                        this.panalElement.width(setting.width);
                    }
                    if (setting.height) {
                        this.panalElement.height(setting.height);
                    }
                }
                this.settings.onResize();
            }
        };

        /*刷新面板内容*/
        ScreenPanal.prototype.update = function (params) {
            if (params)
                this.param = params;
            ScreenPanal.initContent(this);
        }

        ScreenPanal.view = [
            "<div class='app-panal app-screenpanal app-screenpanal-background'>",
            "<div class='app-screenpanal-head'>",
            "<span class='app-screenpanal-head-title'></span>",
            "<svg width='16' height='16' version='1.1' xmlns='http://www.w3.org/2000/svg' class='app-screenpanal-head-button-btn app-screenpanal-head-button-btn-min'>",
            "<line x1='1' y1='8' x2='15' y2='8'/>",
            "</svg>",
            "<svg width='16' height='16' version='1.1' xmlns='http://www.w3.org/2000/svg' class='app-screenpanal-head-button-btn app-screenpanal-head-button-btn-close'>",
            "<line x1='1' y1='1' x2='15' y2='15'/>",
            "<line x1='15' y1='1' x2='1' y2='15'/>",
            "</svg>",
            "</div>",
            "<div class='app-screenpanal-content' id=''></div>",
            "</div>"
        ].join("");

        ScreenPanal.minView = [
            "<div class='app-panal app-screenpanal app-screenpanal-background'>",
            "<div class='app-screenpanal-content-min'>",
            "<div class='app-screenpanal-min-title'></div>",
            "<svg width='16' height='16' version='1.1' xmlns='http://www.w3.org/2000/svg' class='app-screenpanal-min-button-btn-restore'>",
            "<line x1='1' y1='4' x2='15' y2='4'/>",
            "<line x1='1' y1='12' x2='15' y2='12'/>",
            "<line x1='1' y1='4' x2='1' y2='12'/>",
            "<line x1='15' y1='4' x2='15' y2='12'/>",
            "</svg>",
            "</div>",
            "</div>"
        ].join("");

        ScreenPanal.dockButtonViewH = [
            "<svg width='16' height='10' version='1.1' xmlns='http://www.w3.org/2000/svg' class='app-screenpanal-dockbutton'>",
            "<line x1='2' y1='2' x2='2' y2='8'/>",
            "<line x1='8' y1='2' x2='8' y2='8'/>",
            "<line x1='14' y1='2' x2='14' y2='8'/>",
            "</svg>"
        ].join("");

        ScreenPanal.dockButtonViewV = [
            "<svg width='10' height='16' version='1.1' xmlns='http://www.w3.org/2000/svg' class='app-screenpanal-dockbutton'>",
            "<line x1='2' y1='2' x2='8' y2='2'/>",
            "<line x1='2' y1='8' x2='8' y2='8'/>",
            "<line x1='2' y1='14' x2='8' y2='14'/>",
            "</svg>"
        ].join("");

        panalUtils = {
            getInstance: function (content, settings, param) {
                param = param || {};
                settings = settings || {};
                var panalId;
                if (typeof (content) == "string") {
                    settings.parent = $("body");
                    // 支持content中添加参数,（主要目的为了减少参数配置）格式：viewPath?p1=value1&p2=value2, 如果 param中有设置，以param为准
                    // 支持content中添加设置参数，设置参数的命名需要添加前缀 "_$_"，以区别于普通参数,如果settings中有设置，以settings中为准 
                    var pos = content.indexOf("?");
                    if (pos > -1) {
                        var paramArray = content.substr(pos + 1).split("&"), params;
                        for (var i = 0; i < paramArray.length; i++) {
                            params = paramArray[i].split("=");
                            if (params[1]) {
                                if (params[0].indexOf("_$_") === 0) {
                                    params[0] = params[0].substr(3);
                                    settings[params[0]] = settings[params[0]] || stringUtils.getValue(params[1]);
                                } else {
                                    param[params[0]] = param[params[0]] || stringUtils.getValue(params[1]);
                                }
                            }
                        }
                        content = content.substring(0, pos);
                    }

                    panalId = content;
                    if (settings && settings.multi) {
                        panalId = panalId + settings.multiId;
                    }
                    if (PanalManager.exist(panalId)) {
                        var p = PanalManager.getPanal(panalId);
                        p.show();
                        p.active();
                        return p;
                    } else {
                        var p = new ScreenPanal(content, settings, param);
                        p.panalId = panalId;
                        p.init();
                        if (p.settings.max)
                            p.max();
                        if (p.settings.heightMax)
                            p.heightMax();
                        return p;
                    }
                } else {
                    settings.parent = content.parents("div:first");
                    var contentID = content.attr("id") || PanalManager.getNextZIndex();
                    panalId = "panal-" + contentID;
                    // if (settings.top == null && content.css("top") != "auto") {
                    //     settings.top = Number(content.css("top").replace("px", ""));
                    // }
                    // if (settings.left == null && content.css("left") != "auto") {
                    //     settings.left = Number(content.css("left").replace("px", ""));
                    // }
                    // if (settings.right == null && content.css("right") != "auto") {
                    //     settings.right = Number(content.css("right").replace("px", ""));
                    // }
                    // if (settings.bottom == null && content.css("bottom") != "auto") {
                    //     settings.bottom = Number(content.css("bottom").replace("px", ""));
                    // }
                    // if (settings.width == null) {
                    //     settings.width = content.width();
                    //     //如果不设置width，width会默认为浏览器的宽度
                    //     if (document.documentElement.clientWidth == settings.width && settings.left != null && settings.right != null) {
                    //         settings.width = settings.width - settings.left - settings.right;
                    //     }
                    // }
                    // if (settings.height == null && content.css("height") != "auto") {
                    //     settings.height = Number(content.css("height").replace("px", ""));
                    // }
                    var p = new ScreenPanal(content, settings, param);
                    p.panalId = panalId;
                    p.init();
                    return p;
                }
            },
            getPanal: function (panalId) {
                return PanalManager.getPanal(panalId);
            },
            getAllPanal: function () {
                return PanalManager.getAllPanal();
            },
            /** 通过面板内部的dom元素获取面板对象 **/
            getPanalByElement: function (element) {
                if (!(element instanceof $)) {
                    element = $(element);
                }
                return this.getPanal(element.parents("div.app-screenpanal:first").attr("panal-id"));
            },
            getDefaultMargin: function () {
                return ScreenPanal.defaultSettings.margin || 0;
            }
        };

        return panalUtils;

    });