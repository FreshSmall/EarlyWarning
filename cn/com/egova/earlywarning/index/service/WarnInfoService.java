package cn.com.egova.earlywarning.index.service;


import cn.com.egova.bizbase.rec.mapping.Rec;

public interface WarnInfoService {

    //获取预警平台的基本信息
    void findAllWarnInfo();

    //保存达到了预警级别的案件信息
    void saveRecWarnInfo(Rec recWarn);
}
