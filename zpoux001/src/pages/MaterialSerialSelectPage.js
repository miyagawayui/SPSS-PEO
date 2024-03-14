import React, { useEffect, useState } from "react";
import { getTableData, getTableCount, postDataLot, getSerialNumberList } from "api/OdataManager";
import "@ui5/webcomponents/dist/TabContainer";
import "@ui5/webcomponents/dist/Tab";
import "@ui5/webcomponents/dist/TabSeparator"; 
import { AnalyticalTable, FlexBox, Option, Select,ThemeProvider, AnalyticalTableScaleWidthMode } from '@ui5/webcomponents-react';
import { Page } from '@ui5/webcomponents-react';
import { Label } from '@ui5/webcomponents-react';
import { Button, MessageBox } from '@ui5/webcomponents-react';

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

export default function MaterialSerialSelectPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
    
  // Number of rows which exist on the service
  const [rowCount, setRowCount] = useState(0);
  
  // 変数定義
  //  const OpActyNtwkInstance = "";
  //  const OpActyNtwkElement = "";
  //  const ShopFloorItem = "";
  //  const OpActyConfIsSFIBased = "";
  const i18nBundle = useI18nBundle('i18n_MaterialSerialSelectPage');
  const i18n = useI18nBundle('i18n');

  //品目/シリアル、指図/作業選択画面の変数
  const [initial_select_screen_dictr, setInitial_select_screen_dict] = useState({
    manufacturing_order:""
    ,operation:""
    ,material:"" 
    ,serial_number:""    
  });
 
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
        </ui5-tabcontainer>
        <FlexBox
          alignItems="Stretch"
          direction="Row"
          justifyContent="Center"
          wrap="NoWrap"
        >
          <Button onClick={onBtnWorkStart} design="Emphasized">{i18nBundle.getText('btnStart')}</Button>
        </FlexBox> 
      </Page>
      <MessageBoxComponent />
      <ErrMessageBox />
    </>
  );
}