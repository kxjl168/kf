


import { Button, Card, Col, message, Popconfirm, Row, Spin } from 'antd';
import React, { useState, useRef, cloneElement, useEffect } from 'react';

import { isnull } from '@/utils/utils';
import _ from 'lodash';

import './index.less';
import { IconFontNew } from '@/components/MyCom/KIcon';
import logo from '../../assets/favicon.png';
import EntitySelect from '@/components/MyCom/EntitySelect';

import { asyncEntityRelation, deleteurl, hideurl, passallurl, searchtip, searchtxt as searchUrl, showurl, startSpider, stopSpider, updateurl } from '@/services/urlService';
import uuid from '@/utils/uuid';
import { isAdmin } from '@/utils/authority';
import { UrlItemData, UrlTypeData, UrlItemData as TableListItem } from './data';
import CreateForm from './com/CreateForm';
import EditForm from './com/EditForm';
import MFileUpload, { fileItem } from '@/components/MyCom/MFileUpload';
import { ProColumns } from '@ant-design/pro-table';
import SearchQuery from '@/components/MyCom/SearchQuery';





export const procols = (): ProColumns<UrlItemData>[] => {

    // const [querySubId, setQuerySubId] = useState<any>();

    // const getFullName = (dirname, name) => {

    //   if (dirname && name)
    //     return dirname + ":" + name;
    //   else if (dirname)
    //     return dirname;
    //   else if (name)
    //     return name;
    //   // return record.dirName+":"+record.name;
    // }

    return (
        [
            {
                title: 'ID',
                dataIndex: 'id',
                hideInForm: true,
                hideInSearch: true,
                hideInTable: false,
            },
            {
                title: '链接名称',
                dataIndex: 'url_name',
                hideInForm: false,
                hideInSearch: true,
                hideInTable: false,
            },
            {
                title: '链接类型',
                dataIndex: 'url_type',
                hideInForm: false,
                hideInSearch: true,
                hideInTable: false,
            },
            {
                title: 'val1',
                dataIndex: 'val1',
                hideInForm: true,
                hideInSearch: true,
                hideInTable: false,
            },


            {
                title: '链接URL',
                dataIndex: 'url_val',
                hideInForm: false,
                hideInSearch: true,
                hideInTable: false,
            },
            {
                title: '图标',
                dataIndex: 'icon',
                hideInForm: false,
                hideInSearch: true,
                hideInTable: false,
                renderFormItem: (_, { type, defaultRender, onChange, ...rest }, form) => {

                    const icon = form.getFieldValue('icon');

                    const sval: fileItem = { uid: uuid(), relativeURL: icon, FileUrl: `${getpreurl()}/${icon}`, oldname: '' }

                    // console.log(sval);
                    return <>
                        <MFileUpload curfileType='img' maxnums={2} sval={sval} className="width100" onChange={(v) => {
                            if (onChange) {
                                if (v && v.length > 0) {
                                    form.setFieldsValue({ 'icon': v[0].relativeURL })
                                    onChange(v[0].relativeURL);
                                }
                                else {
                                    form.setFieldsValue({ 'icon': "" })
                                    onChange("");
                                }
                            }

                        }} />
                    </>;
                },


            },
            {
                title: '描述',
                dataIndex: 'desc_info',
                valueType: "textarea",
                hideInForm: false,
                hideInSearch: true,
                hideInTable: false,
            },
        ])


}

