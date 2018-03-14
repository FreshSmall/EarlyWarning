-- 2017-07-17 chenshichang 增加监督指挥系统菜单
delete from dlsys.tc_human_nav_item where nav_item_id in (select nav_item_id from tc_nav_item where sys_id = 11);
delete from dlsys.tc_role_nav_item where nav_item_id in (select nav_item_id from tc_nav_item where sys_id = 11);
delete from dlsys.tc_nav_item where sys_id = 11;

update dlsys.tc_nav_item set nav_view = '', url = 'screen.htm' where nav_item_id = 19;

insert into dlsys.tc_nav_item (NAV_ITEM_ID, DISPLAY_NAME, DISPLAY_ORDER, MAX_FLAG, MODAL_FLAG, NAV_ITEM_DESC, NAV_ITEM_ICON, NAV_ITEM_NAME, NAV_ITEM_TITLE, SENIOR_ID, SHOW_FLAG, SYS_ID, URL, NAV_VIEW, WIDTH, HEIGHT)
values (1901, '首页', 1, 0, 0, '首页', '0 0', 'home', '首页', 0, 1, 11, null, 'view/screen/desktop/home', null, null);

insert into dlsys.tc_nav_item (NAV_ITEM_ID, DISPLAY_NAME, DISPLAY_ORDER, MAX_FLAG, MODAL_FLAG, NAV_ITEM_DESC, NAV_ITEM_ICON, NAV_ITEM_NAME, NAV_ITEM_TITLE, SENIOR_ID, SHOW_FLAG, SYS_ID, URL, NAV_VIEW, WIDTH, HEIGHT)
values (1902, '监督员', 2, 0, 0, '监督员', '-32 0', 'humandynamic', '监督员', 0, 1, 11, null, 'view/screen/humandynamic/humanregion', 400, null);

insert into dlsys.tc_nav_item (NAV_ITEM_ID, DISPLAY_NAME, DISPLAY_ORDER, MAX_FLAG, MODAL_FLAG, NAV_ITEM_DESC, NAV_ITEM_ICON, NAV_ITEM_NAME, NAV_ITEM_TITLE, SENIOR_ID, SHOW_FLAG, SYS_ID, URL, NAV_VIEW, WIDTH, HEIGHT)
values (1903, '案件流程', 3, 0, 0, '案件流程', '-64 0', 'recdynamic', '案件流程', 0, 1, 11, null, 'view/screen/recdynamic/process', 400, null);

insert into dlsys.tc_nav_item (NAV_ITEM_ID, DISPLAY_NAME, DISPLAY_ORDER, MAX_FLAG, MODAL_FLAG, NAV_ITEM_DESC, NAV_ITEM_ICON, NAV_ITEM_NAME, NAV_ITEM_TITLE, SENIOR_ID, SHOW_FLAG, SYS_ID, URL, NAV_VIEW, WIDTH, HEIGHT)
values (1904, '综合评价', 4, 0, 0, '综合评价', '-96 0', 'evaluation', '综合评价', 0, 1, 11, null, 'view/screen/evaluation/evaluation', null, null);

insert into dlsys.tc_nav_item (NAV_ITEM_ID, DISPLAY_NAME, DISPLAY_ORDER, MAX_FLAG, MODAL_FLAG, NAV_ITEM_DESC, NAV_ITEM_ICON, NAV_ITEM_NAME, NAV_ITEM_TITLE, SENIOR_ID, SHOW_FLAG, SYS_ID, URL, NAV_VIEW, WIDTH, HEIGHT)
values (1905, '基础数据', 5, 0, 0, '基础数据', '-128 0', 'basisdata ', '基础数据', 0, 1, 11, null, null, null, null);

insert into dlsys.tc_nav_item (NAV_ITEM_ID, DISPLAY_NAME, DISPLAY_ORDER, MAX_FLAG, MODAL_FLAG, NAV_ITEM_DESC, NAV_ITEM_ICON, NAV_ITEM_NAME, NAV_ITEM_TITLE, SENIOR_ID, SHOW_FLAG, SYS_ID, URL, NAV_VIEW, WIDTH, HEIGHT)
values (1906, '视频监控', 6, 0, 0, '视频监控', '-160 0', 'videomonitor', '视频监控', 0, 1, 11, null, 'view/screen/video/videomonitor', 350, 550);

insert into dlsys.tc_nav_item (NAV_ITEM_ID, DISPLAY_NAME, DISPLAY_ORDER, MAX_FLAG, MODAL_FLAG, NAV_ITEM_DESC, NAV_ITEM_ICON, NAV_ITEM_NAME, NAV_ITEM_TITLE, SENIOR_ID, SHOW_FLAG, SYS_ID, URL, NAV_VIEW, WIDTH, HEIGHT)
values (1907, '车辆监控', 7, 0, 0, '车辆监控', '-192 0', 'vehicle', '车辆监控', 0, 1, 11, null, 'view/screen/vehicle/vehicle', 350, 550);

insert into dlsys.tc_nav_item (NAV_ITEM_ID, DISPLAY_NAME, DISPLAY_ORDER, MAX_FLAG, MODAL_FLAG, NAV_ITEM_DESC, NAV_ITEM_ICON, NAV_ITEM_NAME, NAV_ITEM_TITLE, SENIOR_ID, SHOW_FLAG, SYS_ID, URL, NAV_VIEW, WIDTH, HEIGHT)
values (19051, '普查成果', 1, 0, 0, '普查成果', null, 'census', '普查成果', 1905, 1, 11, null, 'view/screen/basisdata/census', 450, 500);

insert into dlsys.tc_nav_item (NAV_ITEM_ID, DISPLAY_NAME, DISPLAY_ORDER, MAX_FLAG, MODAL_FLAG, NAV_ITEM_DESC, NAV_ITEM_ICON, NAV_ITEM_NAME, NAV_ITEM_TITLE, SENIOR_ID, SHOW_FLAG, SYS_ID, URL, NAV_VIEW, WIDTH, HEIGHT)
values (19052, '部件分析', 2, 0, 0, '部件分析', null, 'part', '部件分析', 1905, 1, 11, null, 'view/screen/basisdata/part', 450, 500);

insert into dlsys.tc_nav_item (NAV_ITEM_ID, DISPLAY_NAME, DISPLAY_ORDER, MAX_FLAG, MODAL_FLAG, NAV_ITEM_DESC, NAV_ITEM_ICON, NAV_ITEM_NAME, NAV_ITEM_TITLE, SENIOR_ID, SHOW_FLAG, SYS_ID, URL, NAV_VIEW, WIDTH, HEIGHT)
values (19053, '组织架构', 3, 0, 0, '组织架构', null, 'structure', '组织架构', 1905, 1, 11, null, 'view/screen/basisdata/structure', null, null);
