define(["jquery", "i18nCommon", "date"], function ($, i18n, dateUtils) {
    var self, StatisUtils;

    var StatisUtils = {
        getConditionIdsFor: function (statID) {
            var results = [];
            $.ajax({
                url: "home/statcfg/evalconfig/getcondition",
                data: {queryID: statID},
                async: false
            }).done(function (data) {
                for (var index in data) {
                    results.push({fieldDisplayName: data[index].fieldDispName, condID: data[index].id.condID});
                }
            });
            return results;
        },
        getQueryPeriod: function (periodType) {
            var period = {};
            if (periodType == 'currentYear') {
                // 当年
                period.startTime = dateUtils.formatTimestamp(new Date(), "yyyy") + "-01-01 00:00:00";
                period.endTime = dateUtils.formatTimestamp(new Date(), "yyyy-MM-dd") + " 23:59:59";
            } else if (periodType == 'currentMonth') {
                // 当月
                period.startTime = dateUtils.formatTimestamp(new Date(), "yyyy-MM") + "-01 00:00:00";
                period.endTime = dateUtils.formatTimestamp(new Date(), "yyyy-MM-dd") + " 23:59:59";
            } else {
                // 默认为日
                period.startTime = dateUtils.formatTimestamp(new Date(), "yyyy-MM-dd") + " 00:00:00";
                period.endTime = dateUtils.formatTimestamp(new Date(), "yyyy-MM-dd") + " 23:59:59";
            }
            return period;
        },
        generateCondParamForReportTime: function (conditionMap, startTime, endTime) {
            var conditionIDForTime;
            for (var inx in conditionMap) {
                var obj = conditionMap[inx];
                if (obj.fieldDisplayName == '上报时间' || obj.fieldDisplayName == '处置截止时间')
                    conditionIDForTime = obj.condID;
            }

            if (conditionIDForTime == undefined)
                throw '统计配置缺少上报时间查询条件';

            return {
                condId: conditionIDForTime,
                compType: '介于',
                condProperty: '0',
                dataTypeID: '11',
                fieldName: 'create_time',
                outParams: '',
                values: [startTime, endTime]
            };
        },
        generateCondParamForBelongedRegion: function (conditionMap, regionID, regionType) {
            var conditionIDForRegion;
            for (var inx in conditionMap) {
                var obj = conditionMap[inx];
                if (obj.fieldDisplayName == '所属区域')
                    conditionIDForRegion = obj.condID;
            }

            if (conditionIDForRegion == undefined)
                throw '统计配置缺少所属区域查询条件';

            var filterVal = "0:" + regionID;
            if (regionType != 1) {
                filterVal = "1:" + regionID;
            }

            return {
                condId: conditionIDForRegion,
                compType: '等于',
                condProperty: '0',
                dataTypeID: '126',
                fieldName: 'district_name',
                outParams: '',
                fieldTypeInfo: "(district_id in ({1}) or street_id in ({2}) or community_id in ({3}))",
                values: [filterVal]
            };
        },
        constructCondParamForCurrentMonthOnReportTime: function (statID) {
            var conditions = this.getConditionIdsFor(statID);
            var period = this.getQueryPeriod('currentMonth');
            return [this.generateCondParamForReportTime(conditions, period.startTime, period.endTime)];
        },
        constructCondParamOnReportTime: function (statID, periodType) {
            var conditions = this.getConditionIdsFor(statID);
            var period = this.getQueryPeriod(periodType);
            return [this.generateCondParamForReportTime(conditions, period.startTime, period.endTime)];
        }
    };
    
    return StatisUtils;
});
