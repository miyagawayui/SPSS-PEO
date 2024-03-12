import React, { useEffect, useState } from "react";
import { getTableData, getTableCount, postDataLot, getSerialNumberList } from "api/OdataManager";
import "@ui5/webcomponents/dist/TabContainer";
import "@ui5/webcomponents/dist/Tab";
import "@ui5/webcomponents/dist/TabSeparator"; 
import { AnalyticalTable, FlexBox, Option, Select,ThemeProvider, AnalyticalTableScaleWidthMode, FlexBoxJustifyContent, FlexBoxAlignItems } from '@ui5/webcomponents-react';
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
import { setFetchDefaultLanguage } from "@ui5/webcomponents-base/dist/config/Language";

//ラジオボタン
import { RadioButton } from "@ui5/webcomponents-react";

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

  //品目/シリアル、指図/作業選択画面
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
              name: 'RadioButton Groups',
              render() {
                return <FlexBox style={{
                  width: '600px'
                }} justifyContent={FlexBoxJustifyContent.SpaceBetween}></FlexBox>
                <FlexBox alignItems={FlexBoxAlignItems.Center}>
                  <RadioButton name="GroupA" text="指図/作業検索" />
                  <RadioButton name="GroupA" text="品目/シリアル番号検索" />
                </FlexBox>
              }
        </ui5-tabcontainer>


        <Button onClick={onBtnWorkStart} design="Emphasized">{i18nBundle.getText('btnStart')}</Button>     

      </Page>
    </>
  );
}
