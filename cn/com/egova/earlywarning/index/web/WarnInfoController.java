package cn.com.egova.earlywarning.index.web;

import cn.com.egova.bizbase.rec.mapping.Rec;
import cn.com.egova.earlywarning.index.service.WarnInfoService;
import cn.com.egova.earlywarning.index.util.EstimateWarnInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 *接收第三方传送的数据
 */
@Controller
public class WarnInfoController {

    @Autowired
    private WarnInfoService warnInfoService;

    @RequestMapping("/egova/api/reveiveInfo")
    public void receiveWarnInfoHandler(){
        //获取第三方公司的预警数据；
        Rec recWarn=new Rec();
        recWarn.setRecID(100l);
        recWarn.setAddress("昆明市政指挥中心");
        recWarn.setBizID(32);
        recWarn.setBizName("昆明预警指挥调度");
        recWarn.setEventSrcID(11);
        recWarn.setEventSrcName("社会公众举报");
        recWarn.setNewInstCondName("塌陷最深处深度达到1m及以上塌陷面积达到20m²以上");
        //将案卷数据做一个研判
        boolean flag= EstimateWarnInfo.warnInfoHandler(recWarn);
        if(flag){//案件信息达到了预警级别
            warnInfoService.saveRecWarnInfo(recWarn);
            //通过webSocket协议向前端发送通知
            WarnInfoWebSocket.onMessage(recWarn.getNewInstCondName());
        }

    }

}
