define(["jquery", "i18nCommon"], function ($, i18n) {
	var self, Menu;

	Menu = function (container, data, settings) {
		self = this;
		self._container = container;
		self._data = data;
		self._settings = $.extend({}, Menu.defaultSettings, settings);

		self.init();
	};

	Menu.defaultSettings = {
		type: 1
	};

	Menu.dataDefault = {
		visible: true,
		click: function (e) { }
	};

	Menu.prototype.init = function () {
		self._menuItems = {};

		if (self._settings.type === 1) {
			self._content = $('<div class="col-xs-12 width-100"></div>');
			self._data = [{
				id: -1,
				text: self._data && self._data[0] && self._data[0].text,
				title: self._data && self._data[0] && self._data[0].title,
				subMenu: self._data
			}];
		} else if (self._settings.type === 2) {
			self._content = $('<div class="row top-xs end-xs height-100"></div>');
		}

		self.add(self._data);
		self.adjust();

		self._container.append(self._content);
	};

	/**
	 * menuData 格式 [{
	 *   id: "menu001",
	 *   text: "标题1",
	 *   title: "标题1",
	 *   visible: true,
	 *   click: function(){
	 *   },
	 *   subMenu:[{
	 *       id: "menu001",
	 *       text: "标题1",
	 *       title: "标题1",
	 *       visible: true,
	 *       click: function(){
	 *       },
	 *       subMenu:[{
	 *       	...
	 *       }]
	 *   }]
	 * }]
	 */
	Menu.prototype.add = function (menuData, parentItem) {
		if (menuData && menuData instanceof Array && menuData.length > 0) {
			menuData.sort(function (a, b) { a.displayOrder - b.displayOrder });
			menuData.forEach(function (data) {
				self.build(data, parentItem);
				self.add(data.subMenu, self._menuItems[data.id]);
			});
		} else {
			return;
		}
	};

	Menu.prototype.build = function (menuData, parentItem) {
		menuData = $.extend({}, Menu.dataDefault, menuData);

		var menuItem;
		var menuText = '';
		if (self._settings.type === 1) {
			if (Number(menuData.id) === -1) {
				menuText = '<div menuID="' + menuData.id + '" class="row top-xs margin-0 padding-0 app-screen-menu-item-one">' +
					'<div class="app-screen-menu-item-text" style="overflow:visible;">' + menuData.text + '</div>' +
					'<div class="col-xs-3 height-100 padding-0 app-screen-menu-item-arrow"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" viewBox="0,0,100,100"><g><path d="M35,35 L65,50 L35,65 Z" /></g></svg></div>';
			} else {
				menuText = '<div menuID="' + menuData.id + '" class="row top-xs margin-0 padding-0 app-screen-menu-item">' +
					'<div class="col-xs-12 app-screen-menu-item-text">' + menuData.text + '</div>';
			}
			if (menuData.subMenu && menuData.subMenu.length > 0) {
				menuText += '<div class="col-xs-12 margin-0 padding-0 app-screen-menu-item-sub"></div>';
			}
			menuText += '</div>';
		} else if (self._settings.type === 2) {
			if (parentItem) {
				menuText = '<div menuID="' + menuData.id + '" class="row top-xs margin-0 padding-0 app-screen-menu-item">' +
					'<div class="col-xs-12 app-screen-menu-item-text">' + menuData.text + '</div>';
				if (menuData.subMenu && menuData.subMenu.length > 0) {
					menuText += '<div class="col-xs-12 margin-0 padding-0 app-screen-menu-item-sub"></div>';
				}
			} else {
				menuText = '<div menuID="' + menuData.id + '" class="app-screen-menu-item-container">' +
					'<div class="row width-100 margin-0 padding-0 app-screen-menu-item-one"><div class="col-xs app-screen-menu-item-text">' + menuData.text + '</div></div>';
				if (menuData.subMenu && menuData.subMenu.length > 0) {
					menuText += '<div class="row width-100 margin-0 padding-0 app-screen-menu-item-sub"></div>';
				}
			}
			menuText += '</div>';
		}
		menuItem = $(menuText);

		if (parentItem) {
			parentItem.find(".app-screen-menu-item-sub:first").append(menuItem);
		} else {
			self._content.append(menuItem);
		}
		self._menuItems[menuData.id] = menuItem;

		// 鼠标移入事件
		menuItem.mouseenter(function () {
			menuItem.find(".app-screen-menu-item-sub:first").fadeIn();
			menuItem.find(".app-screen-menu-item-sub:first").children().fadeIn();
		});

		// 鼠标移出事件
		menuItem.mouseleave(function () {
			menuItem.find(".app-screen-menu-item-sub:first").hide();
			menuItem.find(".app-screen-menu-item-sub:first").children().hide();
		});

		// 鼠标点击事件
		if (menuData.subMenu && menuData.subMenu.length > 0) {
			menuItem.click(function (e) {
				menuItem.find(".app-screen-menu-item-sub:first").hide();
				menuItem.find(".app-screen-menu-item-sub:first").children().hide();
			});
		} else {
			menuItem.click(function (e) {
				menuItem.find(".app-screen-menu-item-sub:first").hide();
				menuItem.find(".app-screen-menu-item-sub:first").children().hide();
				if (self._settings.type === 1) {
					self._container.find(".app-screen-menu-item-text:first").text(menuItem.find(".app-screen-menu-item-text:first").text());
				} else if (self._settings.type === 2) {
					self._container.find(".app-screen-menu-item-one").removeClass("selected");
					menuItem.closest(".app-screen-menu-item-container").find(".app-screen-menu-item-one:first").addClass("selected");
				}

				e.menuID = Number(menuItem.attr("menuID"));
				menuData.click(e);
			});
		}
	};

	Menu.prototype.adjust = function () {
		// 中文字符超过5，则添加Title 属性，css设置省略号
		self._content.find(".app-screen-menu-item-text").each(function () {
			var text = $(this).text();
			if (text.match(/[\u4e00-\u9fff\uf900-\ufaff]/g).length > 5) {
				$(this).attr("title", text);
			}
		});

		// 默认选中第一项
		if (self._settings.type === 2) {
			self._content.find(".app-screen-menu-item-one:first").addClass("selected");
		}
	};

	Menu.prototype.setSelected = function (menuID) {
		self._content.find(".app-screen-menu-item-one").removeClass("selected");
		self._content.find(".app-screen-menu-item-container[menuid=" + menuID + "]").children().addClass("selected");
	}

	return {
		getInstance: function (container, data, settings) {
			return new Menu(container, data, settings);
		}
	}
});
