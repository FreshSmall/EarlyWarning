package cn.com.egova.earlywarning.index.web;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.com.egova.earlywarning.index.service.WarnInfoService;
import com.fasterxml.jackson.databind.annotation.JsonAppend;
import net.sf.json.JSONObject;

import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import cn.com.egova.base.bean.HumanSession;
import cn.com.egova.base.bean.ResultInfo;
import cn.com.egova.base.biztools.SessionUtils;
import cn.com.egova.bizbase.constant.ConfigItemNameConst;
import cn.com.egova.bizbase.mapping.Human;
import cn.com.egova.bizbase.mapping.LoginPageConfig;
import cn.com.egova.bizbase.service.HumanManager;
import cn.com.egova.bizbase.tools.SysConfigUtils;

/**
 * @author renweizhi
 *
 */
@Controller
public class EarlyWarningIndexController{




	public static Set<String> EURBAN_GLOBAL_STYLE = new HashSet<String>();
	static{
		EURBAN_GLOBAL_STYLE.add("blue");
		EURBAN_GLOBAL_STYLE.add("red");
		EURBAN_GLOBAL_STYLE.add("black");
		EURBAN_GLOBAL_STYLE.add("green");
		EURBAN_GLOBAL_STYLE.add("whiteblack");
		EURBAN_GLOBAL_STYLE.add("whiteblue");
		EURBAN_GLOBAL_STYLE.add("whitegreen");
		EURBAN_GLOBAL_STYLE.add("whitered");
	}

	@Autowired
	private HumanManager humanManager;
	@Autowired
	private WarnInfoService warnInfoService;

	private static final String EARLYWARNING_DESKTOP_VIEW = "earlywarning/main/main";
	private static final String EARLYWARNING_DEFAULT_VIEW = "earlywarning/desktop2/desktop";

	/**
	 * 大屏幕默认主页
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "earlywarning")
	public ModelAndView mainHandler(HttpServletRequest request, HttpServletResponse response, String style){
		if(style != null && !"".equals(style) && EURBAN_GLOBAL_STYLE.contains(style)){
			Cookie c = new Cookie("eUrbanGlobalStyle", style);
			// IE Cookie需要设置path，这里设为根路径
			c.setPath("/");
			response.addCookie(c);
		}
		warnInfoService.findAllWarnInfo();
		response.addCookie(new Cookie("eUrbanGlobalLogo", SysConfigUtils.getSysConfigStrValue(ConfigItemNameConst.COMMON_LOGO_NAME)));
		ModelAndView mo = new ModelAndView();
		LoginPageConfig loginPageConfig = new LoginPageConfig();
		String sysTitle = ServletRequestUtils.getStringParameter(request, "sysTitle", "预警指挥系统");
		String subTitle = ServletRequestUtils.getStringParameter(request, "subTitle", "Supervision And Command System");
		String modulePath = ServletRequestUtils.getStringParameter(request, "modulePath", EARLYWARNING_DEFAULT_VIEW);
		String theme = ServletRequestUtils.getStringParameter(request, "theme", "");
		String moduleParams = ServletRequestUtils.getStringParameter(request, "moduleParams", "");
		loginPageConfig.setTitle(sysTitle);
		loginPageConfig.setSubTitle(subTitle);
		mo.addObject("loginPageConfig", JSONObject.fromObject(loginPageConfig));
        mo.addObject("modulePath", modulePath);
        mo.addObject("theme", theme);
        mo.addObject("moduleParams", moduleParams);
        mo.setViewName(EARLYWARNING_DESKTOP_VIEW);
		return mo;
	}
	
	/**
	 * 从MIS进入大屏幕系统(需传入token验证)
	 * @param request
	 * @return
	 */
    @RequestMapping(value = "earlywarninglogonfrommis", method = RequestMethod.GET)
    public ModelAndView dashboardIndexHandler(HttpServletRequest request, HttpServletResponse response) {
    		String sysTitle = ServletRequestUtils.getStringParameter(request, "sysTitle", "预警指挥系统");
    		String subTitle = ServletRequestUtils.getStringParameter(request, "subTitle", "Supervision And Command System");
			String token = ServletRequestUtils.getStringParameter(request, "token", "");
			String modulePath = ServletRequestUtils.getStringParameter(request, "modulePath", EARLYWARNING_DEFAULT_VIEW);
			String theme = ServletRequestUtils.getStringParameter(request, "theme", "");
			String moduleParams = ServletRequestUtils.getStringParameter(request, "moduleParams", "");
	        ModelAndView mo = new ModelAndView();
	        LoginPageConfig loginPageConfig = new LoginPageConfig();
			loginPageConfig.setTitle(sysTitle);
			loginPageConfig.setSubTitle(subTitle);
			mo.addObject("loginPageConfig", JSONObject.fromObject(loginPageConfig));
	        mo.addObject("sysTitle", sysTitle);
	        mo.addObject("modulePath", modulePath);
	        mo.addObject("theme", theme);
	        mo.addObject("token", token);
	        mo.addObject("moduleParams", moduleParams);
	        mo.setViewName(EARLYWARNING_DESKTOP_VIEW);
	        return mo;
    }

