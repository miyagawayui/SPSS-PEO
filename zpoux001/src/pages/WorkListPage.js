import React, { useEffect, useState } from "react";
import { getTableData, getTableCount, postDataLot, getSerialNumberList } from "api/OdataManager";
import "@ui5/webcomponents/dist/TabContainer";
import "@ui5/webcomponents/dist/Tab";
import "@ui5/webcomponents/dist/TabSeparator"; 
import { AnalyticalTable, FlexBox, Option, Select,ThemeProvider, AnalyticalTableScaleWidthMode } from '@ui5/webcomponents-react';
import { Page } from '@ui5/webcomponents-react';
import { Label } from '@ui5/webcomponents-react';
import { Button, MessageBox } from '@ui5/webcomponents-react';

// 画面遷移
// 画面遷移
import { useNavigate, useSearchParams } from "react-router-dom";

// アイコン
// import "@ui5/webcomponents-icons/dist/AllIcons";
import "@ui5/webcomponents-icons/dist/accept";
import "@ui5/webcomponents-icons/dist/group";

// 言語関係
// import { registerI18nLoader } from "@ui5/webcomponents-base/dist/i18nBundle.js";
import { useI18nBundle } from '@ui5/webcomponents-react-base';
import { setFetchDefaultLanguage } from "@ui5/webcomponents-base/dist/config/Language.js";

setFetchDefaultLanguage(true);				// 英語のpropertiesを使えるようにする設定　※SAPの仕様でsetFetchDefaultLanguageをtrueにしないとenが読み込めない
const PAGE_SIZE = 15;