const getpreurl = () => {
    const urlPre = REACT_APP_ENV === "dev" ? "http://127.0.0.1:8081/kb/file" : "http://256kb.cn/file";
    return urlPre;
}
const BList: React.FC<{}> = (props) => {


    const [selectVal, setselectVal] = useState<>();

    const [urllist, seturllist] = useState<UrlTypeData>();
    //  const [urllist,seturllist]=useState<UrlItemData>();


    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

    const [editFormValues, seteditFormValues] = useState<TableListItem>();

    const [createDefaultValues, SetCreateDefaultValues] = useState<TableListItem>({ val1: "1" });
    const [fetching, setfetching] = useState<boolean>(false);

    const contentRef=useRef();

    const [inputsearchtxt, setinputsearchtxt] = useState<string>("");

    const [curTxt,setcurTxt]=useState<string>("");

    const EntitySelectDone = () => {

    }

    const [classshow,setclassshow]=useState<string>("");


    const onFocus = () => {

    }

    useEffect(() => {

        // const hide = message.loading('数据加载中...', 600);
        loadUrl();

        window.onscroll = () => {
            if (window.onscroll) {
              
                const top=window.pageYOffset ||
                    document.documentElement.scrollTop || document.body.scrollTop || 0;
              
                if(top>0)
                {
                    setclassshow(" ");
                }
                else
                setclassshow(" hide ");

            }
          };

    }, [])

    const loadUrl = async (name?: string) => {
        setfetching(true);


        const erst = await searchUrl({ url_name: name ? name : curTxt, });

        try {
            if (erst && erst.data) {

                // debugger;
                const judata = JSON.parse(JSON.stringify(erst.data));

                const typedata = JSON.parse(judata.datalist);
                seturllist(typedata);
            }
        } catch (error) {
            message.error("数据加载失败!");
        }


        setfetching(false);
    }

    const getTopTypes = () => {
        let dom = <></>

        if (urllist)
            dom = urllist.map(item => {

                const items = JSON.parse(item.val);

                return <>

                    <div className="typelabel" onClick={() => {

                        const element= document.getElementById("p"+item.id);

                        setTimeout(() => {
                            window.scrollTo({
                                behavior: "smooth",
                                top: element ? element.offsetTop : 0
                            });
                        }, 100);


                    }}>{item.name} ({items.length}) </div>

                </>
            });



        return <>     <div className="toppanel" >{dom}</div></>;
    }

    const getLinkDv = () => {

        //debugger;
        let dom = <></>
        // const pref=useRef();

        const topdom = getTopTypes();

        if (urllist)
            dom = urllist.map(item => {

                const items = JSON.parse(item.val);
                return <>

                    <span id={"p"+item.id} className="position"></span>
                    <div className="urlpanel"  id={item.id} >
                      
                        <div className="typelabel">{item.name}    {isAdmin() && (

                            <>

                                <span className="actionbar">
                                    <IconFontNew type="icon-btn-add" onClick={() => {


                                        SetCreateDefaultValues({ val1: '1', url_type: item.name });

                                        handleModalVisible(true);

                                    }} title="新增同类链接" />&nbsp;

                                    {item.name === 'BLOG' && (


<>
                                        <IconFontNew type="icon-refresh" onClick={() => {

                                            handleAsyncEntityRelation({});

                                        }} title="同步全部" />
                                        &nbsp;


                                        <IconFontNew type="icon-bx-show" onClick={() => {

//  debugger;
handlepassallurl({});

}} title="通过所有BLOG" />
                                          &nbsp;

                                        <IconFontNew type="icon-stop" onClick={() => {

                                            //  debugger;
                                            handleStopSpider({});
                                            
                                            }} title="停止爬取" />


                                            </>

                                    )}




                                </span>
                            </>



                        )}</div>
                        <div className="typeContext">{getitemdv(item.val)}</div>


                        {items.length > 10 && (
                            <>
                                <div className="showmore" onClick={(e) => {

                                    const pid = e.target.parentNode.parentElement.id;
                                   // debugger;
                                    if (e.target.parentNode.parentElement.className.indexOf("open") > 0) {
                                        document.querySelector("#" + pid).className = "urlpanel";
                                        e.target.parentNode.parentElement.className = "urlpanel";
                                        //  pref.current.className="urlpanel";
                                    }
                                    else {
                                        document.querySelector("#" + pid).className = "urlpanel open";
                                        e.target.parentNode.parentElement.className = "urlpanel open";
                                    }

                                }} >



                                    <span className="bottombtn"><IconFontNew className="more" type="icon-gengduo" /><IconFontNew className="close" type="icon-toggle" />查看更多...</span>


                                </div>
                            </>
                        )}

                    </div>



                </>

            })



        return <>{topdom}{dom}</>;
    }

    const getScrollTopDom=()=>{

       
       

        return <><span className={`totop ${classshow}`} onClick={()=>{

            // const c=contentRef.current;

             window.scrollTo({
                 behavior: "smooth",
                 top:  0

             });
         }}>返回顶部 </span></>;
    }



    const getimgurl = (item) => {
        if (item.icon)
            return `${getpreurl()}/${item.icon}`
        else
            return logo
    }

    const getkgurl = (item) => {
        if (item.url_name)
            return `/s/search?keyword=${item.url_name}&type=kg`
        else
            return "javascript:void(0)";
    }


    const getsearchurl = (item) => {
        if (item.url_name)
            return `/s/search?keyword=${item.url_name}&type=normal`
        else
            return "javascript:void(0)";
    }




    const getitemdv = (itemstr) => {

        //  debugger;
        const itemlist = JSON.parse(itemstr);

        const urldoms = itemlist.map(item => {


            return (

                <>
                    <div className={`hd ${item.isshow !== '1' ? 'noshow' : ''}`}>
                        <div className="info">
                            {/* <div className="urlicon"><img src={`${item.val2}${item.icon}`} alt="图标" className="urlicon" /></div> */}
                            <div className="urlicon"><img src={getimgurl(item)} alt="图标" className="urlicon" /></div>
                            <div className="urltitle">
                                <div className="title" ><a href={item.url_val} target="_blank">{item.url_name}</a> </div>
                                <div className="action">
                                    {/* <a className="ulink" href={item.url_val} target="_blank">访问 */}
                                    {item.url_type === "BLOG" && (
                                        <>
                                            <a className="ulink" href={getsearchurl(item)}><IconFontNew type="icon-detail" /> 详情</a> <a className="ulink" href={getkgurl(item)} target="_blank"><IconFontNew type="icon-kgrelation" />关系</a>
                                        </>
                                    )}

                                    {isAdmin() && (
                                        <>
                                            <span className="actionbar">
                                                {item.isshow === '1' && (
                                                    <IconFontNew type="icon-khide" onClick={() => {

                                                        handleHide(item)

                                                    }} title="隐藏" />
                                                )}
                                                {item.isshow !== '1' && (
                                                    <IconFontNew type="icon-kshow" onClick={() => {

                                                        handleShow(item)

                                                    }} title="显示" />
                                                )}
                                                <IconFontNew type="icon-btn-edit" onClick={() => {

                                                    seteditFormValues(item);
                                                    //  debugger;
                                                    handleUpdateModalVisible(true);

                                                }} title="编辑" />


                                                <IconFontNew type="icon-refresh" onClick={() => {

                                                    //  debugger;
                                                    handleAsyncEntityRelation(item);

                                                }} title="同步图谱数据" />

<IconFontNew type="icon-spider" onClick={() => {

//  debugger;
handleStartSpider(item);

}} title="开始爬取" />


                                                <Popconfirm
                                                    title='确定删除?'
                                                    onConfirm={
                                                        (e) => {
                                                            handleRemove(item)
                                                            e.stopPropagation();
                                                        }

                                                    }
                                                    onCancel={(e) => { e.stopPropagation(); }}
                                                    okText="确定"
                                                    cancelText="取消"
                                                >
                                                    <IconFontNew type="icon-btn-delete-copy" title="删除" />
                                                </Popconfirm>
                                            </span>
                                        </>

                                    )}
                                </div>

                            </div>

                        </div>
                        <div className="desc">

                            {item.desc_info}
                        </div>
                    </div>
                </>)
        });

        return urldoms;
    }


    const search = () => {

    }

    
     /**
        * 通过所有blog
        * @param fields
        */
       const handlepassallurl = async () => {
        //  const hide = message.loading('正在同步');
          try {
              let rst = await passallurl({  });
              message.success('完成');
              loadUrl();
          } catch (error) {
             // hide();
              message.error('操作失败请重试！');
              return false;
          }
      };

    /**
        * 同步图谱
        * @param fields
        */
       const handleStartSpider = async (fields: UrlItemData) => {
      //  const hide = message.loading('正在同步');
        try {
            let rst =  startSpider({ ...fields });
            message.success('已开始后台爬取,起始url:'+fields.url_val);
        } catch (error) {
           // hide();
            message.error('操作失败请重试！');
            return false;
        }
    };

    const handleStopSpider = async (fields: UrlItemData) => {
        //  const hide = message.loading('正在同步');
          try {
              let rst =  stopSpider({ ...fields });
              message.success('已停止爬虫,开始刷新...');

              loadUrl();
          } catch (error) {
             // hide();
              message.error('操作失败请重试！');
              return false;
          }
      };




    /**
        * 同步图谱
        * @param fields
        */
    const handleAsyncEntityRelation = async (fields: UrlItemData) => {
        const hide = message.loading('正在同步');
        try {
            let rst = await asyncEntityRelation({ ...fields });
            if (rst && rst.success) {
                hide();
                message.success('处理成功');
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            hide();
            message.error('操作失败请重试！');
            return false;
        }
    };


    /**
     * 添加g、更新节点
     * @param fields
     */
    const handleUpdate = async (fields: UrlItemData) => {
        const hide = message.loading('正在处理');
        try {
            let rst = await updateurl({ ...fields });
            if (rst && rst.success) {
                hide();
                message.success('处理成功');
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            hide();
            message.error('操作失败请重试！');
            return false;
        }
    };

    /**
     * 更新节点
     * @param fields
     */
    const handleShow = async (fields: UrlItemData) => {
        const hide = message.loading('正在配置');
        try {
            let rst = await showurl(fields);
            if (rst && rst.success) {
                hide();

                message.success('配置成功');
                loadUrl();
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            hide();
            message.error('配置失败请重试！');
            return false;
        }
    };


    /**
     * 更新节点
     * @param fields
     */
    const handleHide = async (fields: UrlItemData) => {
        const hide = message.loading('正在配置');
        try {
            let rst = await hideurl(fields);
            if (rst && rst.success) {
                hide();

                message.success('配置成功');

                loadUrl();
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            hide();
            message.error('配置失败请重试！');
            return false;
        }
    };


    /**
     * 更新节点
     * @param fields
     */
    const handleRemove = async (fields: UrlItemData) => {
        const hide = message.loading('正在配置');
        try {
            let rst = await deleteurl(fields);
            if (rst && rst.success) {
                hide();

                message.success('配置成功');
                loadUrl();
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            hide();
            message.error('配置失败请重试！');
            return false;
        }
    };


    return (<>

        <span className={`searchDv  `} >




            <div className="stitle"  >

                <span className="stxt">知识检索</span>
                <Row>
                    <Col span={2}><img className="slogo" onClick={() => {

                        //props.history.push("/");

                        props.history.push("/");


                    }} alt="" src={logo} /></Col>
                    <Col span={8}>
                        <Card>
                            <span className="flex">
                                {/* <EntitySelect className="width100" onFocus={onFocus} labelInValue selectVal={selectVal} placeholder="搜索链接" onChange={EntitySelectDone} /> */}

                                <SearchQuery onChange={(v)=>{  setcurTxt(v) }} inputvalue={inputsearchtxt} onFocus={onFocus} className="width100" selectVal={selectVal} placeholder="链接URL / 站点 / 描述" onSearch={(value) => {
                                    loadUrl(value);
                                    //props.history.push("/s/search?keyword=" + value);

                                }} fetchHander={async (qdata) => {

                                    return searchtip({ url_name: qdata.keyword });

                                }}

                                    rstDealHander={(items) => {

                                        // debugger;
                                        const rst = [];
                                        items.forEach(item => {
                                            rst.push({ text: item.url_name, value: item.url_name, key: item.id })
                                        })

                                        return rst;

                                    }}
                                />

                                <IconFontNew className="searchIconR" type="icon-search" onClick={search} />
                            </span>
                        </Card>

                    </Col>
                    <div className="toRoot"><a href="javascript:void(0);" onClick={() => {
                        props.history.push("/");
                    }} >管理首页</a></div>
                </Row>
                {/* </div>
</TweenOne> */}
            </div>
        </span>



        <div className="scontent" ref={contentRef}>
            <Row>

                {fetching ? <><Spin style={{ margin: '0 auto', paddingTop: '100px' }} /></> : getLinkDv()}


            </Row>
        </div>

        {getScrollTopDom()}




        <CreateForm values={createDefaultValues} onSubmit={async (value, callback) => {



            // if(!isnull(value.attrs))
            // value.attrs=value.attrs.toString();


            const success = await handleUpdate(value);
            if (success) {

                if (value.shouldclose) {
                    handleModalVisible(false);

                }
                else
                    message.info("可以修改数据继续添加!");

                loadUrl();

            }
        }} title="新建链接" onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible} />



        <EditForm modalVisible={updateModalVisible} onCancel={
            () => {
                handleUpdateModalVisible(false);
            }} title="编辑链接" values={editFormValues} onSubmit={async (value) => {

                let postdata = _.cloneDeep(value) as UrlItemData;


                const success = await handleUpdate(postdata);
                if (success) {
                    handleUpdateModalVisible(false);

                    loadUrl();

                }
            }}


        />



    </>);
}

export default BList;