	/**
	 * 传入humanID直接跳转到预警指挥系统
	 * 
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "earlywarninglogonbyhumanid", method = RequestMethod.GET)
	public ModelAndView logonFromMisHandler(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Human human = null;
		int humanID = ServletRequestUtils.getIntParameter(request, "humanID", -1);
		if(humanID != -1){
			human = humanManager.getHumanByID(Integer.valueOf(humanID));
		}
		ResultInfo result = new ResultInfo();
		HumanSession humanInfo = null;
		if(null == human){
			result.setMessage("用户名或密码错误！请重新登录！");
		}else{
			result.setSuccess(true);
			String style = ServletRequestUtils.getStringParameter(request,
					"style", "");
			if(!"".equals(style))response.addCookie(new Cookie("eUrbanGlobalStyle", style));
			humanInfo = new HumanSession();
			BeanUtils.copyProperties(humanInfo, human);
			SessionUtils.logon(request, humanInfo);
			//检测是否需要更新该人员的权限
			if(SysConfigUtils.getSysConfigBoolValue("MIS_LOGIN_UPDATE_HUMAN_RIGHT") && human.getRightUpdateFlag() > 0){	
				List<Human> humanList = new ArrayList<Human>();
				humanList.add(human);
				humanManager.updateHumanRights(humanList,true,true);  
			}
		}
		ModelAndView mo = new ModelAndView();
		if (!result.isSuccess()) {
			mo.setViewName("exception/message");
			mo.addObject("resultInfo", result);
		} else {
    		String sysTitle = ServletRequestUtils.getStringParameter(request, "sysTitle", "预警指挥系统");
    		String subTitle = ServletRequestUtils.getStringParameter(request, "subTitle", "Supervision And Command System");
    		String modulePath = ServletRequestUtils.getStringParameter(request, "modulePath", EARLYWARNING_DEFAULT_VIEW);
    		String theme = ServletRequestUtils.getStringParameter(request, "theme", "");
			String moduleParams = ServletRequestUtils.getStringParameter(request, "moduleParams", "");
	        LoginPageConfig loginPageConfig = new LoginPageConfig();
			loginPageConfig.setTitle(sysTitle);
			loginPageConfig.setSubTitle(subTitle);
			mo.addObject("loginPageConfig", JSONObject.fromObject(loginPageConfig));
	        mo.addObject("sysTitle", sysTitle);
	        mo.addObject("modulePath", modulePath);
	        mo.addObject("theme", theme);
	        mo.addObject("moduleParams", moduleParams);
	        mo.setViewName(EARLYWARNING_DESKTOP_VIEW);
		}
		return mo;
	}
}
