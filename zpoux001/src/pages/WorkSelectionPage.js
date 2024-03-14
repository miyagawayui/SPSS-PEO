import React, { useEffect, useState } from "react";
import "@ui5/webcomponents/dist/TabContainer";
import "@ui5/webcomponents/dist/Tab";
import "@ui5/webcomponents/dist/TabSeparator";
import { Page } from '@ui5/webcomponents-react';
import { Button, RadioButton, Input, Label, FlexBox, Icon } from '@ui5/webcomponents-react';
import { WorkSelectionDialog } from "components/WorkSelectionModal"
import { OrderSearchDialog } from 'components/OrderSearchDialog'
import { OpSearchDialog } from 'components/OpSearchDialog'
import { ItemSearchDialog } from 'components/ItemSearchDialog'
import { SerialSearchDialog } from 'components/SerialSearchDialog'


// 画面遷移
import { useNavigate, useSearchParams } from "react-router-dom";

// アイコン
import "@ui5/webcomponents-icons/dist/accept";
import "@ui5/webcomponents-icons/dist/group";
import "@ui5/webcomponents-icons/dist/AllIcons"

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
    //指図検索ヘルプの変数定義
    // const [showOrderSearchHelpModal, setShowOrderSearchHelpModal] = useState(false)
    const [showOrderSearchDialog, setShowOrderSearchDialog] = useState(false)
    const closeOrderSearchDialog = () => {
        setShowOrderSearchDialog(false);
    }

    //作業検索ヘルプの変数定義
    // const [showOpSearchHelpModal, setShowOpSearchHelpModal] = useState(false)
    const [showOpSearchDialog, setShowOpSearchDialog] = useState(false)
    const closeOpSearchDialog = () => {
        setShowOpSearchDialog(false);
    }

    //品目検索ヘルプの変数定義
    // const [showItemSearchHelpModal, setShowItemSearchHelpModal] = useState(false)
    const [showItemSearchDialog, setShowItemSearchDialog] = useState(false)
    const closeItemSearchDialog = () => {
        setShowItemSearchDialog(false);
    }

    //シリアル番号検索ヘルプの変数定義
    // const [showSerialSearchHelpModal, setShowSerialSearchHelpModal] = useState(false)
    const [showSerialSearchDialog, setShowSerialSearchDialog] = useState(false)
    const closeSerialSearchDialog = () => {
        setShowSerialSearchDialog(false);
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
                    <RadioButton name="mode" text="指図/作業検索" />
                    <RadioButton name="mode" text="品目/シリアル番号検索" />
                </FlexBox>
                <Label>指図/作業検索</Label>
                <FlexBox>
                    <Label>指図：</Label>
                    <Input icon={
                        <Icon
                            name="dimension"
                            onClick={() => setShowOrderSearchDialog(true)}>
                        </Icon>}
                        maxlength={12}
                        type="Number"
                    >
                    </Input>
                    <Label>作業：</Label>
                    <Input icon={
                        <Icon
                            name="dimension"
                            onClick={() => setShowOpSearchDialog(true)}>
                        </Icon>}
                        maxlength={4}
                        type="Number"
                    >
                    </Input>
                </FlexBox>
                <Label>品目・シリアル番号検索</Label>
                <FlexBox>
                    <Label>品目：</Label>
                    <Input icon={
                        <Icon
                            name="dimension"
                            onClick={() => setShowItemSearchDialog(true)}>
                        </Icon>}
                        maxlength={40}
                    >    
                    </Input>
                    <Label>シリアル番号：</Label>
                    <Input icon={
                        <Icon
                            name="dimension"
                            onClick={() => setShowSerialSearchDialog(true)}>
                        </Icon>}
                        maxlength={18}
                    >    
                    </Input>
                </FlexBox>
                <Button onClick={() => setShowWorkSelectionDialog(true)}>作業開始</Button>
            </Page>
            <WorkSelectionDialog isOpen={showWorkSelectionDialog} closeDialog={closeWorkSelectionDialog} />
            <OrderSearchDialog isOpen={showOrderSearchDialog} closeDialog={closeOrderSearchDialog}/>
            <OpSearchDialog isOpen={showOpSearchDialog} closeDialog={closeOpSearchDialog}/>
            <ItemSearchDialog isOpen={showItemSearchDialog} closeDialog={closeItemSearchDialog}/>
            <SerialSearchDialog isOpen={showSerialSearchDialog} closeDialog={closeSerialSearchDialog}/>
        </>
    );
}
