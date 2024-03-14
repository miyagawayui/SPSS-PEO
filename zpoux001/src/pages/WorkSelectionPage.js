import React, { useEffect, useState } from "react";
import "@ui5/webcomponents/dist/TabContainer";
import "@ui5/webcomponents/dist/Tab";
import "@ui5/webcomponents/dist/TabSeparator";
import { AnalyticalTable, FlexBox, Option, Select, ThemeProvider, AnalyticalTableScaleWidthMode } from '@ui5/webcomponents-react';
import { Page } from '@ui5/webcomponents-react';
import { Button, MessageBox, RadioButton } from '@ui5/webcomponents-react';
import { WorkSelectionDialog } from "components/WorkSelectionModal"

// 画面遷移
import { useNavigate, useSearchParams } from "react-router-dom";

// アイコン
import "@ui5/webcomponents-icons/dist/accept";
import "@ui5/webcomponents-icons/dist/group";

// 言語関係
import { useI18nBundle } from '@ui5/webcomponents-react-base';
import { setFetchDefaultLanguage } from "@ui5/webcomponents-base/dist/config/Language.js";

setFetchDefaultLanguage(true);				// 英語のpropertiesを使えるようにする設定　※SAPの仕様でsetFetchDefaultLanguageをtrueにしないとenが読み込めない
const PAGE_SIZE = 15;

export default function WorkSelectionPage() {

    const [showWorkSelectionDialog, setShowWorkSelectionDialog] = useState(false)
    const closeWorkSelectionDialog = () => {
        setShowWorkSelectionDialog(false);
    }

    // 変数定義
    const i18nBundle = useI18nBundle('i18n_WorkListPage');
    const i18n = useI18nBundle('i18n');

    return (
        <>
            <Page
                backgroundDesign="Solid"
                style={{
                    height: '100svh'
                }}
            >
                <FlexBox>
                    <RadioButton name="GroupA" text="指図/作業検索" />
                    <RadioButton name="GroupA" text="品目/シリアル番号検索" />
                </FlexBox>
                <Button onClick={() => setShowWorkSelectionDialog(true)}>作業開始</Button>
            </Page>
            <WorkSelectionDialog isOpen={showWorkSelectionDialog} closeDialog={closeWorkSelectionDialog} />
        </>
    );
}
