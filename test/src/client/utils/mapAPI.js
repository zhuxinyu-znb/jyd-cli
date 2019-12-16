import AMap from 'AMap';
import ReactDomServer from 'react-dom/server';
import {message} from 'antd';

export default class MapApi {
    init = (config = {}) => {
        const {zoom, mapStyle = '', boxID} = config;
        if (boxID && zoom || mapStyle) {
            return (
                new AMap.Map(boxID, {
                    resizeEnable: true, //是否监控地图容器尺寸变化
                    mapStyle,
                    center: [119.775565,36.42862],//中心点坐标
                    zoom,//设置当前地图级别
                })
            );
        } else {
            throw new Error('配置项必须包含：boxID(容器id)、zoom(图层级别)');
        }
    };
    traffic = (config = {}) => {
        const {map, interval} = config;
        if (map) {
            return (
                new AMap.TileLayer.Traffic({
                    map,
                    interval: interval || 180,
                    autoRefresh: true
                })
            );
        } else {
            throw new Error('配置项必须包含：map(地图对象)');
        }
    };
    marker = (config = {}) => {
        const {
            map, position, domNode, icon = '', extData,
            offset = [0, 0], anchor, angle = 0, title = '', autoRotation, zIndex = 0
        } = config;
        if (map && position && (domNode || icon)) {
            return (
                new AMap.Marker({
                    map,
                    position,
                    icon,
                    content: ReactDomServer.renderToString(domNode),
                    anchor,
                    offset: new AMap.Pixel(...offset),
                    autoRotation,
                    angle,
                    extData,
                    title,
                    zIndex
                })
            );
        } else {
            throw new Error('配置项必须包括：map(地图对象)、position、domNode或者icon');
        }
    };
    polyLine = (config = {}) => {
        const {
            map, strokeColor = '#000', strokeWeight, path = []
        } = config;
        if (map && strokeWeight) {
            return (
                new AMap.Polyline({
                    map,
                    strokeWeight,
                    path,
                    strokeColor,
                })
            )
        } else {
            throw new Error('配置项必须包括：map(地图对象)、strokeWeight、path');
        }
    };
    group = (markList = []) => {
        if (markList) {
            return new AMap.OverlayGroup(markList);
        }
    };
    moveTo = (obj, path, newPoint, type) => {
        AMap.plugin('AMap.GraspRoad', () => {
            const grasp = new AMap.GraspRoad();
            grasp.driving(path, (error, result) => {
                if (!error) {
                    const newPath = result.data.points;//纠偏后的轨迹
                    const formatPath = newPath[newPath.length - 1];
                    obj.setPosition([formatPath.x, formatPath.y]);
                    if(type === 'car') {
                        obj.setAngle(path[1].ag - 90);
                    }
                } else {
                    console.log(error);
                }
                if (newPoint) {
                    newPoint.lng = path[1].x;
                    newPoint.lat = path[1].y;
                    newPoint.speed = path[1].sp;
                    newPoint.ang = path[1].ag;
                }
            })
        })
    };
    correctPath = (path, map, obj) => {
        AMap.plugin('AMap.GraspRoad', () => {
            const grasp = new AMap.GraspRoad();
            // 判断轨迹点是否超过纠偏最大值
            if (path.length > 480) {
                const reslut = [];
                const count = Math.ceil(path.length / 480);
                // 分成多次纠偏
                for (let i = 0; i < count; i += 1) {
                    reslut.push(
                        new Promise((resolve) => {
                            let path_tmp;
                            if (i === count - 1) {
                                path_tmp = path.slice(480 * i, path.length - 1);
                            } else {
                                path_tmp = path.slice(480 * i, 480 * ( i + 1 ));
                            }
                            grasp.driving(path_tmp, (error, result) => {
                                if (!error) {
                                    const newPath = result.data.points;//纠偏后的轨迹
                                    const formatPath = newPath.map((d) => {
                                        return [d.x, d.y];
                                    });
                                    if (map) {
                                        const pathConfig = {
                                            map,
                                            strokeWeight: 4,
                                            path: formatPath,
                                            strokeColor: '#3EC488',
                                        };
                                        this.polyLine(pathConfig);
                                    } else {
                                        resolve(formatPath);
                                    }
                                } else {
                                    console.log(error);
                                }
                            })
                        })
                    );
                }
                // 不是画路径
                if (!map) {
                    // 统一取回结果
                    Promise.all(reslut).then((res) => {
                        let allPath = [];
                        res.forEach((d) => {
                            allPath = [...allPath, ...d];
                        });
                        obj.moveAlong(allPath, 600);
                    })
                }
            } else {
                grasp.driving(path, (error, result) => {
                    if (!error) {
                        const newPath = result.data.points;//纠偏后的轨迹
                        const formatPath = newPath.map((d) => {
                            return [d.x, d.y];
                        });
                        if (map) {
                            const pathConfig = {
                                map,
                                strokeWeight: 4,
                                path: formatPath,
                                strokeColor: '#3EC488',
                            };
                            this.polyLine(pathConfig);
                        } else {
                            obj.moveAlong(formatPath, 600);
                        }
                    } else {
                        console.log(error);
                    }
                })
            }
        })
    };
    area = (config = {}) => {
        const {
            map, strokeColor = "rgba(17,86,179,0.5)", strokeWeight = 1,
            fillColor = 'transparent', fillOpacity = 0, level, areaList
        } = config;
        if (map && level && areaList) {
            AMap.plugin('AMap.DistrictSearch', () => {
                // 创建行政区查询对象
                const district = new AMap.DistrictSearch({
                    // 返回行政区边界坐标等具体信息
                    extensions: 'all',
                    // 设置查询行政区级
                    level,
                });
                areaList.forEach((d) => {
                    district.search(d, (status, result) => {
                        // 获取搜索区域的边界信息
                        const bounds = result.districtList[0].boundaries;
                        if (bounds) {
                            for (let i = 0, l = bounds.length; i < l; i++) {
                                //生成行政区划polygon
                                new AMap.Polygon({
                                    map,
                                    strokeWeight,
                                    path: bounds[i],
                                    fillOpacity,
                                    fillColor,
                                    strokeColor,
                                });
                            }
                            // 地图自适应
                            // map.setFitView()
                        }
                    })
                });
            })
        } else {
            throw new Error('配置项必须包括：map(地图对象)、level(区域等级)、areaList(区域列表)');
        }
    };
    recovery = (config = {}) => {
        const {map, icon, offset} = config;
        map.plugin('AMap.Geolocation', function () {
            const geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: true,        //显示定位按钮，默认：true
                buttonPosition: 'RB',    //定位按钮停靠位置，默认：'LB'，左下角
                buttonOffset: new AMap.Pixel(...offset),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                buttonDom: icon,
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition((status, result) => {
                if (status != 'complete') {
                    message.error(result)
                }
            });
        });
    };
}