export default function WorkListPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
    
  // Number of rows which exist on the service
  const [rowCount, setRowCount] = useState(0);

  
  // 変数定義
  var OpActyNtwkInstance = "";
  var OpActyNtwkElement = "";
  var ShopFloorItem = "";
  var OpActyConfIsSFIBased = "";
  const i18nBundle = useI18nBundle('i18n_WorkListPage');
  const i18n = useI18nBundle('i18n');

  useEffect(() => {
    // when component mounted
    loadData(true);
  }, []);

  // 一覧データ読み込み
  const loadData = async (isFirstLoad, skip = 0) => {
    try {
      setItems([]);     // 空にする
      setLoading(true); // ローディング画面表示

      // Odata送信
      const params = {
      } 
      const _items = await getTableData(params);

      // データ取得
      const itemsWithIds = _items.map((item, index) => {
        item.id = index;
        return item;
      });

      // テーブルにバインド
      setItems(itemsWithIds);

      console.log(itemsWithIds);
    } finally {
      setLoading(false);
    }
  };

  // 作業開始ボタン押下
  const onBtnWorkStart = async () => {
    setErrMessage("");
    // パラメータ
    const pram = {
      OpActyNtwkInstance: OpActyNtwkInstance,
      OpActyNtwkElement: OpActyNtwkElement
    } 
    // シリアル番号 or ロット品
    if(OpActyConfIsSFIBased == "X"){
      // シリアル番号
      // TODO:シリアル番号選択一覧処理
      // Odata送信
      const _items = await getSerialNumberList(pram);
      // データ取得
      const itemsWithIds = _items.map((item, index) => {
        item.id = index;
        return item;
      });

      console.log(itemsWithIds);

      ShopFloorItem = "225l";

      // 作業開始
      // TODO:作業開始ODS実装

    } else {
      // ロット品
      ShopFloorItem = "";

      // 作業開始ODS実行
      const result = await postDataLot(pram);
      console.log(result);

      // 結果分岐
      if(result == ""){
        // ODataサービス成功
        // 作業記録へ遷移
        navigate("/pages/TestPage", {
          // 遷移パラメータセット
          state: {
            OpActyNtwkInstance: OpActyNtwkInstance,
            OpActyNtwkElement: OpActyNtwkElement,
            ShopFloorItem: ShopFloorItem
          } 
        });
      } else {
        // ODataサービスエラーメッセージ
        setErrMessage(result.message.value);
        setErrBoxOpen(true);
      }
    }
  };

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
  const [selectedRow, setSelectedRow] = useState();
  const rowSelect = (event) => {
    console.log(event.detail.row.id);
    console.log(items[event.detail.row.id]);
    // データをパラメータにセット
    OpActyNtwkInstance = items[event.detail.row.id].OpActyNtwkInstance;     // ネットワークインスタンス
    OpActyNtwkElement = items[event.detail.row.id].OpActyNtwkElement;       // ネットワークエレメント
    OpActyConfIsSFIBased = items[event.detail.row.id].OpActyConfIsSFIBased; // 品目確認
  };
  
  // 終了ボタンクリック
  const [open, setOpen] = useState(false);
  const onBtnWorkEnd = () => {
    setOpen(true);
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
      setOpen(false);
    };
   
    return (
      <MessageBox
      open={open}
      onClose={handleClose}
      actions={['OK', 'Cancel']}
    >
      {/* 業務を終了します。よろしいですか？ */}
      {i18nBundle.getText('F_010_I')}
    </MessageBox>
    );
  };
  
  return (
    <>
      <Page
        backgroundDesign="Solid"
        style={{
          height: '100svh'
        }}
      >
        <ui5-tabcontainer>
          <ui5-tab icon="group" text={i18nBundle.getText('tabCompletion')} selected>
            <AnalyticalTable
              columns={[
                {
                  Header: '指図番号',
                  accessor: 'ManufacturingOrder',
                  enableMultiSort: true,
                  disableDragAndDrop: true,
                },
                {
                  Header: '作業番号',
                  accessor: 'ManufacturingOrderOperation',
                  enableMultiSort: true,
                  disableDragAndDrop: true
                },
                {
                  Header: '作業時間',
                  accessor: 'OpActyExpdExecutionDuration',
                  enableMultiSort: true
                },
                {
                  Header: '作業活動ステータス',
                  accessor: 'SASStatusName',
                  enableMultiSort: true
                },
                {
                  Header: '機種,号機',
                  accessor: 'EffectivityParameterDesc',
                  enableMultiSort: true
                },
                {
                  Header: '作業内容',
                  accessor: 'OperationActivityName',
                  enableMultiSort: true
                },
                {
                  Header: '作業区',
                  accessor: 'WorkCenter',
                  enableMultiSort: true
                },
                {
                  Header: '作業活動番号',
                  accessor: 'OpActyNtwkElementExternalID',
                  enableMultiSort: true
                },
                {
                  Header: '作業活動内容',
                  accessor: 'MfgOrderOperationText',
                  enableMultiSort: true
                },
                {
                  Header: '詳細',
                  accessor: 'details',
                  enableMultiSort: true,
                  disableDragAndDrop:true
                }
              ]}
              data={items}
              scaleWidthMode={AnalyticalTableScaleWidthMode.Smart}
              filterable
              groupBy={[]}
              groupable
              header=""
              infiniteScroll
              // isTreeTable
              onColumnsReorder={() => {}}
              onGroup={() => {}}
              onLoadMore={() => {}}
              onRowClick={() => {}}
              onRowExpandChange={() => {}}
              onRowSelect={rowSelect}
              onSort={() => {}}
              onTableScroll={() => {}}
              rowHeight={0}
              selectedRowIds={{
              }}
              selectionMode="SingleSelect"
              withRowHighlight
              noDataText="データなし"
              minRows={15}
              visibleRowCountMode = "Fixed"
              visibleRows = "15"
            />
          </ui5-tab>
          <ui5-tab icon="accept" text={i18nBundle.getText('tabIncomplete')}>
            <AnalyticalTable
              columns={[
                {
                  Header: '指図番号',
                  accessor: 'ManufacturingOrder',
                  enableMultiSort: true,
                  disableDragAndDrop: true,
                },
                {
                  Header: '作業番号',
                  accessor: 'ManufacturingOrderOperation',
                  enableMultiSort: true,
                  disableDragAndDrop: true
                },
                {
                  Header: '作業時間',
                  accessor: 'OpActyExpdExecutionDuration',
                  enableMultiSort: true
                },
                {
                  Header: '作業活動ステータス',
                  accessor: 'SASStatusName',
                  enableMultiSort: true
                },
                {
                  Header: '機種,号機',
                  accessor: 'EffectivityParameterDesc',
                  enableMultiSort: true
                },
                {
                  Header: '作業内容',
                  accessor: 'OperationActivityName',
                  enableMultiSort: true
                },
                {
                  Header: '作業区',
                  accessor: 'WorkCenter',
                  enableMultiSort: true
                },
                {
                  Header: '作業活動番号',
                  accessor: 'OpActyNtwkElementExternalID',
                  enableMultiSort: true
                },
                {
                  Header: '作業活動内容',
                  accessor: 'MfgOrderOperationText',
                  enableMultiSort: true
                },
                {
                  Header: '詳細',
                  accessor: 'details',
                  enableMultiSort: true,
                  disableDragAndDrop:true
                }
              ]}
              data={items}
              scaleWidthMode={AnalyticalTableScaleWidthMode.Smart}
              filterable
              groupBy={[]}
              groupable
              header=""
              infiniteScroll
              onColumnsReorder={() => {}}
              onGroup={() => {}}
              onLoadMore={() => {}}
              onRowClick={() => {}}
              onRowExpandChange={() => {}}
              onRowSelect={() => {}}
              onSort={() => {}}
              onTableScroll={() => {}}
              rowHeight={0}
              selectedRowIds={{
              }}
              selectionMode="SingleSelect"
              withRowHighlight
              noDataText="データなし"
              minRows={15}
              visibleRowCountMode = "Fixed"
              visibleRows = "15"
            />
          </ui5-tab>
        </ui5-tabcontainer>
        <FlexBox
          alignItems="Stretch"
          direction="Row"
          justifyContent="Center"
          wrap="NoWrap"
        >
          <Button onClick={onBtnWorkStart} design="Emphasized">{i18nBundle.getText('btnStart')}</Button>
          <Button onClick={onBtnWorkEnd} design="Default" style={{position: 'absolute',right: "5%"}} >{i18nBundle.getText('btnFinish')}</Button>
        </FlexBox> 
      </Page>
      <MessageBoxComponent />
      <ErrMessageBox />
    </>
  );
}
