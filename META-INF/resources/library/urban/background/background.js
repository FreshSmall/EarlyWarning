define(["jquery"], function (jquery) {
    var  Background, BackgroundUtils;

    Background = function (container, settings) {
        this.container = container && $(container);
        this.settings = $.extend({}, Background.defaultSettings, settings);
        Background.init(this);
    };

    Background.defaultSettings = {
        type: 1,
        height: 30,
        title: "",
        fontSize: 16,
        fontColor: '#32fef7',
        fontFamily: 'MicroSoft Yahei',
        backgroundColor: '#275074',
        backgroundBoderColor: '#269aff',
    };

    Background.init = function (bg) {
        if (bg.settings.type == 1) {
            bg.headElement = $('<div class="smartmap-type1-panal-head width-100" ' +
                'style="position:relative;height:' + bg.settings.height + 'px;"></div>');
        } else if (bg.settings.type == 2) {
            bg.headElement = $('<div class="smartmap-type2-panal-head width-100" ' +
                'style="position:relative;height:' + bg.settings.height + 'px;"></div>');
        }

        bg.container.prepend(bg.headElement);
        Background.setBack(bg);
        Background.setTitle(bg);
    };

    Background.setBack = function (bg) {
        var back;

        var width = bg.container.width();
        var height = bg.settings.height;

        if (bg.settings.type == 1) {
            back = $(
                '<div class="smartmap-type1-panal-head-background width-100 height-100" style="float:left;">' +
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMinYMin meet"' +
                'width="' + width + 'px" height="' + height + 'px" viewBox="0,0,' + width + ',' + height + '"' +
                '<g>' +
                '<path d="M0,0 L' + (width * 0.4 - height * 0.8) + ',0 L' + (width * 0.4 + height * 0.8) + ',' + height + ' L' + width + ',' + height + ' L0,' + height + ' Z" ' +
                'style="fill:' + bg.settings.backgroundColor + ';fill-rule:evenodd;stroke:' + bg.settings.backgroundBoderColor + ';stroke-width:1px;" />' +
                '</g>' +
                '</svg>' +
                '</div>'
            );
        } else if (bg.settings.type == 2) {
            back = $(
                '<div class="smartmap-type2-panal-head-background width-100 height-100" style="float:left;border-bottom:1px solid ' + bg.settings.backgroundBoderColor + '"></div>'
            );
        }

        bg.headElement.append(back);
    };

    Background.setTitle = function (bg) {
        var title;

        if (bg.settings.type == 1) {
            title = $(
                '<div class="smartmap-type1-panal-head-title" style="position:absolute;font-weight:bold;font-family:' +
                bg.settings.fontFamily + ';font-size:' + bg.settings.fontSize + 'px;color:' + bg.settings.fontColor +
                ';font-style:italic;line-height:' + bg.settings.height + 'px;padding-left:1rem;">' + bg.settings.title + '</div>'
            );
        } else if (bg.settings.type == 2) {
            title = $(
                '<div class="smartmap-type2-panal-head-title" style="position:absolute;font-family:' +
                bg.settings.fontFamily + ';font-size:' + bg.settings.fontSize + 'px;color:' + bg.settings.fontColor +
                ';line-height:' + bg.settings.height + 'px;padding-left:1rem;">' + bg.settings.title + '</div>'
            );
        }

        bg.headElement.append(title);
    };

    Background.prototype.getTitle = function(){
        if (this.settings.type == 1) {
            return this.headElement.find(".smartmap-type1-panal-head-title").text();
        } else if (this.settings.type == 2) {
            return this.headElement.find(".smartmap-type2-panal-head-title").text();
        }
    }

    Background.prototype.updateTitle = function(title){
        if (this.settings.type == 1) {
            return this.headElement.find(".smartmap-type1-panal-head-title").text(title);
        } else if (this.settings.type == 2) {
            return this.headElement.find(".smartmap-type2-panal-head-title").text(title);
        }
    }

    BackgroundUtils = {
        getInstance: function (container, settings) {
            var background = new Background(container, settings);
            return background;
        }
    }

    return BackgroundUtils;
});