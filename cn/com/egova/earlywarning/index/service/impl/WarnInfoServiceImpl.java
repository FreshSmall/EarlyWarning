package cn.com.egova.earlywarning.index.service.impl;

import cn.com.egova.bizbase.rec.dao.RecDao;
import cn.com.egova.bizbase.rec.mapping.Rec;
import cn.com.egova.earlywarning.index.service.WarnInfoService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WarnInfoServiceImpl implements WarnInfoService{

    static Logger logger = Logger.getLogger(WarnInfoServiceImpl.class);

    @Autowired
    private RecDao recDao;

    @Override
    public void findAllWarnInfo() {
        long recid=10;
        Rec rec=recDao.findById(recid);
        System.out.println(rec.getAddress());
    }

    @Override
    public void saveRecWarnInfo(Rec rec) {
        recDao.save(rec);
    }
}
