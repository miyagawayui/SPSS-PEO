import React, { useEffect, useState, useRef } from "react";
import { CookiesProvider, useCookies } from "react-cookie";
import { createPortal } from "react-dom";
import {
  getTableData,
  postDataLot,
  getSerialNumberList,
  postDataSerial,
  getContentsLot,
  getContentsSerial
} from "api/OdataManager";
import {
  Label,
  Text,
  Icon,
  Input,
  Link,
  Button,
  AnalyticalTable,
  AnalyticalTableScaleWidthMode,
  FlexBox,
  FlexBoxAlignItems,
  FlexBoxDirection,
  FlexBoxJustifyContent,
  Bar,
  Toolbar,
  OverflowToolbarButton,
  OverflowToolbarToggleButton,
  ToolbarSpacer,
  ToolbarSeparator,
  MessageBox,
  SelectDialog,
  StandardListItem,
  ListMode,
  DatePicker,
  ResponsiveGridLayout,
  Popover,
  BusyIndicator,
  AnalyticalTableHooks
} from '@ui5/webcomponents-react';
import ReactHtmlParser from 'html-react-parser';
import ItemSelectionData from "../assets/zpoux001_01_ItemSelect.json";
import SerialNumberListModal from "../components/zpoux001_01/SerialNumberListModal";

// 画面遷移
import { useNavigate } from "react-router-dom";

// アイコン
import "@ui5/webcomponents-icons/dist/accept";
import "@ui5/webcomponents-icons/dist/search";
import "@ui5/webcomponents-icons/dist/navigation-left-arrow";
import "@ui5/webcomponents-icons/dist/navigation-right-arrow";
import "@ui5/webcomponents-icons/dist/synchronize";
import "@ui5/webcomponents-icons/dist/complete";
import "@ui5/webcomponents-icons/dist/expand-all";
import "@ui5/webcomponents-icons/dist/back-to-top";
import "@ui5/webcomponents-icons/dist/account";
import "@ui5/webcomponents-icons/dist/customer-history";

// 言語関係
import { useI18nBundle } from '@ui5/webcomponents-react-base';
import { getLanguage } from "@ui5/webcomponents-base/dist/config/Language.js";

const today =  new Date();      // 現在日付

/**
 * 作業一覧
 * @returns 作業一覧画面
 */
