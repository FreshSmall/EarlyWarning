package cn.com.egova.earlywarning.index.web;

import cn.com.egova.earlywarning.index.service.WarnInfoService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.*;


/**
 * 向前端界面主动推送相关的预警信息
 */
@ServerEndpoint("/websocket/{humanID}")
public class WarnInfoWebSocket {

    private static Log logger= LogFactory.getLog(WarnInfoWebSocket.class);

    //与某个客户端的连接会话，通过该会话来给客户端发送数据
    private Session session;

    //静态变量，用来记录websocket的在线连接数量
    private static volatile int onCount;

    //用来记录每个用户的连接
    private static HashMap<Integer,Set<WarnInfoWebSocket>> userMap=new HashMap();

    //记录用户的ID
    private static int humanID;

    @Autowired
    private WarnInfoService warnInfoService;

    /**
     * 连接建立成功调用的方法
     * @param session  可选的参数。session为与某个客户端的连接会话，需要通过它来给客户端发送数据
     */
    @OnOpen
    public void onOpen(@PathParam("humanID")int humanID,Session session){
        this.session=session;
        this.humanID=humanID;
        onCount++;
        if(userMap.containsKey(humanID)){
            userMap.get(humanID).add(this);
        }else{
            Set<WarnInfoWebSocket> userSet=new HashSet<>();
            userSet.add(this);
            userMap.put(humanID,userSet);
        }
        logger.info("webSocket客户端建立了连接！目前的连接数="+onCount);
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose(){
        if (userMap.get(humanID).size()==0){
            userMap.remove(humanID);
        }else {
            userMap.get(humanID).remove(this);
        }
        onCount--;
        logger.info("该webSocket客户端下线！目前的连接数="+onCount);
    }

    /**
     * 收到客户端消息后调用的方法
     * @param message 客户端发送过来的消息
     */
    @OnMessage
    public static void onMessage(String message){
        Iterator it=userMap.entrySet().iterator();
        while (it.hasNext()){
            Map.Entry entry=(Map.Entry) it.next();
            int humanID=(int) entry.getKey();
            Set<WarnInfoWebSocket> set=(Set<WarnInfoWebSocket>)entry.getValue();
            for (WarnInfoWebSocket myHandler:set){
                try {
                    myHandler.session.getBasicRemote().sendText(message);
                    logger.info("用户ID为"+humanID+"已经接受到数据！");
                } catch (IOException e) {
                    logger.error("webSocket服务端发送数据失败，错误类型"+e);
                }
            }
        }

    }

    /**
     * 发生错误时调用
     * @param session
     * @param error
     */
    @OnError
    public void onError(Session session, Throwable error){
        logger.error("连接出错，错误类型是："+error);
    }



}
