define(["jquery", "echarts", "echartstheme1", "echartstheme2", "echartsliquidfill", "highcharts", "highcharts3d", "highchartsMore", "funnel"], function ($, echarts) {
    var self;
    var Charts, ChartsUtils;

    Charts = function (container, data, settings) {
        self = this;
        self.container = container && $(container);
        self.data = data;
        settings && (settings.grid = $.extend({}, Charts.defaultSettings.grid, settings.grid));
        self.settings = $.extend({}, Charts.defaultSettings, settings);

        self.init();
    };

    Charts.defaultSettings = {
        colors: ["#14b8d4", "#ff634d", "#ffaa3d", "#017bce", "#4db159", "#9276bf"],
        colorsGradient: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)', 'rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
        valueSuffix: '',
        showTooltip: false,
        titleX: 'center',
        titleY: 'top',
        legendOrient: 'horizontal',
        legendX: 'center',
        legendY: 'top',
        legendAlign: 'auto',
        grid: {
            containLabel: true,
            left: 5,
            top: 15,
            right: 5,
            bottom: 5
        },
        axisLabelInterval: 'auto',//自动隐藏显示不下的类目，设置为0则强制全部显示
        axisLabelRotate: '0',

        // 饼图
        pieCenter: ['50%', '50%'],
        pieRadius: ['65%', '85%'],
        pieLabelShow: false,

        // 条形图
        axisInverse: false,
        barShadowColor: 'none',
        barBorderRadius: 10,
        barMaxWidth: 20,
        barAxisLabelShow: true,
        barSeriesValueShow: false,

        // 雷达图
        radarShape: 'polygon',
        radarRadius: '65%',
        radarTextColor: '#60696f',
        radarSplitAreaColor: '#f6fbff',
        radarAxisLineColor: '#7bc2ff',
        radarItemStyleColor: '#fc6956',
        radarLineStyleColor: '#cd4533',
        radarAreaStyleColor: '#f2b4b7',

        // 时间线
        timelineAxisType: 'time',
        timelineOrient: 'horizontal',
        timelineInverse: false,
        timelineAutoPlay: true,
        timelinePlayInterval: 2000,
    };

    Charts.prototype.init = function () {
        self.container.empty();
        self.containerElement = $("<div style='position:relative;width:100%;height:100%;'></div>");
        self.noDataElement = $(
            "<div class='height-100 width-100' style='display:flex;flex-direction:column;justify-content:center;text-align:center;'>" +
            "   <div style='font-size:16px;'>无数据</div>" +
            "</div>"
        );
        self.chartElement = $("<div class='height-100 width-100'></div>");

        if (self.container) {
            if (self.data == null || typeof (self.data) == "undefined") {
                self.containerElement.append(self.noDataElement);
            } else {
                self.containerElement.append(self.chartElement);
            }
            self.container.append(self.containerElement);
        }
        self.chart = echarts.init(self.chartElement[0], eUrban.global.screenTheme);
    };

    /**
     * 数据格式
     * {
     *      title: "title",
     *      subTitle: "subTitle",
     *      legendData: ["legend1", "legend2", ...],
     *      series: [
     *          { seriesData: [{ name: "name1", value: value1 }, { name: "name2", value: value2 }, ...] },
     *          { seriesData: [{ name: "name1", value: value1 }, { name: "name2", value: value2 }, ...] },
     *          ...
     *      ]
     * }
     */
    Charts.prototype.pie = function (data) {
        var series = [];
        if (data.series && data.series.length > 0) {
            if (data.series.length === 1) {
                series.push({
                    type: 'pie',
                    radius: self.settings.pieRadius,
                    label: {
                        normal: {
                            show: self.settings.pieLabelShow
                        }
                    },
                    center: self.settings.pieCenter,
                    data: data.series[0].seriesData
                });
            } else if (data.series.length === 2) {
                series.push({
                    type: 'pie',
                    radius: ['0', '45%'],
                    label: {
                        normal: {
                            show: self.settings.pieLabelShow
                        }
                    },
                    center: self.settings.pieCenter,
                    data: data.series[0].seriesData
                });
                series.push({
                    type: 'pie',
                    radius: ['65%', '85%'],
                    label: {
                        normal: {
                            show: self.settings.pieLabelShow
                        }
                    },
                    center: self.settings.pieCenter,
                    data: data.series[1].seriesData
                });
            }
        }

        var option = {
            tooltip: {
                trigger: 'item',
                show: self.settings.showTooltip
            },
            grid: self.settings.grid,
            color: self.settings.colors,
            series: series
        };

        if (data.title) {
            option.title = {
                text: data.title,
                subtext: data.subTitle,
                itemGap: 2,
                x: self.settings.titleX,
                y: self.settings.titleY,
                textAlign: 'center',
                textBaseline: 'middle'
            };
        }
        if (data.legendData && data.legendData.length > 0) {
            option.legend = {
                show: true,
                data: data.legendData,
                orient: self.settings.legendOrient,
                x: self.settings.legendX,
                y: self.settings.legendY,
                itemGap: self.settings.legendItemGap || 5,
                itemWidth: self.settings.legendItemWidth || 15,
                itemHeight: self.settings.legendItemHeight || 14,
                align: self.settings.legendAlign
            };
        }
        self.chart.setOption(option);
    };

    /**
     * 数据格式
     * {
     *      title: "title",
     *      subTitle: "subTitle",
     *      legendData: ["legend1", "legend2", ...],
     *      categories: ["categories1", "categories2", ...],
     *      series: [
     *          { name: name1, data: [value1, value2, ...] },
     *          { name: name1, data: [value1, value2, ...] },
     *          ...
     *      ]
     * }
     */
    Charts.prototype.bar = function (data) {
        var series = data.series;
        if (series.length === 1) {
            series[0].type = "bar";
            series[0].barMaxWidth = self.settings.barMaxWidth;
            series[0].label = {
                normal: {
                    position: 'right',
                    show: self.settings.barSeriesValueShow,
                    formatter: '{c}' + self.settings.valueSuffix
                }
            };
            series[0].itemStyle = {
                normal: {
                    color: function (param) {
                        var resultColor = self.settings.colors[param.dataIndex % self.settings.colors.length];
                        if (self.settings.linearGradient) {
                            resultColor = new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: self.settings.colorsGradient[param.dataIndex]
                            }, {
                                offset: 1,
                                color: self.settings.colors[param.dataIndex]
                            }]);
                        }
                        return resultColor;
                    },
                    barBorderRadius: self.settings.barBorderRadius
                }
            };

            // 是否加阴影
            if (self.settings.barShadowColor !== "none") {
                var maxValue = 0;
                series[0].data.forEach(function (value) {
                    (maxValue < value) && (maxValue = value);
                });
                maxValue = maxValue * 1.2;
                var dataShadow = [];
                series[0].data.forEach(function (value) {
                    dataShadow.push(maxValue);
                });
                data.series.unshift({
                    type: 'bar',
                    name: series[0].name,
                    barMaxWidth: self.settings.barMaxWidth,
                    itemStyle: {
                        normal: {
                            barBorderRadius: self.settings.barBorderRadius,
                            color: self.settings.barShadowColor
                        }
                    },
                    barGap: '-100%',
                    barCategoryGap: '50%',
                    data: dataShadow,
                    animation: false
                });
            }
        } else {
            $.each(series, function (index, item) {
                item.type = "bar";
                item.stack = "总量";
            })
        }

        var option = {
            tooltip: {
                show: self.settings.showTooltip,
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: self.settings.grid,
            color: self.settings.colors,
            xAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false,
                    formatter: '{value}' + self.settings.valueSuffix
                },
                splitLine: {
                    show: false
                },
                inverse: self.settings.axisInverse
            },
            yAxis: {
                type: 'category',
                data: data.categories,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: self.settings.barAxisLabelShow
                }
            },
            series: data.series
        }

        if (data.title) {
            option.title = {
                text: data.title,
                subtext: data.subTitle,
                itemGap: 2,
                x: self.settings.titleX,
                y: self.settings.titleY
            };
            option.grid.top = 60;
        }
        if (data.legendData && data.legendData.length > 0) {
            option.legend = {
                show: true,
                data: data.legendData,
                orient: self.settings.legendOrient,
                x: self.settings.legendX,
                y: self.settings.legendY,
                align: self.settings.legendAlign
            };
        }
        // tooltip 去除阴影
        if (self.settings.barShadowColor !== "none") {
            option.tooltip.formatter = '{b1}<br />{a}: {c1}';
        }
        self.chart.setOption(option);
    };

    /**
     * 数据格式
     * {
     *      title: "title",
     *      subTitle: "subTitle",
     *      legendData: ["legend1", "legend2", ...],
     *      categories: ["categories1", "categories2", ...],
     *      series: [
     *          { name: name1, data: [value1, value2, ...] },
     *          { name: name1, data: [value1, value2, ...] },
     *          ...
     *      ]
     * }
     */
    Charts.prototype.barCompare = function (data) {
        var option = {
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    return '<b>' + params[0].name + '</b><br/>' +
                        params[0].seriesName + ':' + Math.abs(params[0].value) + '<br/>' +
                        params[1].seriesName + ':' + Math.abs(params[1].value);
                },
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                containLabel: true
            },
            color: self.settings.colors,
            xAxis: [
                {
                    type: 'value',
                    axisTick: { show: false },
                    axisLine: { show: false },
                    splitLine: { show: false },
                    axisLabel: {
                        show: false,
                        formatter: function (value, index) {
                            return Math.abs(value);
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    axisTick: { show: false },
                    axisLine: { show: false },
                    data: data.categories
                }
            ],
            series: [
                {
                    name: data.series[0].name,
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true
                        }
                    },
                    data: data.series[0].data
                },
                {
                    name: data.series[1].name,
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true
                        }
                    },
                    data: data.series[1].data
                }
            ]
        };

        if (data.title) {
            option.title = {
                text: data.title,
                subtext: data.subTitle,
                itemGap: 2,
                x: self.settings.titleX,
                y: self.settings.titleY
            };
        }
        if (data.legendData && data.legendData.length > 0) {
            option.legend = {
                show: true,
                data: data.legendData,
                orient: self.settings.legendOrient,
                x: self.settings.legendX,
                y: self.settings.legendY,
                align: self.settings.legendAlign
            };
        }
        self.chart.setOption(option);
    };

    /**
     * 数据格式
     * {
     *      title: "title",
     *      subTitle: "subTitle",
     *      legendData: ["legend1", "legend2", ...],
     *      categories: ["categories1", "categories2", ...],
     *      series: [
     *          { name: name1, data: [value1, value2, ...] },
     *          { name: name1, data: [value1, value2, ...] },
     *          ...
     *      ]
     * }
     */
    Charts.prototype.lineOrColumn = function (data) {
        if (data.series.length == 1 && data.series[0].type == "bar") {
            data.series[0].barMaxWidth = self.settings.barMaxWidth;
            data.series[0].label = {
                normal: {
                    position: 'top',
                    show: self.settings.barSeriesValueShow
                }
            };
            data.series[0].itemStyle = {
                normal: {
                    color: function (param) {
                        var resultColor = self.settings.colors[param.dataIndex % self.settings.colors.length];
                        if (self.settings.linearGradient) {
                            resultColor = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: self.settings.colorsGradient[param.dataIndex % self.settings.colors.length]
                            }, {
                                offset: 1,
                                color: self.settings.colors[param.dataIndex % self.settings.colors.length]
                            }]);
                        }
                        return resultColor;
                    },
                    barBorderRadius: self.settings.barBorderRadius
                }
            };
        }
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            grid: self.settings.grid,
            color: self.settings.colors,
            xAxis: {
                type: 'category',
                axisLabel: {
                    interval: self.settings.axisLabelInterval,
                    rotate: self.settings.axisLabelRotate
                },
                data: data.categories
            },
            yAxis: {
                type: 'value'
            },
            series: data.series
        };


        if (data.title) {
            option.title = {
                text: data.title,
                subtext: data.subTitle,
                itemGap: 2,
                x: self.settings.titleX,
                y: self.settings.titleY
            };
            option.grid.top = 60;
        }
        if (data.legendData && data.legendData.length > 0) {
            option.legend = {
                show: true,
                data: data.legendData,
                orient: self.settings.legendOrient,
                x: self.settings.legendX,
                y: self.settings.legendY,
                align: self.settings.legendAlign
            };
        }
        self.chart.setOption(option);
    };

    /**
     * 数据格式
     * {
     *      title: "title",
     *      subTitle: "subTitle",
     *      seriesName: "seriesName",
     *      seriesData: [{ name: "name1", value: value1 }, { name: "name2", value: value2 }, ...]
     * }
     */
    Charts.prototype.dashboard = function (data) {
        var option = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            color: self.settings.colors,
            series: [{
                name: data.seriesName,
                type: 'gauge',
                radius: '90%',
                startAngle: 180,
                endAngle: 0,
                min: 0,
                max: 100,
                precision: 0,
                splitNumber: 5,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: [[0.2, '#ec5563'], [0.4, '#ed8e5f'], [0.6, '#edcf5c'], [0.8, '#41c2ea'], [1.0, '#46c3ac']],
                        width: 30
                    }
                },
                axisTick: {
                    show: true,
                    splitNumber: 1,
                    length: 8,
                    lineStyle: {
                        color: '#b5def6',
                        width: 1,
                        type: 'solid'
                    }
                },
                axisLabel: {
                    show: true,
                    formatter: function (v) {
                        switch (v + '') {
                            case '0': return '0';
                            case '20': return '20%';
                            case '40': return '40%';
                            case '60': return '60%';
                            case '80': return '80%';
                            case '100': return '100%';
                            default: return '';
                        }
                    }
                },
                splitLine: {
                    show: true,
                    length: 30,
                    lineStyle: {
                        color: '#eee',
                        width: 2,
                        type: 'solid'
                    }
                },
                pointer: {
                    length: '80%',
                    width: 5,
                    color: '#b5def6'
                },
                title: {
                    show: true,
                    offsetCenter: [0, 22]
                },
                detail: {
                    formatter: '{value}%'
                },
                data: data.seriesData
            }]
        };

        if (data.title) {
            option.title = {
                text: data.title,
                subtext: data.subTitle,
                itemGap: 2,
                x: self.settings.titleX,
                y: self.settings.titleY
            };
        }
        self.chart.setOption(option);
    };

    /**
     * 数据格式
     * {
     *      title: "title",
     *      subTitle: "subTitle",
     *      legendData: ["legend1", "legend2", ...],
     *      seriesName: "seriesName",
     *      seriesData: [{ name: "name1", value: value1 }, { name: "name2", value: value2 }, ...]
     * }
     */
    Charts.prototype.rose = function (data) {
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            color: self.settings.colors,
            series: [
                {
                    name: data.seriesName,
                    type: 'pie',
                    radius: [0, '75%'],
                    center: ['50%', '50%'],
                    roseType: 'radius',
                    width: '40%',       // for funnel
                    max: 40,            // for funnel
                    itemStyle: {
                        normal: {
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        },
                        emphasis: {
                            label: {
                                show: true
                            },
                            labelLine: {
                                show: true
                            }
                        }
                    },
                    data: data.seriesData
                }
            ]
        };

        if (data.title) {
            option.title = {
                text: data.title,
                subtext: data.subTitle,
                itemGap: 2,
                x: self.settings.titleX,
                y: self.settings.titleY
            };
        }
        if (data.legendData && data.legendData.length > 0) {
            option.legend = {
                show: true,
                data: data.legendData,
                orient: self.settings.legendOrient,
                x: self.settings.legendX,
                y: self.settings.legendY,
                align: self.settings.legendAlign
            };
        }
        self.chart.setOption(option);
    };

    /**
     * 数据格式
     * {
     *      title: "title",
     *      subTitle: "subTitle",
     *      seriesData: [ value1, value2, ...]
     * }
     */
    Charts.prototype.liquidfill = function (data) {
        if (data.seriesData && data.seriesData.length === 1) {
            var temp = 0.25;
            while (temp < data.seriesData[0]) {
                data.seriesData.splice(1, 0, temp);
                temp += 0.25;
            }
        }
        var option = {
            series: [{
                type: 'liquidFill',
                radius: '80%',
                waveAnimation: true, // 设置左右波动
                animationDuration: 0, // 初始动画时长
                animationDurationUpdate: 0, // 更新动画时长
                data: data.seriesData,
                label: {
                    normal: {
                        textStyle: {
                            fontSize: 15
                        }
                    }
                },
                outline: {
                    show: false
                }
            }]
        };

        if (data.title) {
            option.title = {
                text: data.title,
                subtext: data.subTitle,
                itemGap: 2,
                x: self.settings.titleX,
                y: self.settings.titleY
            };
            option.series[0].radius = '70%';
            option.series[0].center = ['50%', '60%'];
        }
        self.chart.setOption(option);
    };

    /**
     * 数据格式
     * {
     *      title: "title",
     *      subTitle: "subTitle",
     *      legendData: ["legend1", "legend2", ...],
     *      indicator: ["indicator1", "indicator2", ...],
     *      seriesName: "seriesName",
     *      seriesData: [
     *          { name: name1, value: [value1, value2, ...] },
     *          { name: name1, value: [value1, value2, ...] },
     *          ...
     *      ]
     * }
     */
    Charts.prototype.radar = function (data) {
        var option = {
            tooltip: {},
            grid: self.settings.grid,
            color: self.settings.colors,
            radar: {
                shape: self.settings.radarShape,
                splitNumber: data.splitNumber || 5,
                name: {
                    textStyle: {
                        color: self.settings.radarTextColor
                    }
                },
                axisLabel: {
                    show: true,
                    formatter: function (value, index) {
                        // 只显示最大值
                        var splitNumber = data.splitNumber || 5;
                        if (index == splitNumber) {
                            return value;
                        } else {
                            return "";
                        }
                    }
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: self.settings.radarSplitAreaColor
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: self.settings.radarAxisLineColor
                    }
                },
                radius: self.settings.radarRadius,
                indicator: data.indicator
            },
            series: [{
                name: data.seriesName,
                type: 'radar',
                data: data.seriesData,
                itemStyle: {
                    normal: {
                        color: self.settings.radarItemStyleColor
                    }
                },
                lineStyle: {
                    normal: {
                        width: 1,
                        color: self.settings.radarLineStyleColor
                    }
                },
                areaStyle: {
                    normal: {
                        color: self.settings.radarAreaStyleColor
                    }
                }
            }]
        };

        if (data.title) {
            option.title = {
                text: data.title,
                subtext: data.subTitle,
                itemGap: 2,
                x: self.settings.titleX,
                y: self.settings.titleY
            };
            option.grid.top = 60;
        }
        if (data.legendData && data.legendData.length > 0) {
            option.legend = {
                show: true,
                data: data.legendData,
                orient: self.settings.legendOrient,
                x: self.settings.legendX,
                y: self.settings.legendY,
                align: self.settings.legendAlign
            };
        }
        self.chart.setOption(option);
    }

    Charts.prototype.funnel = function (data) {
        var option = {
            chart: {
                type: 'funnel',
                marginRight: 100
            },
            title: {
                text: data.text,
                x: -50
            },
            color: self.settings.colors,
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b> ({point.y:,.0f})',
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        softConnector: true
                    },
                    neckWidth: '0%',
                    neckHeight: '0%'
                }
            },
            legend: {
                enabled: false
            },
            series: [{
                name: data.seriesName,
                data: data.seriesData
            }]
        };

        if (!(data.title || data.subtitle)) {
            option.chart.marginTop = 20;
        }

        self.chartElement.empty().highcharts(option);
    };

    Charts.prototype.pyramid = function (data) {
        var option = {
            chart: {
                type: 'pyramid',
                marginRight: 100
            },
            title: {
                text: 'Sales pyramid',
                x: -50
            },
            color: self.settings.colors,
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b> ({point.y:,.0f})',
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        softConnector: true
                    }
                }
            },
            legend: {
                enabled: false
            },
            series: [{
                name: 'Unique users',
                data: [
                    ['Website visits', 15654],
                    ['Downloads', 4064],
                    ['Requested price list', 1987],
                    ['Invoice sent', 976],
                    ['Finalized', 846]
                ]
            }]
        };

        if (!(data.title || data.subtitle)) {
            option.chart.marginTop = 20;
        }

        self.chartElement.empty().highcharts(option);
    };

    /**
     * 数据格式
     * {
     *      title: "title",
     *      subTitle: "subTitle",
     *      legendData: ["legend1", "legend2", ...],
     *      seriesData: [
     *          ["time1", value1, "name1", ...],
     *          ["time2", value2, "name2", ...],
     *          ...
     *      ]
     * }
     */
    Charts.prototype.themeRiver = function (data) {
        var option = {
            tooltip: {
                trigger: 'axis',
            },
            color: self.settings.colors,
            singleAxis: {
                type: 'time',
                left: self.settings.grid.left,
                top: self.settings.grid.top,
                right: self.settings.grid.right,
                bottom: self.settings.grid.bottom,
                splitLine: {
                    show: true
                }
            },
            series: [{
                type: 'themeRiver',
                itemStyle: {
                    emphasis: {
                        shadowBlur: 20,
                        shadowColor: 'rgba(0, 0, 0, 0.8)'
                    }
                },
                data: data.seriesData
            }]
        };

        if (data.title) {
            option.title = {
                text: data.title,
                subtext: data.subTitle,
                itemGap: 2,
                x: self.settings.titleX,
                y: self.settings.titleY
            };
        }
        if (data.legendData && data.legendData.length > 0) {
            option.legend = {
                show: true,
                data: data.legendData,
                orient: self.settings.legendOrient,
                x: self.settings.legendX,
                y: self.settings.legendY,
                align: self.settings.legendAlign
            };
        }
        self.chart.setOption(option);
    };

    /**
     * 数据格式
     * {
     *      times: ["time1", "time2", "time3", ...]
     * }
     */
    Charts.prototype.timeline = function (data, callback) {
        var option = {
            baseOption: {
                color: self.settings.color,
                timeline: {
                    axisType: self.settings.timelineAxisType,
                    show: true,
                    orient: self.settings.timelineOrient,
                    inverse: self.settings.timelineInverse,
                    autoPlay: self.settings.timelineAutoPlay,
                    playInterval: self.settings.timelinePlayInterval,
                    containLabel: self.settings.grid.containLabel,
                    left: self.settings.grid.left,
                    top: self.settings.grid.top,
                    right: self.settings.grid.right,
                    bottom: self.settings.grid.bottom,
                    data: data.times
                },
                series: []
            },
            options: []
        };

        self.chart.setOption(option);

        self.chart.off('timelinechanged');
        self.chart.on('timelinechanged', function (params) {
            callback && typeof callback === 'function' && callback(params);
        });
    };

    ChartsUtils = {
        // 饼图
        pie: function (container, data, settings) {
            var chartUtil = new Charts(container, data, settings);
            if (data) {
                chartUtil.pie(data);
                $(window).resize(function () {
                    chartUtil.chart.resize();
                });
                return chartUtil.chart;
            } else {
                return null;
            }
        },
        // 折线图
        line: function (container, data, settings) {
            data && data.series.forEach(function (item) {
                item.type = "line";
                if (settings.areaMode) {
                    item.areaStyle = { normal: {} };
                }
            });
            var chartUtil = new Charts(container, data, settings);
            if (data) {
                chartUtil.lineOrColumn(data);
                $(window).resize(function () {
                    chartUtil.chart.resize();
                });
                return chartUtil.chart;
            } else {
                return null;
            }
        },
        // 柱状图
        column: function (container, data, settings) {
            data && data.series.forEach(function (item) {
                item.type = "bar";
            });
            var chartUtil = new Charts(container, data, settings);
            if (data) {
                if (settings.barBorderRadius === undefined) {
                    chartUtil.settings.barBorderRadius = 0;
                }
                chartUtil.lineOrColumn(data);
                $(window).resize(function () {
                    chartUtil.chart.resize();
                });
                return chartUtil.chart;
            } else {
                return null;
            }
        },
        // 一般条形图(含堆叠条形图)
        bar: function (container, data, settings) {
            var chartUtil = new Charts(container, data, settings);
            if (data) {
                chartUtil.bar(data);
                $(window).resize(function () {
                    chartUtil.chart.resize();
                });
                return chartUtil.chart;
            } else {
                return null;
            }
        },
        // 正反对比条形图
        barCompare: function (container, data, settings) {
            var chartUtil = new Charts(container, data, settings);
            if (data) {
                chartUtil.barCompare(data);
                $(window).resize(function () {
                    chartUtil.chart.resize();
                });
                return chartUtil.chart;
            } else {
                return null;
            }
        },
        // 仪表盘
        dashboard: function (container, data, settings) {
            var chartUtil = new Charts(container, data, settings);
            if (data) {
                chartUtil.dashboard(data);
                $(window).resize(function () {
                    chartUtil.chart.resize();
                });
                return chartUtil.chart;
            } else {
                return null;
            }
        },
        // 玫瑰图
        rose: function (container, data, settings) {
            var chartUtil = new Charts(container, data, settings);
            if (data) {
                chartUtil.rose(data);
                $(window).resize(function () {
                    chartUtil.chart.resize();
                });
                return chartUtil.chart;
            } else {
                return null;
            }
        },
        // 雷达图
        radar: function (container, data, settings) {
            var chartUtil = new Charts(container, data, settings);
            if (data) {
                chartUtil.radar(data);
                $(window).resize(function () {
                    chartUtil.chart.resize();
                });
                return chartUtil.chart;
            } else {
                return null;
            }
        },
        // 漏斗图
        funnel: function (container, data, settings) {
            var chartUtil = new Charts(container, data, settings);
            if (data) {
                chartUtil.funnel(data);
                $(window).resize(function () {
                    chartUtil.chart.resize();
                });
                return chartUtil.chart;
            } else {
                return null;
            }
        },
        // 金字塔图
        pyramid: function (container, data, settings) {
            var chartUtil = new Charts(container, data, settings);
            if (data) {
                chartUtil.pyramid(data);
                $(window).resize(function () {
                    chartUtil.chart.resize();
                });
                return chartUtil.chart;
            } else {
                return null;
            }
        },
        // 水球图
        liquidfill: function (container, data, settings) {
            var chartUtil = new Charts(container, data, settings);
            if (data) {
                chartUtil.liquidfill(data);
                $(window).resize(function () {
                    chartUtil.chart.resize();
                });
                return chartUtil.chart;
            } else {
                return null;
            }
        },
        // 河流图
        themeRiver: function (container, data, settings) {
            // 修改默认设置
            Charts.defaultSettings.grid = {
                left: 25,
                top: 25,
                right: 25,
                bottom: 25,
            };

            var chartUtil = new Charts(container, data, settings);
            if (data) {
                chartUtil.themeRiver(data);
                $(window).resize(function () {
                    chartUtil.chart.resize();
                });
                return chartUtil.chart;
            } else {
                return null;
            }
        },
        // 时间线
        timeline: function (container, data, settings, callback) {
            // 修改默认设置
            Charts.defaultSettings.grid = {
                containLabel: true,
                left: 5,
                top: 10,
                right: 5,
                bottom: 15,
            };
            if (settings.timelineOrient === "vertical") {
                Charts.defaultSettings.timelineInverse = true;
            }

            var chartUtil = new Charts(container, data, settings);
            if (data) {
                chartUtil.timeline(data, callback);
                $(window).resize(function () {
                    chartUtil.chart.resize();
                });
                return chartUtil.chart;
            } else {
                return null;
            }
        },
        // 联动
        connect: function (charts) {
            echarts.connect(charts);
        },
    }

    return ChartsUtils;
});