export default function ZPOUX001_01() {
  /**
   * 定数
   */
  const LIST_PTN_INCOMP = "incomp";
  const LIST_PTN_COMP = "comp";
  const LIST_PTN_CONTENTS = "Contents";
  const LIST_PTN_WORKSTART = "WorkStart";
  const SERIAL_ITEMS_PTN = "false";

  // Cookie用
  const [cookies, setCookie, removeCookie] = useCookies(["columns", "orderbyKeys", "columnOrders"]);
  const navigate = useNavigate();                     //  画面遷移
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");   // 検索テキスト保管
  const [targetDate, setTargetDate] = useState("");   // 対象日付
  

  // 一覧に関する変数
  const [workData, setWorkData] = useState([]);         // 作業一覧データ用
  const [workItems, setWorkItems] = useState([]);       // 作業一覧表示用
  const [IncompCount, setIncompCount] = useState(0);    // 未完了件数
  const [CompCount, setCompCount] = useState(0);        // 完了件数
  const [dataSerial, setDataSerial] = useState([]);     // シリアル番号一覧用
  const [currentListPtn, setCurrentListPtn] = useState(LIST_PTN_INCOMP);         // 未完了完了ボタン

  // Number of rows which exist on the service
  const [Rate, setRate] = useState("0".padStart(2,"　"));                      // 進捗率
  const [UnfinishedMin, setUnfinishedMin] = useState("0".padStart(2,"　"));    // 未完了残作業：分
  const [UnfinishedHour, setUnfinishedHour] = useState("0".padStart(2,"　"));  // 未完了残作業：時間
  const [divContents, setDivContents] = useState("");       // コンテンツ
  
  // シリアル番号一覧用ダイアログ
  const [dialogIsOpen1, setDialogIsOpen1] = useState(false);
  const openDialog1 = () => {
    setDialogIsOpen1(true);
    return;
  };
  const closeDialog1 = (resolve) => {
    setDialogIsOpen1(false);
  };
  
  // 変数定義
  var OpActyNtwkInstance = "";          // ネットワークインスタンス
  var OpActyNtwkElement = "";           // ネットワークエレメント
  var OpActyConfIsSFIBased = "";        // 品目確認
  var SASStatusCategory = "";           // ステータスカテゴリ
  var decIncompCount = 0;              // 未完了
  var decCompCount = 0;                // 完了
  const [openerId, setOpenerId] = useState("");       // コンテンツ
  const i18nBundle = useI18nBundle('i18n_zpoux001_01');
  const COLUMNS = [
    {
      // 指図番号
      Header: i18nBundle.getText('ManufacturingOrder'),
      accessor: 'ManufacturingOrder',
      enableMultiSort: true,
      disableDragAndDrop: true,
    },
    {
      // 作業番号
      Header: i18nBundle.getText('ManufacturingOrderOperation'),
      accessor: 'ManufacturingOrderOperation',
      enableMultiSort: true,
      disableDragAndDrop: true,
    },
    {
      // 作業時間
      Header: i18nBundle.getText('OpActyExpdExecutionDuration'),
      accessor: 'OpActyExpdExecutionDuration',
      enableMultiSort: true
    },
    {
      // 作業活動ステータス
      Header: i18nBundle.getText('SASStatusName'),
      accessor: 'SASStatusName',
      enableMultiSort: true
    },
    {
      // 機種,号機
      Header: i18nBundle.getText('EffectivityParameterDesc'),
      accessor: 'EffectivityParameterDesc',
      enableMultiSort: true
    },
    {
      // 作業内容
      Header: i18nBundle.getText('MfgOrderOperationText'),
      accessor: 'MfgOrderOperationText',
      enableMultiSort: true
    },
    {
      // 作業区
      Header: i18nBundle.getText('WorkCenter'),
      accessor: 'WorkCenter',
      enableMultiSort: true
    },
    {
      // 作業活動番号
      Header: i18nBundle.getText('OpActyNtwkElementExternalID'),
      accessor: 'OpActyNtwkElementExternalID',
      enableMultiSort: true
    },
    {
      // 作業活動内容
      Header: i18nBundle.getText('OperationActivityName'),
      accessor: 'OperationActivityName',
      enableMultiSort: true,
      Cell:({ value, cell }) => 
      {
        const id = cell.row.original.id;
        return(
          <FlexBox>
            <Link id={'OpeActIncom'+id} onClick={(e) => {e.markerAllowTableRowSelection = true;}}>{value}</Link>
          </FlexBox>
        );
      }
    },
    {
      // 作業活動番号
      Header: i18nBundle.getText('OpLtstSchedldExecStrtDteTme'),
      accessor: 'OpLtstSchedldExecStrtDteTme',
      enableMultiSort: true
    },
    {
      // 作業活動番号
      Header: i18nBundle.getText('TeamName'),
      accessor: 'TeamName',
      enableMultiSort: true
    },
    {
      // 作業活動番号
      Header: i18nBundle.getText('ProductionPlant'),
      accessor: 'ProductionPlant',
      enableMultiSort: true
    },
    {
      // 作業活動番号
      Header: i18nBundle.getText('OpLtstSchedldExecEndDteTme'),
      accessor: 'OpLtstSchedldExecEndDteTme',
      enableMultiSort: true
    },
    {
      // 作業活動番号
      Header: i18nBundle.getText('OrderIsTechnicallyCompleted'),
      accessor: 'OrderIsTechnicallyCompleted',
      enableMultiSort: true
    },
    {
      // 作業活動番号
      Header: i18nBundle.getText('MfgOpActyExecutionPriority'),
      accessor: 'MfgOpActyExecutionPriority',
      enableMultiSort: true
    },
    {
      // 作業活動番号
      Header: i18nBundle.getText('OpActualExecutionStartDateTime'),
      accessor: 'OpActualExecutionStartDateTime',
      enableMultiSort: true
    },
    {
      // 作業活動番号
      Header: i18nBundle.getText('OpActualExecutionEndDateTime'),
      accessor: 'OpActualExecutionEndDateTime',
      enableMultiSort: true
    },
    {
      // 作業活動番号
      Header: i18nBundle.getText('MaterialName'),
      accessor: 'MaterialName',
      enableMultiSort: true
    },
    {
      // 作業活動番号
      Header: i18nBundle.getText('ProductionHold'),
      accessor: 'ProductionHold',
      enableMultiSort: true
    },
    {
      // 作業活動番号
      Header: i18nBundle.getText('OpActyExpdExecutionLaborDurn'),
      accessor: 'OpActyExpdExecutionLaborDurn',
      enableMultiSort: true
    },
    {
      // 作業活動番号
      Header: i18nBundle.getText('OperationExecutionAvailableQty'),
      accessor: 'OperationExecutionAvailableQty',
      enableMultiSort: true,
      disabled: true
    },
    {
      // 詳細
      Header: i18nBundle.getText('details'),
      accessor: 'details',
      enableMultiSort: true,
      disableDragAndDrop:true,
      Cell:({ value, cell }) => 
      {
        const id = cell.row.original.id;
        return(
          <FlexBox>
            <Link id={'detailsIncom'+id} onClick={(e) => {e.markerAllowTableRowSelection = true;}}>{value}</Link>
          </FlexBox>
        );
      }
    },
  ];
  
  // 初期化
  useEffect(() => {
    
    // カラムの表示非表示
    const columns = cookies.columns? cookies.columns: ItemSelectionData.data;
    setHideColumns(columns);
    // 列入れ替え
    const columnOrders = cookies.columnOrders? cookies.columnOrders: "";
    TblInstance.current.setColumnOrder(columnOrders.split(","));

    // ソート順
    const orderbyKeys = cookies.orderbyKeys? cookies.orderbyKeys.split(" "): "";
    let cookieOrderbyKeys = []; 
    for (let j = 0;  j < orderbyKeys.length;  j++) {
      cookieOrderbyKeys.push(JSON.parse(orderbyKeys[j]));
    }
    TblInstance.current.setSortBy(cookieOrderbyKeys);

    // 現在日付を分解
    let date = today;
    const year = date.getFullYear().toString();
    const month = (date.getMonth()+1).toString();
    const day = date.getDate().toString();

    // 表示用の日付を設定
    const tdate = year + "/" + month + "/" + day;
    setTargetDate(tdate);

    // 検索情報を取得
    const search = searchText.toString();

    // 一覧更新 初回は未完了
    UpdateList(search, tdate, LIST_PTN_INCOMP);
    // loadData(true, search, targetdate, lastdate);
  }, []);

  // /Date(0000000000000)/ ⇒ yyyy/MM/dd
  const dateFormatMilliseconds = (value) => {
    if (value.substring(0, 6) == "/Date(" && value.length > 20) {
      // ミリ秒に変換
      const milliseconds = parseFloat(value.substring(6, 19));
      // 日付型に変換
      const date = new Date(milliseconds);

      const year = date.getFullYear().toString();     // 年
      const month = (date.getMonth() + 1).toString(); // 月
      const day = date.getDate().toString();          // 日
  
      // yyyy/MM/ddで返却
      return year + "/" + month + "/" + day;
    }
  }

  /**
   *  一覧更新メソッド
   * @param {検索項目テキスト} search 
   * @param {対象日付} tdate 
   * @param {表示データパターン} listPtn 
   */
  const UpdateList = async (search, tdate, listPtn) => {
    try {
      setLoading(true);     // ローディング画面表示
      // 対象日付と対象日付前日の情報が必要
      let date = new Date(tdate);

      // 対象日付を加工
      // 日付を分解
      let year = date.getFullYear().toString();
      let month = (date.getMonth()+1).toString();
      let day = date.getDate().toString();
      // ゼロ埋め
      month = month.padStart(2,"0");
      day = day.padStart(2,"0");
      // ハイフンで結合
      const targetdate =  year + "-" + month + "-" + day;

      // 対象日付前日を加工
      // 前日に変更
      date.setDate(date.getDate() - 1);
      // 日付を分解
      let lastyear = date.getFullYear().toString();
      let lastmonth = (date.getMonth()+1).toString();
      let lastday = date.getDate().toString();
      // ゼロ埋め
      month = month.padStart(2,"0");
      day = day.padStart(2,"0");
      // ハイフンで結合
      const lastdate =  lastyear + "-" + lastmonth + "-" + lastday;

      // 検索項目
      let strSearch = search;
      // searchが無ければsearchTextから取得する
      if(strSearch == ""){
        strSearch = searchText.toString();
      }

      // 一覧データ読み込み
      if(listPtn == LIST_PTN_INCOMP){
        // 未完了データ取得メソッド
        await IncompleteData(strSearch, targetdate, lastdate)
        .catch( error => {
          throw new Error(error);
        })
      } else if(listPtn == LIST_PTN_COMP){
        // 完了データ取得メソッド
        await CompletionData(strSearch, targetdate, lastdate)
        .catch( error => {
          throw new Error(error);
        });
      }
    } catch(e) {
    } finally {
      setLoading(false);
    }
  };

  // 未完了ボタン選択
  const changeListPtn = async (event) => {
    // 表示しているタブだったら処理しない
    if(event.currentTarget.id == currentListPtn)
    {
      return;
    } else {
      // タブIndexをセット
      setCurrentListPtn(event.currentTarget.id);
      // 検索情報を取得
      const search = searchText.toString();
      const tdate = targetDate.toString();
  
      // 一覧更新
      UpdateList(search, tdate, event.currentTarget.id);
    }
  };

  /**
   * 未完了データ取得
   * @param {検索項目テキスト} search 
   * @param {対象日付} tdate 
   * @param {対象日付前日} lastTdate 
   * @returns 未完了データ
   */
  const IncompleteData = async (search, tdate, lastTdate) => {
    setWorkItems([]);     // 空にする
    let unfinishedTime = 0;

    // パラメータ
    // filter
    const filterStatus = '(SASStatusCategory eq 2 or SASStatusCategory eq 1 or SASStatusCategory eq 5)';
    const filterDate = " and (OpLtstSchedldExecStrtDteTme ge datetimeoffset'" + lastTdate + "T15:00:00Z' and OpLtstSchedldExecStrtDteTme le datetimeoffset'"+ tdate +"T14:59:59Z')"
    const filter = filterStatus + filterDate
    // orderby
    const orderby = "ManufacturingOrder asc,ManufacturingOrderOperation asc";
    // 検索テキスト
    const strSearch = search;
    // 言語
    const strLang = getLanguage();

    // Odata送信
    const _items = await getTableData(filter, orderby, strSearch, strLang);
    // エラーの場合
    if(_items.data || _items.status){
      // ODataサービスエラーメッセージ
      if(!_items.data.error || _items.status){
        setErrMessage(_items.data);
      }else{
        setErrMessage(_items.data.error.message.value);
      }
      setErrBoxOpen(true);
      throw new Error(_items.error);
    };
    // 未完了件数
    const incompCount = _items.length;
    
    // 未完了データを表示用に編集
    const itemsWithIds = _items.map((item, index) => {
      item.id = index;
      item.details = i18nBundle.getText('detailsText');
      // datetime型⇒yyyy/MM/dd
      // 計画開始
      if(item.OpLtstSchedldExecStrtDteTme) item.OpLtstSchedldExecStrtDteTme = dateFormatMilliseconds(item.OpLtstSchedldExecStrtDteTme);
      // 計画終了
      if(item.OpLtstSchedldExecEndDteTme) item.OpLtstSchedldExecEndDteTme = dateFormatMilliseconds(item.OpLtstSchedldExecEndDteTme);
      // 実際開始
      if(item.OpActualExecutionStartDateTime) item.OpActualExecutionStartDateTime = dateFormatMilliseconds(item.OpActualExecutionStartDateTime);
      // 実績終了
      if(item.OpActualExecutionEndDateTime) item.OpActualExecutionEndDateTime = dateFormatMilliseconds(item.OpActualExecutionEndDateTime);
      // 時間集計
      if(item.DurationUnit == "MIN"){
        unfinishedTime = parseFloat(unfinishedTime) + parseFloat(item.OpActyExpdExecutionDuration);
      } else {
        // MIN以外の単位は時間と見なす
        unfinishedTime = unfinishedTime + parseFloat(item.OpActyExpdExecutionDuration) * 60;
      }
      // 指図技術的完了
      if(item.OrderIsTechnicallyCompleted){
        // はい
        item.OrderIsTechnicallyCompleted = i18nBundle.getText('YesText')
      } else {
        // いいえ
        item.OrderIsTechnicallyCompleted = i18nBundle.getText('NoText')
      }
      return item;
    });

    // 完了データ取得
    const compfilterStatus = 'SASStatusCategory eq 3';
    const compFilter = compfilterStatus + filterDate
    const _compItems = await getTableData(compFilter, orderby, strSearch, strLang);
    // エラーの場合
    if(_compItems.data || _compItems.status){
      // ODataサービスエラーメッセージ
      if(!_compItems.data.error || _compItems.status){
        setErrMessage(_compItems.data);
      }else{
        setErrMessage(_compItems.data.error.message.value);
      }
      setErrBoxOpen(true);
      throw new Error(_compItems.error);
    };
    // 完了件数
    const compCount = _compItems.length;

    let data999 = [];
    let data111 = [];
    let rowindexSasizu = 0
    let indexSagyo = 0
    let index = 0
    let listdata = [];
    let headdata = [];
    let headdataSagyo = [];
    // ツリー作成中
    for (  let i = 0;  i < itemsWithIds.length;  i++  ) {
      const data = itemsWithIds[i];
      // ツリー作成
      if(i+1 < itemsWithIds.length){
        // 指図番号
        if(itemsWithIds[i].ManufacturingOrder == itemsWithIds[i+1].ManufacturingOrder){
          // 作業番号
          if(itemsWithIds[i].ManufacturingOrderOperation == itemsWithIds[i+1].ManufacturingOrderOperation){
            // 指図が同じかつ作業番号が同じ　作業番号ツリー作成中
            if(rowindexSasizu == 0){
              headdata = delItem(data);
            }
            if(indexSagyo == 0) {
              headdataSagyo = delItem(data);
            }
            const treedata = itemcostm(data);
            data111[indexSagyo] = treedata;
            headdataSagyo.subRows = data111;
            data999[0] = headdataSagyo;
            headdata.subRows = data999;
            indexSagyo++;
          } else {
            // 指図が同じかつ作業番号が違う
            if(headdataSagyo.ManufacturingOrderOperation != ""){
              // 作業番号ツリー作成中
              const treedata = itemcostm(data);
              data111[indexSagyo] = treedata;
              headdataSagyo.subRows = data111;
              data999[0] = headdataSagyo;
              headdata.subRows = data999;
              indexSagyo = 0;              
            } else {
              // 作業番号ツリー無し
              // ツリー内部データ生成
              if(rowindexSasizu == 0){
                headdata = delItem(data);
              }
              const treedata = itemcostm(data);
              data999[rowindexSasizu] = treedata;
              headdata.subRows = data999;
              rowindexSasizu++;
            }
          }
          continue;
        }
      } else {
        if(itemsWithIds[i-1].ManufacturingOrder == itemsWithIds[i].ManufacturingOrder){
          // 最終行に対応
          // ツリー内部データ生成
          if(rowindexSasizu == 0){
            headdata = delItem(data);
          }
          const treedata = itemcostm(data);
          data999[rowindexSasizu] = treedata;
          headdata.subRows = data999;
          rowindexSasizu++;
        }
      }
      if(!headdata.subRows){
        listdata[index] = data;
      }else{
        listdata[index] = headdata;
        headdata = [];
        data999 = [];
        rowindexSasizu = 0;
        indexSagyo = 0;
      }
      index++;
    }

    // 表示項目処理
    // 未完了件数表示
    setIncompCount(incompCount);
    // 完了件数表示
    setCompCount(compCount);
    // 進捗率計算 
    if((compCount + incompCount) != 0){
      // 完了件数 + 未完了件数が0件以上
      // 完了件数 / ( 完了件数 + 未完了件数 ) × 100 ※四捨五入
      const res = Math.round(compCount / (compCount + incompCount) * 100);
      setRate(res.toString().padStart(2,"　"));
    } else {
      // 完了件数 + 未完了件数が0
      setRate("0".padStart(2,"　"));
    }
    // 未完了時間を算出
    const min = unfinishedTime > 0? unfinishedTime % 60: 0;
    setUnfinishedMin(min.toString().padStart(2,"　"));
    const hour = parseInt(unfinishedTime > 0? unfinishedTime / 60: 0);
    setUnfinishedHour(hour.toString().padStart(2,"　"));

    // 未完了一覧テーブルにバインド
    setWorkItems(listdata);
    // 未完了データ格納
    setWorkData(itemsWithIds);
    return;
  };

  // データ生成
  const itemcostm = (item) => {
    const treedata =
    {
      DurationUnit: item.DurationUnit,
      EffectivityParameterDesc: item.EffectivityParameterDesc,
      ManufacturingOrder: item.ManufacturingOrder,
      ManufacturingOrderImportance: item.ManufacturingOrderImportance,
      ManufacturingOrderOperation: item.ManufacturingOrderOperation,
      ManufacturingOrderText: item.ManufacturingOrderText,
      Material: item.Material,
      MaterialName: item.MaterialName,
      MfgOpActyExecutionPriority: item.MfgOpActyExecutionPriority,
      MfgOrderOperationText: item.MfgOrderOperationText,
      NrOfOpActyTeamAssignments: item.NrOfOpActyTeamAssignments,
      NrOfOpActyUserAssignments: item.NrOfOpActyUserAssignments,
      NumberOfActiveShopFloorItems: item.NumberOfActiveShopFloorItems,
      OpActualExecutionEndDateTime: item.OpActualExecutionEndDateTime,
      OpActualExecutionStartDateTime: item.OpActualExecutionStartDateTime,
      OpActyConfIsSFIBased: item.OpActyConfIsSFIBased,
      OpActyExpdExecDurnInSeconds: item.OpActyExpdExecDurnInSeconds,
      OpActyExpdExecutionDuration: item.OpActyExpdExecutionDuration,
      OpActyExpdExecutionLaborDurn: item.OpActyExpdExecutionLaborDurn,
      OpActyHasMissingComponents: item.OpActyHasMissingComponents,
      OpActyIsSeldForRtactvPostg: item.OpActyIsSeldForRtactvPostg,
      OpActyNtwkElement: item.OpActyNtwkElement,
      OpActyNtwkElementExternalID: item.OpActyNtwkElementExternalID,
      OpActyNtwkInstance: item.OpActyNtwkInstance,
      OpActyNtwkSegmentType: item.OpActyNtwkSegmentType,
      OpActyNtwkSegmentTypeText: item.OpActyNtwkSegmentTypeText,
      OpLtstSchedldExecEndDteTme: item.OpLtstSchedldExecEndDteTme,
      OpLtstSchedldExecStrtDteTme: item.OpLtstSchedldExecStrtDteTme,
      OperationActivityHasProdnHold: item.OperationActivityHasProdnHold,
      OperationActivityName: item.OperationActivityName,
      OperationExecutionAvailableQty: item.OperationExecutionAvailableQty,
      OrderIsTechnicallyCompleted: item.OrderIsTechnicallyCompleted,
      ProductionHold: item.ProductionHold,
      ProductionPlant: item.ProductionPlant,
      ProductionUnit: item.ProductionUnit,
      RespyMgmtTeamID: item.RespyMgmtTeamID,
      SASStatusCategory: item.SASStatusCategory,
      SASStatusCategoryName: item.SASStatusCategoryName,
      SASStatusName: item.SASStatusName,
      Start_rtactv_ac: item.Start_rtactv_ac,
      StatusAndActionSchemaStatus: item.StatusAndActionSchemaStatus,
      TeamName: item.TeamName,
      UserDescription: item.UserDescription,
      WorkCenter: item.WorkCenter,
      WorkCenterText: item.WorkCenterText,
      ZZ1_ACTGRP_ID_MOA: item.ZZ1_ACTGRP_ID_MOA,
      ZZ1_ACTGRP_NM_MOA: item.ZZ1_ACTGRP_NM_MOA,
      ZZ1_ASSIGN_TEMPLATE_ID_MOA: item.ZZ1_ASSIGN_TEMPLATE_ID_MOA,
      ZZ1_ASSIGN_TEMPLATE_NM_MOA: item.ZZ1_ASSIGN_TEMPLATE_NM_MOA,
      ZZ1_INCIDENTAL_ITEM_1_MOA: item.ZZ1_INCIDENTAL_ITEM_1_MOA,
      ZZ1_INCIDENTAL_ITEM_2_MOA: item.ZZ1_INCIDENTAL_ITEM_2_MOA,
      ZZ1_INCIDENTAL_ITEM_3_MOA: item.ZZ1_INCIDENTAL_ITEM_3_MOA,
      ZZ1_INCIDENTAL_ITEM_4_MOA: item.ZZ1_INCIDENTAL_ITEM_4_MOA,
      ZZ1_INCIDENTAL_ITEM_5_MOA: item.ZZ1_INCIDENTAL_ITEM_5_MOA,
      ZZ1_KMGRP_ID_MOA: item.ZZ1_KMGRP_ID_MOA,
      ZZ1_KMGRP_NM_MOA: item.ZZ1_KMGRP_NM_MOA,
      ZZ1_TARGET_TIME_MOA: item.ZZ1_TARGET_TIME_MOA,
      id: item.id,
      details: item.details
    };
    return treedata;
  };

  // データ生成
  const delItem = (data) => {
    const item = [];
    item.ManufacturingOrder = data.ManufacturingOrder
    item.ManufacturingOrderOperation = data.ManufacturingOrderOperation
    item.DurationUnit = "";
    item.EffectivityParameterDesc = "";
    item.ManufacturingOrderImportance = ""
    item.ManufacturingOrderText = ""
    item.Material = ""
    item.MaterialName = ""
    item.MfgOpActyExecutionPriority = ""
    item.MfgOrderOperationText = ""
    item.NrOfOpActyTeamAssignments = ""
    item.NrOfOpActyUserAssignments = ""
    item.NumberOfActiveShopFloorItems = ""
    item.OpActualExecutionEndDateTime = ""
    item.OpActualExecutionStartDateTime = ""
    item.OpActyConfIsSFIBased = ""
    item.OpActyExpdExecDurnInSeconds = ""
    item.OpActyExpdExecutionDuration = ""
    item.OpActyExpdExecutionLaborDurn = ""
    item.OpActyHasMissingComponents = ""
    item.OpActyIsSeldForRtactvPostg = ""
    item.OpActyNtwkElement = ""
    item.OpActyNtwkElementExternalID = ""
    item.OpActyNtwkInstance = ""
    item.OpActyNtwkSegmentType = ""
    item.OpActyNtwkSegmentTypeText = ""
    item.OpLtstSchedldExecEndDteTme = ""
    item.OpLtstSchedldExecStrtDteTme = ""
    item.OperationActivityHasProdnHold = ""
    item.OperationActivityName = ""
    item.OperationExecutionAvailableQty = ""
    item.OrderIsTechnicallyCompleted = ""
    item.ProductionHold = ""
    item.ProductionPlant = ""
    item.ProductionUnit = ""
    item.RespyMgmtTeamID = ""
    item.SASStatusCategory = ""
    item.SASStatusCategoryName = ""
    item.SASStatusName = ""
    item.Start_rtactv_ac = ""
    item.StatusAndActionSchemaStatus = ""
    item.TeamName = ""
    item.UserDescription = ""
    item.WorkCenter = ""
    item.WorkCenterText = ""
    item.ZZ1_ACTGRP_ID_MOA = ""
    item.ZZ1_ACTGRP_NM_MOA = ""
    item.ZZ1_ASSIGN_TEMPLATE_ID_MOA = ""
    item.ZZ1_ASSIGN_TEMPLATE_NM_MOA = ""
    item.ZZ1_INCIDENTAL_ITEM_1_MOA = ""
    item.ZZ1_INCIDENTAL_ITEM_2_MOA = ""
    item.ZZ1_INCIDENTAL_ITEM_3_MOA = ""
    item.ZZ1_INCIDENTAL_ITEM_4_MOA = ""
    item.ZZ1_INCIDENTAL_ITEM_5_MOA = ""
    item.ZZ1_KMGRP_ID_MOA = ""
    item.ZZ1_KMGRP_NM_MOA = ""
    item.ZZ1_TARGET_TIME_MOA = ""
    item.details = ""
    return item;
  };

  /**
   * 完了データ取得
   * @param {検索項目テキスト} search 
   * @param {対象日付} tdate 
   * @param {対象日付前日} lastTdate 
   * @returns 完了データ
   */
  const CompletionData = async (search, tdate, lastTdate) => {
    setWorkItems([]);         // 空にする
    let unfinishedTime = 0;   // 未完了残作業時間集計用

    // パラメータ
    // filter
    const filterStatus = 'SASStatusCategory eq 3';
    const filterDate = " and (OpLtstSchedldExecStrtDteTme ge datetimeoffset'" + lastTdate + "T15:00:00Z' and OpLtstSchedldExecStrtDteTme le datetimeoffset'"+ tdate +"T14:59:59Z')"
    const filter = filterStatus + filterDate
    // orderby
    const orderby = 'ManufacturingOrder asc,ManufacturingOrderOperation asc';
    // 検索テキスト
    const strSearch =  search;
    // 言語
    const strLang = getLanguage();

    // データ取得
    // Odata送信
    const _items = await getTableData(filter, orderby, strSearch, strLang);
    // エラーの場合
    if(_items.data || _items.status){
      // ODataサービスエラーメッセージ
      if(!_items.data.error || _items.status){
        setErrMessage(_items.data);
      }else{
        setErrMessage(_items.data.error.message.value);
      }
      setErrBoxOpen(true);
      throw new Error(_items.error);
    };
    // 完了件数
    const compCount = _items.length;

    // 完了データを表示用に編集
    const itemsWithIds = _items.map((item, index) => {
      item.id = index;
      item.details = i18nBundle.getText('detailsText');
      // datetime型⇒yyyy/MM/dd
      // 計画開始
      if(item.OpLtstSchedldExecStrtDteTme) item.OpLtstSchedldExecStrtDteTme = dateFormatMilliseconds(item.OpLtstSchedldExecStrtDteTme);
      // 計画終了
      if(item.OpLtstSchedldExecEndDteTme) item.OpLtstSchedldExecEndDteTme = dateFormatMilliseconds(item.OpLtstSchedldExecEndDteTme);
      // 実際開始
      if(item.OpActualExecutionStartDateTime) item.OpActualExecutionStartDateTime = dateFormatMilliseconds(item.OpActualExecutionStartDateTime);
      // 実績終了
      if(item.OpActualExecutionEndDateTime) item.OpActualExecutionEndDateTime = dateFormatMilliseconds(item.OpActualExecutionEndDateTime);
      // 指図技術的完了
      if(item.OrderIsTechnicallyCompleted){
        // はい
        item.OrderIsTechnicallyCompleted = i18nBundle.getText('YesText')
      } else {
        // いいえ
        item.OrderIsTechnicallyCompleted = i18nBundle.getText('NoText')
      }
      return item;
    });

    // 未完了データ取得
    const incompfilterStatus = '(SASStatusCategory eq 2 or SASStatusCategory eq 1 or SASStatusCategory eq 5)';
    const incompFilter = incompfilterStatus + filterDate
    const _incompItems = await getTableData(incompFilter, orderby, strSearch, strLang);
    // エラーの場合
    if(_incompItems.data || _incompItems.status){
      // ODataサービスエラーメッセージ
      if(!_incompItems.data.error || _incompItems.status){
        setErrMessage(_incompItems.data);
      }else{
        setErrMessage(_incompItems.data.error.message.value);
      }
      setErrBoxOpen(true);
      throw new Error(_incompItems.error);
    };
    // 未完了件数
    const incompCount = _incompItems.length;
    // 未完了残作業時間算出のためループ
    _incompItems.map((item, index) => {
      item.id = index;
      // 時間集計
      if(item.DurationUnit == "MIN"){
        unfinishedTime = parseFloat(unfinishedTime) + parseFloat(item.OpActyExpdExecutionDuration);
      } else {
        // MIN以外の単位は時間と見なす
        unfinishedTime = unfinishedTime + parseFloat(item.OpActyExpdExecutionDuration) * 60;
      }
    });

    // 表示項目処理
    // 未完了件数表示
    setIncompCount(incompCount);
    // 完了件数表示
    setCompCount(compCount)

    // 進捗率計算 
    if((compCount + incompCount) != 0){
      // 完了件数 + 未完了件数が0件以上
      // 完了件数 / ( 完了件数 + 未完了件数 ) × 100 ※四捨五入
      const res = Math.round(compCount / (compCount + incompCount) * 100);
      setRate(res.toString().padStart(2,"　"));
    } else {
      // 完了件数 + 未完了件数が0
      setRate("0".padStart(2,"　"));
    }
    // 未完了時間を算出
    const min = unfinishedTime > 0? unfinishedTime % 60: 0;
    setUnfinishedMin(min.toString().padStart(2,"　"));
    const hour = parseInt(unfinishedTime > 0? unfinishedTime / 60: 0);
    setUnfinishedHour(hour.toString().padStart(2,"　"));

    // 完了データ格納
    setWorkData(itemsWithIds);
    // 完了一覧テーブルにバインド
    setWorkItems(itemsWithIds);

    return;
  };

  // 作業開始ボタン押下
  const onBtnWorkStart = async () => {
    setErrMessage("");
    // 未選択チェック
    if(OpActyNtwkInstance == "" || OpActyNtwkElement == ""){
      setErrMessage(i18nBundle.getText('F_011_E'));
      // エラーメッセージボックス表示
      setErrBoxOpen(true);
      return;
    };
    // パラメータ
    // シリアル番号 or ロット品
    if(OpActyConfIsSFIBased == "X"){
      // シリアル番号
      onStartWorkSerial(OpActyNtwkInstance, OpActyNtwkElement, SASStatusCategory);
    } else {
      // ロット品
      postStartWorkLot(OpActyNtwkInstance, OpActyNtwkElement, SASStatusCategory);
    }
  };


  // 作業開始 - シリアル番号
  const onStartWorkSerial = async (opActyNtwkInstance, opActyNtwkElement, statusCategory) => {
    // Odata送信 作業開始
    try {
      // ショップフローアイテム取得
      return await getShopFloorItem()
      .then(async shopFloorItem => {
        let _items = [];
        if(shopFloorItem == SERIAL_ITEMS_PTN){
          // 2件以上の場合、シリアル番号選択一覧を表示
          // 呼び出し要素設定
          setSeriaCallDispName(LIST_PTN_WORKSTART);
          // シリアル番号一覧表示
          openDialog1();
          return;
        } else {
          // シリアル番号
          _items = await postStartWorkSerial(opActyNtwkInstance, opActyNtwkElement, shopFloorItem, statusCategory);
        }
        if(_items.error){
          // エラーの場合
          throw new Error(_items.error); 
        } else {
          const itemsWithIds = getDataList(_items);
          // データ取得
          return itemsWithIds[0];
        };
      });
    } catch (error) {
      return error;
    }
  };

  // ショップフローアイテム取得
  const getShopFloorItem  = async () => {
    return new Promise((resolve, reject) => {
      // シリアル番号 or ロット品
      if(OpActyConfIsSFIBased == "X"){
        // シリアル番号
        // Odata送信
        const strLang = getLanguage();
        getSerialNumberList(OpActyNtwkInstance, OpActyNtwkElement, strLang)
        .then((_items) => {
          // エラーの場合
          if(_items.data || _items.status){
            // ODataサービスエラーメッセージ
            if(!_items.data.error || _items.status){
              setErrMessage(_items.data);
            }else{
              setErrMessage(_items.data.error.message.value);
            }
            setErrBoxOpen(true);
            throw new Error(_items);
          };
          // データを格納
          const itemsWithIds = _items.map((item, index) => {
            item.id = index;
            return item;
          });
          // 2件以上の場合はダイアログを表示
          if(itemsWithIds.length > 1){
            // 2件以上
            setDataSerial(itemsWithIds);
            return resolve(SERIAL_ITEMS_PTN);
          }else{
            // 1件のみ
            return resolve(itemsWithIds[0].ShopFloorItem);
          }
        }).catch((_items) => {
          // エラーの場合
          return reject(_items)
        });
      } else {
        // ロット品は設定なし
        return resolve("");
      };
    })
  };

  // 作業開始ODS発行 - シリアル番号
  const postStartWorkSerial = async (opActyNtwkInstance, opActyNtwkElement, shopFloorItem, statusCategory) => {
    // ステータスカテゴリによる分岐
    let SASstatus = "";
    switch (statusCategory){
      case 1:   // 初期値
        SASstatus = "SAP_START";
        break;
      case 2:   // 処理中
          SASstatus = "LaborOn";
          break;
      case 5:   // 一時停止
        SASstatus = "SAP_UNDO_PAUSE";
        break;
      default:    // 例外
        break;
    }
    // 作業開始
    const pram2 = {
      OpActyNtwkInstance: opActyNtwkInstance,
      OpActyNtwkElement: opActyNtwkElement,
      ShopFloorItem: shopFloorItem,
      SASStatusCategory: SASstatus
    };
    // 作業開始ODS実行
    const result = await postDataSerial(pram2);
    // 結果分岐
    if(result == ""){
      // ODataサービス成功
      // 作業記録へ遷移
      navigate("/pages/TestPage", {
        // 遷移パラメータセット
        state: {
          OpActyNtwkInstance: opActyNtwkInstance,
          OpActyNtwkElement: opActyNtwkElement,
          ShopFloorItem: shopFloorItem
        }
      });
    } else {
      // ODataサービスエラーメッセージ
      if(!result.message.value){
        setErrMessage(result);
      }else{
        setErrMessage(result.message.value);
      }
      // setErrMessage(result.message.value);
      setErrBoxOpen(true);
    }
  };

  // 作業開始ODS発行 - ロット管理品
  const postStartWorkLot = async (opActyNtwkInstance, opActyNtwkElement, statusCategory) => {
    // ステータスカテゴリによる分岐
    let SASstatus = "";
    switch (statusCategory){
      case 1:   // 初期値
        SASstatus = "SAP_START";
        break;
      case 2:   // 処理中
          SASstatus = "LaborOn";
          break;
      case 5:   // 一時停止
        SASstatus = "SAP_UNDO_PAUSE";
        break;
      default:    // 例外
        break;
    }
    // Odata送信 作業開始
    // パラメータ
    const pram = {
      OpActyNtwkInstance: opActyNtwkInstance,
      OpActyNtwkElement: opActyNtwkElement,
      SASStatusCategory: SASstatus
    } 
    // Odata送信（作業開始　ロット管理品）
    const result = await postDataLot(pram);
    // 結果分岐
    if(result == ""){
      // ODataサービス成功
      // 作業記録へ遷移
      navigate("/pages/TestPage", {
        // 遷移パラメータセット
        state: {
          OpActyNtwkInstance: opActyNtwkInstance,
          OpActyNtwkElement: opActyNtwkElement,
          ShopFloorItem: ""
        }
      });
    } else {
      // ODataサービスエラーメッセージ
      if(!result.message.value){
        setErrMessage(result);
      }else{
        setErrMessage(result.message.value);
      }
      // setErrMessage(result.message.value);
      setErrBoxOpen(true);
    }
  };
  
  // シリアル番号選択後の処理
  const setSelectSerialNo = async (props) => {
    const opActyNtwkInstance = props.OpActyNtwkInstance;
    const opActyNtwkElement = props.OpActyNtwkElement;
    const shopFloorItem = props.ShopFloorItem;
    const sASStatusCategory = props.SASStatusCategory;
    if(seriaCallDispName == LIST_PTN_WORKSTART){
      // 作業開始
      postStartWorkSerial(opActyNtwkInstance, opActyNtwkElement, shopFloorItem, sASStatusCategory);
    } else if(seriaCallDispName == LIST_PTN_CONTENTS) {
      // 作業活動内容
      if (contentsPopRef.current) {
        try{
          // ショップフローアイテム取得
          let _items = [];
          const strLang = getLanguage();
          // シリアル番号のコンテンツを取得
          _items = await getContentsSerial(opActyNtwkInstance, opActyNtwkElement, shopFloorItem, strLang);
          // エラーの場合
          if(_items.data || _items.status){
            // ODataサービスエラーメッセージ
            if(!_items.data.error || _items.status){
              setErrMessage(_items.data);
            }else{
              setErrMessage(_items.data.error.message.value);
            }
            setErrBoxOpen(true);
            throw new Error(_items.error);
          };
          if(_items != null){
            const itemsWithIds = await getDataList(_items);
            // コンテンツ取得
            const div = itemsWithIds[0].MfgWorkInstructionContent;
            setDivContents(div);
            // 作業活動内容のポップアップ表示
            setContentsPopOpen((prev) => !prev);
          };
          return;
        } catch (error) {
          return;
        }
      }
    }
  };

  /**
   * シリアル番号一覧
   * @returns 
   */
  // ダイアログ - シリアル番号一覧
  const [seriaCallDispName, setSeriaCallDispName] = useState("");

  // エラーメッセージボックス
  const [errBoxOpen, setErrBoxOpen] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const ErrMessageBox = () => {
    // メッセージボックス ボタンアクション
    const errhandleClose = (event) => {
      // タブを閉じる
      setErrBoxOpen(false);
    };
   
    return (
      <MessageBox
      open={errBoxOpen}
      onClose={errhandleClose}
      type="Error"
    >
      {/* エラーメッセージ */}
      {errMessage}
    </MessageBox>
    );
  };

  // 行選択イベント
  const onRowClick = async (event) => {
    // 行選択イベント
    const Id = event.detail.row.original.id;
    if(Id > -1){
      // 選択した行データ取得
      // データをパラメータにセット
      OpActyNtwkInstance = workData[Id].OpActyNtwkInstance;     // ネットワークインスタンス
      OpActyNtwkElement = workData[Id].OpActyNtwkElement;       // ネットワークエレメント
      OpActyConfIsSFIBased = workData[Id].OpActyConfIsSFIBased; // 品目確認
      SASStatusCategory = workData[Id].SASStatusCategory;       // ステータスカテゴリ
    }

    //　各セルを押下した際の分岐
    if(event.target.id.indexOf('OpeActIncom') != -1){
      // 作業活動内容リンクID:OpeActIncom
      // 対象のリンクボタンのIDをオープナーにセット
      setContentsOpener(event.target.id);
      // 作業活動内容ポップオーバーを表示する
      await ContentsClick(event);
    } else if(event.target.id.indexOf('detailsIncom') != -1){
      // 詳細リンクID:detailsIncom
      event.markerAllowTableRowSelection = true;
      // 対象のリンクボタンのIDをオープナーにセット
      setDetailsOpener(event.target.id);
      // 詳細画面にデータを挿入
      setItemsDetails(event.detail.row.original);
      // 詳細ポップオーバーを表示する
      setPopoverIsOpen((prev) => !prev);
      // detailsClick(event);
    }
    return;
  };

  // 終了ボタンクリック
  const [openWorkEnd, setOpenWorkEnd] = useState(false);
  const onBtnWorkEnd = () => {
    setOpenWorkEnd(true);
  };

  // 終了ボタン-メッセージボックス
  const MessageBoxComponent = () => {
    // メッセージボックス ボタンアクション
    const handleClose = (event) => {
      if (event.detail.action === 'OK') {
        // OK押下時
        // タブを閉じる
        window.close();
      } else {
        // キャンセル押下時
      }
      setOpenWorkEnd(false);
    };
   
    return (
      <MessageBox
        open={openWorkEnd}
        onClose={handleClose}
        actions={['OK', 'Cancel']}
      >
        {/* 業務を終了します。よろしいですか？ */}
        {i18nBundle.getText('F_010_I')}
      </MessageBox>
    );
  };

  // 検索項目
  const SearchInput = () => {
    const valueSearch = () => {
      const strSearch = document.getElementById("valueSearchInput");
      const search = strSearch.typedInValue;
      setSearchText(search);

      // 一覧更新
      const tdate = targetDate.toString();
      UpdateList(search, tdate, currentListPtn);
    };

    return (
      <>
        <Input
          id="valueSearchInput"
          placeholder={i18nBundle.getText('txtSearch')}
          type="Text"
          valueState="None"
          value={searchText}
        />
        <Button
          design="Default"
          icon="search"
          onClick={valueSearch}
        />
      </>
    );
  };

  /**
   * 作業予定日
   * @returns 作業予定日コンポーネント
   */
  const ScheduledWorkDate = () => {
    // 作業予定日を記載
    // 日付加算ボタンクリック
    const onBtnDateAdd = () => {
      // 1日後日数計算
      const strTargetDate = targetDate.toString();
      let date = new Date(strTargetDate);
      // 加算
      date.setDate(date.getDate() + 1);
      // 日付を分解
      const year = date.getFullYear().toString();
      const month = (date.getMonth()+1).toString();
      const day = date.getDate().toString();

      // 表示用の日付を設定
      const tdate = year + "/" + month + "/" + day;
      setTargetDate(tdate);

      // 検索情報を取得
      const search = searchText.toString();

      // 一覧更新
      UpdateList(search, tdate, currentListPtn);
    };

    // 日付減算ボタンクリック
    const onBtnDateSub = () => {
      // 1日前日数計算
      const strTargetDate = targetDate.toString();
      let date = new Date(strTargetDate);
      // 減算
      date.setDate(date.getDate() - 1);
      // 日付を分解
      const year = date.getFullYear().toString();
      const month = (date.getMonth()+1).toString();
      const day = date.getDate().toString();

      // 表示用の日付を設定
      const tdate = year + "/" + month + "/" + day;
      setTargetDate(tdate);

      // 検索情報を取得
      const search = searchText.toString();
      
      // 一覧更新
      UpdateList(search, tdate, currentListPtn);
    };

    // (DatePicker)日付を変更
    const onChange = (event) => {
      setTargetDate(event.detail.value);
      // 検索情報を取得
      const search = searchText.toString();
      // 一覧更新
      UpdateList(search, event.detail.value, currentListPtn);
    };
    return (
      <>
        <Button
          // 日付減算
          class="dateArrow"
          design="Transparent"
          icon="navigation-left-arrow"
          onClick={onBtnDateSub}
        />
        <DatePicker
        onChange={onChange}
        onInput={function _a(){}}
        onValueStateChange={function _a(){}}
        primaryCalendarType="Gregorian"
        valueState="None"
        value={targetDate}
        />
        <Button
          // 日付加算
          class="dateArrow"
          design="Transparent"
          icon="navigation-right-arrow"
          onClick={onBtnDateAdd}
        />
      </>
    );
  };

  // 未完了作業時間テキスト
  const UnfinishedRemainingWorkTime = () => {
    // 未完了作業時間テキストを記載
    return (
      <>
      <span>
        <Icon className="Zpoux001_01-icon" name="customer-history" />
      </span>
        &nbsp;
        &nbsp;
      <span>
        <Text>{i18nBundle.getText('lblUnfinishedWorkTime')}</Text>
      </span>
        &nbsp;
        <Text class="Zpoux001_01-RateText">{UnfinishedHour}</Text>
        &nbsp;
        <Text>{i18nBundle.getText('txtHour')}</Text>
        &nbsp;
        <Text class="Zpoux001_01-RateText">{UnfinishedMin}</Text>
        &nbsp;
        <Text>{i18nBundle.getText('txtMin')}</Text>
      </>
    );
  };

  // 進捗率テキスト
  const ProgressRate = () => {
    // 進捗率を記載
   
    return (
      <>
        <Icon className="Zpoux001_01-icon" name="complete" />
        &nbsp;
        <Text>&nbsp;{i18nBundle.getText('lblProgressRate')}</Text>
        &nbsp;
        <Text class="Zpoux001_01-RateText">{Rate}</Text>
        &nbsp;
        <Text>&nbsp;{i18nBundle.getText('txtProgressRate')}</Text>
        {/* フィルター */}
        <Button onClick={() => {setItemSelectionOpen(true)}} design="Transparent">{i18nBundle.getText('btnFilter')}</Button>
      </>
    );
  };

  // 更新
  const ListUpdate = async (event) => {
    const tdate = targetDate.toString();
    const search = searchText.toString();
    // 一覧更新
    UpdateList(search, tdate, currentListPtn);
  };

  /**
   * 項目選択フィルター
   */
  // 項目選択 - 閉じる後処理
  const handleCloseItemSelect = () => {
    setItemSelectionOpen(false);
  };

  // カラム表示制御
  const setHideColumns = (columns) => {
    setCookie("columns", JSON.stringify(columns));
    let hideColumns = [];
    Object.keys(columns).forEach(key =>{
      if(!columns[key]){
        hideColumns.push(key);
      }
    });

    TblInstance.current.setHiddenColumns((cols) => {
      return hideColumns;
    });
  };

  const [itemSelectionOpen, setItemSelectionOpen] = useState(false);        // 項目選択画面表示制御
  const [products, setProducts] = useState(cookies.columns? cookies.columns: ItemSelectionData.data);
  const ViewSettingsDialogComponent = () => {
    // リストの表示項目　※言語対応により、ベタ書き
    const listItems = [
      {
        // 指図番号
        key : "ManufacturingOrder",
        text: i18nBundle.getText('ManufacturingOrder')
      },
      {
        // 作業番号
        key : "ManufacturingOrderOperation",
        text: i18nBundle.getText('ManufacturingOrderOperation')
      },
      {
        // 作業時間
        key : "OpActyExpdExecutionDuration",
        text: i18nBundle.getText('OpActyExpdExecutionDuration')
      },
      {
        // 作業活動ステータス
        key : "SASStatusName",
        text: i18nBundle.getText('SASStatusName')
      },
      {
        // 機種,号機
        key : "EffectivityParameterDesc",
        text: i18nBundle.getText('EffectivityParameterDesc')
      },
      {
        // 作業内容
        key : "MfgOrderOperationText",
        text: i18nBundle.getText('MfgOrderOperationText')
      },
      {
        // 作業区
        key : "WorkCenter",
        text: i18nBundle.getText('WorkCenter')
      },
      {
        // 作業活動番号
        key : "OpActyNtwkElementExternalID",
        text: i18nBundle.getText('OpActyNtwkElementExternalID')
      },
      {
        // 作業活動内容
        key : "OperationActivityName",
        text: i18nBundle.getText('OperationActivityName')
      },
      {
        // 計画開始
        key : "OpLtstSchedldExecStrtDteTme",
        text: i18nBundle.getText('OpLtstSchedldExecStrtDteTme')
      },
      {
        // チーム
        key : "TeamName",
        text: i18nBundle.getText('TeamName')
      },
      {
        // プラント
        key : "ProductionPlant",
        text: i18nBundle.getText('ProductionPlant')
      },
      {
        // 計画終了
        key : "OpLtstSchedldExecEndDteTme",
        text: i18nBundle.getText('OpLtstSchedldExecEndDteTme')
      },
      {
        // 指図技術的完了
        key : "OrderIsTechnicallyCompleted",
        text: i18nBundle.getText('OrderIsTechnicallyCompleted')
      },
      {
        // 実行優先度
        key : "MfgOpActyExecutionPriority",
        text: i18nBundle.getText('MfgOpActyExecutionPriority')
      },
      {
        // 実際開始
        key : "OpActualExecutionStartDateTime",
        text: i18nBundle.getText('OpActualExecutionStartDateTime')
      },
      {
        // 実績終了
        key : "OpActualExecutionEndDateTime",
        text: i18nBundle.getText('OpActualExecutionEndDateTime')
      },
      {
        // 品目テキスト
        key : "MaterialName",
        text: i18nBundle.getText('MaterialName')
      },
      {
        // 保留ID
        key : "ProductionHold",
        text: i18nBundle.getText('ProductionHold')
      },
      {
        // 目標労働時間
        key : "OpActyExpdExecutionLaborDurn",
        text: i18nBundle.getText('OpActyExpdExecutionLaborDurn')
      },
      {
        // 利用可能数量
        key : "OperationExecutionAvailableQty",
        text: i18nBundle.getText('OperationExecutionAvailableQty')
      },
      {
        // 詳細
        key : "details",
        text: i18nBundle.getText('details')
      }
    ];
    // number of selected item
    const disabledItem = ItemSelectionData.disabled;                  // 項目選択リスト初期選択
    const [selectedItems, setSelectedItems] = useState(products);     // 選択中データ
    const selectedItemsBeforeOpen = useRef(selectedItems);
    const [searchVal, setSearchVal] = useState();
    // 表示前処理
    const handleBeforeOpen = () => {
      // すでにチェック入ってるものはチェックを付ける
      selectedItemsBeforeOpen.current = selectedItems;
    };
    // 検索
    const handleSearch = (e) => {
      setSearchVal(e.detail.value);
    };
    // 検索フィールドの入力値をリセット
    const handleSearchReset = () => {
      setSearchVal(undefined);
    };
    // 選択/未選択
    const handleItemClick = (e) => {
      const itemText = e.detail.item.dataset.key;
      setSelectedItems((prev) => {
        if (prev[itemText]) {
          return { ...prev, [itemText]: false };
        } else {
          return { ...prev, [itemText]: true };
        }
      });
    };
    // 選択ボタン
    const handleConfirm = () => {
      setHideColumns(selectedItems);
      setProducts(selectedItems);
    };
    // キャンセル
    const handleCancel = () => {
      setSelectedItems(selectedItemsBeforeOpen.current);
    };
    return (
      <>
        <SelectDialog
          headerText={i18nBundle.getText('ItemSelectDialog')}
          open={itemSelectionOpen}
          mode={ListMode.MultiSelect}
          listProps={{ onItemClick: handleItemClick }}
          rememberSelections
          onConfirm={handleConfirm}
          onAfterClose={handleCloseItemSelect}
          onSearch={handleSearch}
          onSearchReset={handleSearchReset}
          onBeforeOpen={handleBeforeOpen}
          onCancel={handleCancel}
        >
          {new Array(22)
            .fill('')
            .map((_, index) => {
              const currentProduct = listItems[index];
              const lowerCaseSearchVal = searchVal?.toLowerCase();
              if (
                searchVal &&
                !currentProduct.text.toLowerCase().includes(lowerCaseSearchVal)
              ) {
                return null;
              }
              return (
                <StandardListItem
                  data-key={`${currentProduct.key}`}
                  key={`${currentProduct.key}`}
                  selected={selectedItems[currentProduct.key]}
                  disabled={disabledItem[currentProduct.key]}
                >
                  {currentProduct.text}
                </StandardListItem>
              );
            })
            .filter(Boolean)}
        </SelectDialog>
      </>
    );
  };

  /**
   * ポップオーバ - 作業活動内容
   */
  const [contentsPopOpen, setContentsPopOpen] = useState(false);        // 項目選択画面表示制御
  const [contentsOpener, setContentsOpener] = useState("");             // オープナー
  const ContentsPopComponent = () => {
    return (
      createPortal(
        <Popover
          id={"ContentsPop"}
          opener={contentsOpener}
          placementType="Left"
          ref={contentsPopRef}
          open={contentsPopOpen}
          onAfterClose={()=>{setContentsPopOpen(false);}}
        >
          {/* 作業活動内容 */}
          {ReactHtmlParser(divContents)}
        </Popover>,
        document.body
      )
    );
  };

  // コンテンツ取得
  const getContentsData = async () => {
    // Odata送信 作業活動内容取得（ロット管理品）
    try {
      return await getShopFloorItem()
      .then(async shopFloorItem => {
        let _items = [];
        const strLang = getLanguage();
        if(shopFloorItem == SERIAL_ITEMS_PTN){
          // 複数シリアルは別処理
          // シリアル番号一覧表示
          setSeriaCallDispName(LIST_PTN_CONTENTS);
          openDialog1();
          return null;
        } else if(shopFloorItem == ""){
          // ロット番号
          _items = await getContentsLot(OpActyNtwkInstance, OpActyNtwkElement, strLang);
        } else {
          // シリアル番号
          _items = await getContentsSerial(OpActyNtwkInstance, OpActyNtwkElement, shopFloorItem, strLang);
        }
        // エラーの場合
        if(_items.data || _items.status){
          // ODataサービスエラーメッセージ
          if(!_items.data.error || _items.status){
            setErrMessage(_items.data);
          }else{
            setErrMessage(_items.data.error.message.value);
          }
          setErrBoxOpen(true);
          throw new Error(_items.error);
        } else {
          const itemsWithIds = await getDataList(_items);
          // コンテンツ取得
          return itemsWithIds[0].MfgWorkInstructionContent;
        };
      });
    } catch (error) {
      // エラーの場合
      throw new Error(error);
      // return error;
    }
  }

  // データリスト生成
  const getDataList = (_items) => {
    // データを変数に格納
    const itemsWithIds = _items.map((item, index) => {
      item.id = index;
      return item;
    });
    return itemsWithIds;
  };

  // 作業活動内容リンク押下イベント
  const contentsPopRef = useRef(null);
  const ContentsClick =  async (event) => {
    // 作業活動内容を表示
    if (contentsPopRef.current) {
      try{
        contentsPopRef.current.opener = event.target.id;
        setOpenerId(event.target.id);
        // 作業活動内容の情報を取得
        const div = await getContentsData();
        if(div != null){
          setDivContents(div);
          // 作業活動内容のポップアップ表示
          setContentsPopOpen((prev) => !prev);
        } 
      } catch (error) {
        return;
      }
    }
  };

  /**
   * ポップオーバ - 作業詳細
   */
  // 詳細リンク押下イベント
  const popoverRef = useRef(null);

  // コンポーネント生成
  const [popoverIsOpen, setPopoverIsOpen] = useState(false);
  const [DetailsIsOpen, setDetailsOpener] = useState("");     // 詳細画面のオープナー
  const [itemsDetails, setItemsDetails] = useState([]);       // 詳細画面表示用
  const DetailsPopComponent = () => {
    return (
      createPortal(
        <Popover
          id={"detailsPop"}
          opener={DetailsIsOpen}
          // opener={'tester'}
          placementType="Left"
          ref={popoverRef}
          open={popoverIsOpen}
          onAfterClose={()=>{setPopoverIsOpen(false);}}
        >
          {/* ここに作業一覧データの詳細を記載 */}
          <ResponsiveGridLayout
            className="GridLayout"
            hSpacing="1.5rem"
            vSpacing="0.5rem"
            columnSpanL={3}
            columnSpanM={3}
            columnSpanS={3}
            columnSpanXL={3}
            columnsL={3}
            columnsM={3}
            columnsS={3}
            columnsXL={3}
            style={{width: "600px",height: "600px"}}
          >
            <React.Fragment key=".0">
              {/* 1 */}
              <div
                style={{
                  gridColumn: 'span 1'
                }}
              >
                <Label>{i18nBundle.getText('ManufacturingOrder')}</Label>
                <br />
                <Text>{itemsDetails.ManufacturingOrder}</Text>
              </div>
              {/* 2 */}
              <div
                className="Zpoux001_01-GridLayoutItem"
                style={{
                  gridColumn: 'span 1'
                }}
              >
                <Label>{i18nBundle.getText('ManufacturingOrderOperation')}</Label>
                <br />
                <Text>{itemsDetails.ManufacturingOrderOperation}</Text>
              </div>
              {/* 3 */}
              <div
                className="Zpoux001_01-GridLayoutItem"
                style={{
                  gridColumn: 'span 1'
                }}
              >
                <Label>{i18nBundle.getText('SASStatusName')}</Label>
                <br />
                <Text>{itemsDetails.SASStatusName}</Text>
              </div>
              {/* 4 */}
              <div
                className="Zpoux001_01-GridLayoutItem"
                style={{
                  gridColumn: 'span 3'
                }}
              >
              <Label>{i18nBundle.getText('EffectivityParameterDesc')}</Label>
              <br />
              <Text>{itemsDetails.EffectivityParameterDesc}</Text>
              </div>
              {/* 作業内容 */}
              <div
                className="Zpoux001_01-GridLayoutItem"
                style={{
                  gridColumn: 'span 1'
                }}
              >
              <Label>{i18nBundle.getText('MfgOrderOperationText')}</Label>
              <br />
              <Text>{itemsDetails.MfgOrderOperationText}</Text>
              </div>
              {/* 作業区 */}
              <div
                className="Zpoux001_01-GridLayoutItem"
                style={{
                  gridColumn: 'span 2'
                }}
              >
              <Label>{i18nBundle.getText('WorkCenter')}</Label>
              <br />
              <Text>{itemsDetails.WorkCenter}</Text>
              </div>
              {/* 作業活動番号 */}
              <div
                className="Zpoux001_01-GridLayoutItem"
                style={{
                  gridColumn: 'span 1'
                }}
              >
              <Label>{i18nBundle.getText('OpActyNtwkElementExternalID')}</Label>
              <br />
              <Text>{itemsDetails.OpActyNtwkElementExternalID}</Text>
              </div>
              {/* 作業活動内容 */}
              <div
                className="Zpoux001_01-GridLayoutItem"
                style={{
                  gridColumn: 'span 2'
                }}
              >
              <Label>{i18nBundle.getText('OperationActivityName')}</Label>
              <br />
              <Text>{itemsDetails.OperationActivityName}</Text>
              </div>
              {/* 計画開始 */}
              <div
                className="Zpoux001_01-GridLayoutItem"
                style={{
                  gridColumn: 'span 1'
                }}
              >
              <Label>{i18nBundle.getText('OpLtstSchedldExecStrtDteTme')}</Label>
              <br />
              <Text>{itemsDetails.OpLtstSchedldExecStrtDteTme}</Text>
              </div>
              {/* 計画終了*/}
              <div
                className="Zpoux001_01-GridLayoutItem"
                style={{
                  gridColumn: 'span 2'
                }}
              >
              <Label>{i18nBundle.getText('OpLtstSchedldExecEndDteTme')}</Label>
              <br />
              <Text>{itemsDetails.OpLtstSchedldExecEndDteTme}</Text>
              </div>
              {/* チーム*/}
              <div
                className="Zpoux001_01-GridLayoutItem"
                style={{
                  gridColumn: 'span 3'
                }}
              >
              <Label>{i18nBundle.getText('TeamName')}</Label>
              <br />
              <Text>{itemsDetails.TeamName}</Text>
              </div>
              {/* プラント*/}
              <div
                className="Zpoux001_01-GridLayoutItem"
                style={{
                  gridColumn: 'span 1'
                }}
              >
              <Label>{i18nBundle.getText('ProductionPlant')}</Label>
              <br />
              <Text>{itemsDetails.ProductionPlant}</Text>
              </div>
              {/* 指図技術的完了*/}
              <div
                className="Zpoux001_01-GridLayoutItem"
                style={{
                  gridColumn: 'span 2'
                }}
              >
              <Label>{i18nBundle.getText('OrderIsTechnicallyCompleted')}</Label>
              <br />
              <Text>{itemsDetails.OrderIsTechnicallyCompleted}</Text>
              </div>
              {/* 実行優先度*/}
              <div
                className="Zpoux001_01-GridLayoutItem"
                style={{
                  gridColumn: 'span 1'
                }}
              >
              <Label>{i18nBundle.getText('MfgOpActyExecutionPriority')}</Label>
              <br />
              <Text>{itemsDetails.MfgOpActyExecutionPriority}</Text>
              </div>
              {/* 実績開始*/}
              <div
                className="Zpoux001_01-GridLayoutItem"
                style={{
                  gridColumn: 'span 1'
                }}
              >
              <Label>{i18nBundle.getText('OpActualExecutionStartDateTime')}</Label>
              <br />
              <Text>{itemsDetails.OpActualExecutionStartDateTime}</Text>
              </div>
              {/* 実績終了*/}
              <div
                className="Zpoux001_01-GridLayoutItem"
                style={{
                  gridColumn: 'span 1'
                }}
              >
              <Label>{i18nBundle.getText('OpActualExecutionEndDateTime')}</Label>
              <br />
              <Text>{itemsDetails.OpActualExecutionEndDateTime}</Text>
              </div>
              {/* 品目テキスト*/}
              <div
                className="Zpoux001_01-GridLayoutItem"
                style={{
                  gridColumn: 'span 2'
                }}
              >
              <Label>{i18nBundle.getText('MaterialName')}</Label>
              <br />
              <Text>{itemsDetails.MaterialName}</Text>
              </div>
              {/* 保留ID*/}
              <div
                className="Zpoux001_01-GridLayoutItem"
                style={{
                  gridColumn: 'span 1'
                }}
              >
              <Label>{i18nBundle.getText('ProductionHold')}</Label>
              <br />
              <Text>{itemsDetails.ProductionHold}</Text>
              </div>
              {/* 作業時間*/}
              <div
                className="Zpoux001_01-GridLayoutItem"
                style={{
                  gridColumn: 'span 1'
                }}
              >
              <Label>{i18nBundle.getText('OpActyExpdExecutionDuration')}</Label>
              <br />
              <Text>{itemsDetails.OpActyExpdExecutionDuration}</Text>
              </div>
              {/* 目標労働時間*/}
              <div
                className="Zpoux001_01-GridLayoutItem"
                style={{
                  gridColumn: 'span 1'
                }}
              >
              <Label>{i18nBundle.getText('OpActyExpdExecutionLaborDurn')}</Label>
              <br />
              <Text>{itemsDetails.OpActyExpdExecutionLaborDurn}</Text>
              </div>
              {/* 利用可能数量 */}
              <div
                className="Zpoux001_01-GridLayoutItem"
                style={{
                  gridColumn: 'span 1'
                }}
              >
              <Label>{i18nBundle.getText('OperationExecutionAvailableQty')}</Label>
              <br />
              <Text>{itemsDetails.OperationExecutionAvailableQty}</Text>
              </div>
              <br/>
            </React.Fragment>
          </ResponsiveGridLayout>
        </Popover>,
        document.body
      )
    );
  };

  // 全て格納
  const TblInstance = useRef(null);
  const btnStoreAllClick =  () => {
    TblInstance.current.toggleAllRowsExpanded(false);
  };

  // 全て展開
  const btnDeploymentAllClick =  () => {
    TblInstance.current.toggleAllRowsExpanded(true);
  };
  // ソート時のイベント
  const onSortTable = (event) => {
    // 選択中のカラム
    let sortTargetId = event.detail.column.id;
    let sortTargetDirection = event.detail.sortDirection;
    // 現在のソート情報
    let currentSortBy = TblInstance.current.state.sortBy;
    let existTargetSortBy = currentSortBy.filter(item => item["id"] === sortTargetId);
    let newsortby = [];
    if(existTargetSortBy.length > 0){
      // 存在する場合
      for (let i = 0;  i < currentSortBy.length;  i++) {
        let sortItem = {};
        let item = currentSortBy[i];
        if(item.id == sortTargetId){
          if(sortTargetDirection == "clear"){
            // ソートクリアの場合
            continue;
          }
          // 既存ソート情報にソート対象のカラムが存在する場合
          sortItem.id = sortTargetId;
          sortItem.desc = sortTargetDirection == "desc"? true: false;
        } else {
          // 既存ソート情報を再設定
          sortItem.id = item.id;
          sortItem.desc = item.desc;
        }
        newsortby.push(sortItem);
      }
    } else {
      // 存在しない場合
      let addSortItem = {};
      newsortby = currentSortBy;
      addSortItem.id = sortTargetId;
      addSortItem.desc = sortTargetDirection == "desc"? true: false;
      newsortby.push(addSortItem);
    }
    // TblInstance.current.setSortBy(newsortby);
    let cookieOrderbyKeys = []; 
    for (let j = 0;  j < newsortby.length;  j++) {
      cookieOrderbyKeys.push(JSON.stringify(newsortby[j]));
    }
    setCookie("orderbyKeys", cookieOrderbyKeys.join(" ").toString());
  };

  // 入れ替え時のイベント
  const onColumnsReorder = (event) => {
    console.log(TblInstance);
    console.log(event);
    const columnsNewOrder = event.detail.columnsNewOrder.map((item) => {
      return item.id ;
    });
    setCookie("columnOrders", JSON.stringify(columnsNewOrder.toString()));
  };
  

  /**
   * メイン画面
   */
  return (
    <CookiesProvider>
    <div>
        <Toolbar
          className="Zpoux001_01-HederArea"
          design="Auto"
          toolbarStyle="Clear"
          // alignContent="End"
          style={{'height': '70px'}}
        >
        <Button  className="Zpoux001_01-TabButton" id={LIST_PTN_INCOMP} icon="account" onClick={changeListPtn} design={currentListPtn == LIST_PTN_INCOMP? "Emphasized" : "Default"}>
        </Button >
        <div>
          <Text style={{'font-size': '1em', 'font-weight': 'bold'}}>{IncompCount}</Text>
          <br/>
          <Text style={{'font-size': '0.8em', 'font-weight': 'bolder'}}>{i18nBundle.getText('tabIncomplete')}</Text>
        </div>
        <Button className="Zpoux001_01-TabButton" id={LIST_PTN_COMP} icon="accept" onClick={changeListPtn} design={currentListPtn == LIST_PTN_COMP? "Emphasized" : "Default"}>
        </Button>
        <div>
          <Text style={{'font-size': '1em', 'font-weight': 'bold'}}>{CompCount}</Text>
          <br/>
          <Text style={{'font-size': '0.8em', 'font-weight': 'bolder'}}>{i18nBundle.getText('tabCompletion')}</Text>
        </div>
        <FlexBox
          alignItems={FlexBoxAlignItems.Center}
          direction="Row"
          justifyContent="Start"
          wrap="NoWrap"
        >
          <SearchInput />
        </FlexBox>
        <ToolbarSpacer/>
          {/* 日付項目 */}
          <FlexBox
              alignItems={FlexBoxAlignItems.Center}
              direction="Row"
              justifyContent="Start"
              wrap="NoWrap"
          >
            <ScheduledWorkDate />
          </FlexBox>
          <ToolbarSpacer/>
          <FlexBox
            alignItems={FlexBoxAlignItems.Baseline}
            justifyContent={FlexBoxJustifyContent.End}
          >
            <UnfinishedRemainingWorkTime />
            <div
              style={{'width': '30px'}}
            ></div>
            <ProgressRate />
          </FlexBox>
        </Toolbar>
        <div className="Zpoux001_01-MainFrameContents">
          <AnalyticalTable
            columns={COLUMNS}
            className="tablecolor"
            data={workItems}
            scaleWidthMode={AnalyticalTableScaleWidthMode.Smart}
            filterable={false}
            groupBy={[]}
            groupable
            header=""
            infiniteScroll
            isTreeTable
            onColumnsReorder={onColumnsReorder}
            onGroup={() => {}}
            onLoadMore={() => {}}
            onRowClick={onRowClick}
            onRowExpandChange={() => {}}
            onSort={onSortTable}
            onTableScroll={() => {}}
            rowHeight={0}
            selectedRowIds={{
            }}
            selectionMode="SingleSelect"
            withRowHighlight={false}
            noDataText={i18nBundle.getText('NoData')}
            minRows={14}
            visibleRowCountMode = "Fixed"
            visibleRows = "14"
            subRowsKey = "subRows"
            selectionBehavior="RowOnly"
            tableHooks={[AnalyticalTableHooks.useOrderedMultiSort(['ManufacturingOrder','ManufacturingOrderOperation','OpActyExpdExecutionDuration','SASStatusName','EffectivityParameterDesc','MfgOrderOperationText','WorkCenter','OpActyNtwkElementExternalID','OperationActivityName','OpLtstSchedldExecStrtDteTme','TeamName','ProductionPlant','OpLtstSchedldExecEndDteTme','OrderIsTechnicallyCompleted','MfgOpActyExecutionPriority','OpActualExecutionStartDateTime','OpActualExecutionEndDateTime','MaterialName','ProductionHold','OpActyExpdExecutionLaborDurn','OperationExecutionAvailableQty','details'])]}
            tableInstance={TblInstance}
            reactTableOptions={{
              autoResetHiddenColumns: false,
              autoResetSortBy: false,
            }}
          /> 
        </div>
        <div className="Zpoux001_01-ButtonArea1">
          <FlexBox
            alignItems="Center"
            direction="Row"
            justifyContent="Left"
            wrap="NoWrap"
          >
            {/* 全て展開 */}
            <Button className="Zpoux001_01-ToolButtonLabel" icon="expand-all" onClick={btnDeploymentAllClick} design="Transparent">{i18nBundle.getText('btnDeploymentAll')}</Button>
            {/* 全て格納 */}
            <Button className="Zpoux001_01-ToolButtonLabel2" icon="back-to-top" onClick={btnStoreAllClick} design="Transparent" >{i18nBundle.getText('btnStoreAll')}</Button>
            {/* 表示更新 */}
            <Button className="Zpoux001_01-ToolButtonLabel" icon="synchronize" onClick={ListUpdate} design="Transparent">{i18nBundle.getText('btnUpdate')}</Button>
          </FlexBox> 
        </div>
        <FlexBox
          className="Zpoux001_01-ButtonArea2"
          direction={FlexBoxDirection.Row}
          justifyContent={FlexBoxJustifyContent.Center}
          alignItems={FlexBoxAlignItems.Center}
        >
          <Button className="Zpoux001_01-BigButton2" onClick={onBtnWorkStart} design="Emphasized" style={{ width: '300px', height: '60px' }}>{i18nBundle.getText('btnStart')}</Button>
          <Button className="Zpoux001_01-BigButton1" onClick={onBtnWorkEnd} design="Default" style={{ width: '210px', height: '60px', position: 'absolute',right: '5%', 'border': '2px solid #0070f2', 'font-weight': 'bold' }} >{i18nBundle.getText('btnFinish')}</Button>
        </FlexBox>
      <SerialNumberListModal
        componentList={dataSerial}
        closeDialog={(prop) => {
          setDialogIsOpen1(false);
          setSelectSerialNo(prop);    // データ処理処理
          closeDialog1(setDialogIsOpen1);
        }}
        cancelDialog={() => {
          closeDialog1();
        }}
        dialogIsOpen={dialogIsOpen1}
        popoverid={openerId}
      />
      <ViewSettingsDialogComponent />
      <ContentsPopComponent />
      <DetailsPopComponent />
      <MessageBoxComponent />
      <ErrMessageBox />
    </div>
    </CookiesProvider>
  );
}