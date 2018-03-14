-- 2017-07-17 chenshichang 增加监督指挥系统菜单
DELETE FROM tc_human_nav_item WHERE nav_item_id IN ( SELECT nav_item_id FROM tc_nav_item WHERE sys_id = 11 );
DELETE FROM tc_role_nav_item WHERE nav_item_id IN ( SELECT nav_item_id FROM tc_nav_item WHERE sys_id = 11 );
DELETE FROM tc_nav_item WHERE sys_id = 11;
UPDATE tc_nav_item SET nav_view = '', url = 'screen.htm' WHERE nav_item_id = 19;
INSERT INTO tc_nav_item (`height`, `width`, `max_flag`, `nav_item_id`, `display_name`, `display_order`, `modal_flag`, `nav_item_desc`, `nav_item_icon`, `nav_item_name`, `nav_item_title`, `senior_id`, `sys_id`, `url`, `nav_view`, `show_flag`) VALUES (NULL, NULL, '0', '1901', '首页', '1', '0', '首页', '0 0', 'home', '首页', '0', '11', NULL, 'view/screen/desktop/home', '1');
INSERT INTO tc_nav_item (`height`, `width`, `max_flag`, `nav_item_id`, `display_name`, `display_order`, `modal_flag`, `nav_item_desc`, `nav_item_icon`, `nav_item_name`, `nav_item_title`, `senior_id`, `sys_id`, `url`, `nav_view`, `show_flag`) VALUES (NULL, '400', '0', '1902', '监督员', '2', '0', '监督员', '-32 0', 'humandynamic', '监督员', '0', '11', NULL, 'view/screen/humandynamic/humanregion', '1');
INSERT INTO tc_nav_item (`height`, `width`, `max_flag`, `nav_item_id`, `display_name`, `display_order`, `modal_flag`, `nav_item_desc`, `nav_item_icon`, `nav_item_name`, `nav_item_title`, `senior_id`, `sys_id`, `url`, `nav_view`, `show_flag`) VALUES (NULL, '400', '0', '1903', '案件流程', '3', '0', '案件流程', '-64 0', 'recdynamic', '案件流程', '0', '11', NULL, 'view/screen/recdynamic/process', '1');
INSERT INTO tc_nav_item (`height`, `width`, `max_flag`, `nav_item_id`, `display_name`, `display_order`, `modal_flag`, `nav_item_desc`, `nav_item_icon`, `nav_item_name`, `nav_item_title`, `senior_id`, `sys_id`, `url`, `nav_view`, `show_flag`) VALUES (NULL, NULL, '0', '1904', '综合评价', '4', '0', '综合评价', '-96 0', 'evaluation', '综合评价', '0', '11', NULL, 'view/screen/evaluation/evaluation', '1');
INSERT INTO tc_nav_item (`height`, `width`, `max_flag`, `nav_item_id`, `display_name`, `display_order`, `modal_flag`, `nav_item_desc`, `nav_item_icon`, `nav_item_name`, `nav_item_title`, `senior_id`, `sys_id`, `url`, `nav_view`, `show_flag`) VALUES (NULL, NULL, '0', '1905', '基础数据', '5', '0', '基础数据', '-128 0', 'basisdata', '基础数据', '0', '11', NULL, NULL, '1');
INSERT INTO tc_nav_item (`height`, `width`, `max_flag`, `nav_item_id`, `display_name`, `display_order`, `modal_flag`, `nav_item_desc`, `nav_item_icon`, `nav_item_name`, `nav_item_title`, `senior_id`, `sys_id`, `url`, `nav_view`, `show_flag`) VALUES ('550', '350', '0', '1906', '视频监控', '6', '0', '视频监控', '-160 0', 'videomonitor', '视频监控', '0', '11', NULL, 'view/screen/video/videomonitor', '1');
INSERT INTO tc_nav_item (`height`, `width`, `max_flag`, `nav_item_id`, `display_name`, `display_order`, `modal_flag`, `nav_item_desc`, `nav_item_icon`, `nav_item_name`, `nav_item_title`, `senior_id`, `sys_id`, `url`, `nav_view`, `show_flag`) VALUES ('550', '350', '0', '1907', '车辆监控', '7', '0', '车辆监控', '-192 0', 'vehicle', '车辆监控', '0', '11', NULL, 'view/screen/vehicle/vehicle', '1');
INSERT INTO tc_nav_item (`height`, `width`, `max_flag`, `nav_item_id`, `display_name`, `display_order`, `modal_flag`, `nav_item_desc`, `nav_item_icon`, `nav_item_name`, `nav_item_title`, `senior_id`, `sys_id`, `url`, `nav_view`, `show_flag`) VALUES ('500', '450', '0', '19051', '普查成果', '1', NULL, '普查成果', NULL, 'census', '普查成果', '1905', '11', NULL, 'view/screen/basisdata/census', '1');
INSERT INTO tc_nav_item (`height`, `width`, `max_flag`, `nav_item_id`, `display_name`, `display_order`, `modal_flag`, `nav_item_desc`, `nav_item_icon`, `nav_item_name`, `nav_item_title`, `senior_id`, `sys_id`, `url`, `nav_view`, `show_flag`) VALUES ('500', '450', '0', '19052', '部件分析', '2', NULL, '部件分析', NULL, 'part', '部件分析', '1905', '11', NULL, 'view/screen/basisdata/part', '1');
INSERT INTO tc_nav_item (`height`, `width`, `max_flag`, `nav_item_id`, `display_name`, `display_order`, `modal_flag`, `nav_item_desc`, `nav_item_icon`, `nav_item_name`, `nav_item_title`, `senior_id`, `sys_id`, `url`, `nav_view`, `show_flag`) VALUES (NULL, NULL, '0', '19053', '组织架构', '3', NULL, '组织架构', NULL, 'structure', '组织架构', '1905', '11', NULL, 'view/screen/basisdata/structure', '1');