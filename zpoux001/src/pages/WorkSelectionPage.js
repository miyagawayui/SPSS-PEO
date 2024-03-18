import React, { useEffect, useState } from "react";
import "@ui5/webcomponents/dist/TabContainer";
import "@ui5/webcomponents/dist/Tab";
import "@ui5/webcomponents/dist/TabSeparator";
import { Page, ResponsiveGridLayout, Toolbar, ToolbarSpacer } from '@ui5/webcomponents-react';
import { Button, RadioButton, Input, Label, FlexBox, Icon } from '@ui5/webcomponents-react';
import { OASelectDialog } from "components/OASelectDialog"
import { OrderSearchDialog } from 'components/OrderSearchDialog'
import { OpSearchDialog } from 'components/OpSearchDialog'
import { ItemSearchDialog } from 'components/ItemSearchDialog'
import { SerialSearchDialog } from 'components/SerialSearchDialog'
import "../App.css";


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

    // 作業活動選択の変数定義
    const [showOASelectDialog, setShowOASelectDialog] = useState(false);
    const closeWorkSelectionDialog = () => {
        setShowOASelectDialog(false);
    }

    // 指図検索ヘルプの変数定義
    const [showOrderSearchDialog, setShowOrderSearchDialog] = useState(false);
    const closeOrderSearchDialog = () => {
        setShowOrderSearchDialog(false);
    }

    // 作業検索ヘルプの変数定義
    const [showOpSearchDialog, setShowOpSearchDialog] = useState(false);
    const closeOpSearchDialog = () => {
        setShowOpSearchDialog(false);
    }

    // 品目検索ヘルプの変数定義
    const [showItemSearchDialog, setShowItemSearchDialog] = useState(false);
    const closeItemSearchDialog = () => {
        setShowItemSearchDialog(false);
    }

    // シリアル番号検索ヘルプの変数定義
    const [showSerialSearchDialog, setShowSerialSearchDialog] = useState(false);
    const closeSerialSearchDialog = () => {
        setShowSerialSearchDialog(false);
    }

    // モード活性制御
    const [searchMode, setSearchMode] = useState('orderOp');
    const handleRadioChange = (e) => {
        setSearchMode(e.target.value);
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
                {/* <FlexBox justifyContent="Center">
                    <RadioButton name="mode" text="指図/作業検索" />
                    <RadioButton name="mode" text="品目/シリアル番号検索" />
                </FlexBox>
                <Label>指図/作業検索</Label>
                <FlexBox justifyContent="Center" alignItems="Center">
                    <Label>指図：</Label>
                    <Input icon={
                        <Icon
                            name="value-help"
                            onClick={() => setShowOrderSearchDialog(true)}>
                        </Icon>}
                        maxlength={12}
                        type="Number"
                    >
                    </Input>
                    <Label>作業：</Label>
                    <Input icon={
                        <Icon
                            name="value-help"
                            onClick={() => setShowOpSearchDialog(true)}>
                        </Icon>}
                        maxlength={4}
                        type="Number"
                    >
                    </Input>
                </FlexBox>
                <Label>品目・シリアル番号検索</Label>
                <FlexBox justifyContent="Center" alignItems="Center">
                    <Label>品目：</Label>
                    <Input icon={
                        <Icon
                            name="value-help"
                            onClick={() => setShowItemSearchDialog(true)}>
                        </Icon>}
                        maxlength={40}
                    >
                    </Input>
                    <Label>シリアル番号：</Label>
                    <Input icon={
                        <Icon
                            name="value-help"
                            onClick={() => setShowSerialSearchDialog(true)}>
                        </Icon>}
                        maxlength={18}
                    >
                    </Input>
                </FlexBox>
                <Button onClick={() => setShowOASelectDialog(true)}>作業開始</Button> */}


                {/* ResponsiveGridLayoutを用いた実装 */}
                {/* <ResponsiveGridLayout columnsXL={12} columnSpanXL={2} columnSpanL={2} columnSpanM={3} columnSpanS={12} className="grid-row">
                    <div></div>
                    <div></div>
                    <div>
                        <RadioButton name="mode" value='orderOp' checked={searchMode === 'orderOp'} onChange={handleRadioChange} text="指図/作業検索" />
                    </div>
                    <div>
                        <RadioButton name="mode" value='itemSerial' checked={searchMode === 'itemSerial'} onChange={handleRadioChange} text="品目/シリアル番号検索" />
                    </div>
                </ResponsiveGridLayout>
                <ResponsiveGridLayout columnsXL={12} columnSpanXL={2} columnSpanL={2} columnSpanM={6} columnSpanS={12} className="grid-row">
                    <div style={{
                        // background: 'var(--sapAccentColor1)',
                        gridColumn: 'span 3'
                    }}></div>
                    <div class="input-title">
                        <Label>指図/作業検索</Label>
                    </div>
                </ResponsiveGridLayout>
                <ResponsiveGridLayout
                    columnsXL={12}
                    columnSpanXL={2}
                    columnSpanL={2}
                    columnSpanM={6}
                    columnSpanS={6}
                    className="grid-row"
                    style={{
                        alignItems: 'center'
                    }}>
                    <div></div>
                    <div class="input-label">
                        <Label>指図：</Label>
                    </div>
                    <div>
                        <Input icon={
                            <Icon
                                name="value-help"
                                onClick={() => setShowOrderSearchDialog(true)}>
                            </Icon>}
                            maxlength={12}
                            type="Number"
                            disabled={searchMode !== 'orderOp'}

                        >
                        </Input>
                    </div>
                    <div class="input-label">
                        <Label>作業：</Label>
                    </div>
                    <div>
                        <Input icon={
                            <Icon
                                name="value-help"
                                onClick={() => setShowOpSearchDialog(true)}>
                            </Icon>}
                            maxlength={4}
                            type="Number"
                            disabled={searchMode !== 'orderOp'}
                        >
                        </Input>
                    </div>
                </ResponsiveGridLayout>
                <ResponsiveGridLayout columnsXL={12} columnSpanXL={2} columnSpanL={2} columnSpanM={6} columnSpanS={12} className="grid-row">
                    <div style={{
                        // background: 'var(--sapAccentColor1)',
                        gridColumn: 'span 3'
                    }}></div>
                    <div class="input-title">
                        <Label>品目/シリアル番号検索</Label>
                    </div>
                </ResponsiveGridLayout>
                <ResponsiveGridLayout
                    columnsXL={12}
                    columnSpanXL={2}
                    columnSpanL={2}
                    columnSpanM={6}
                    columnSpanS={6}
                    className="grid-row"
                    rowGap="1rem"
                    style={{
                        alignItems: 'center'
                    }}>
                    <div></div>
                    <div class="input-label">
                        <Label>品目：</Label>
                    </div>
                    <div>
                        <Input icon={
                            <Icon
                                name="value-help"
                                onClick={() => setShowItemSearchDialog(true)}>
                            </Icon>}
                            maxlength={40}
                            type="Number"
                            disabled={searchMode !== 'itemSerial'}
                        >
                        </Input>
                    </div>
                    <div class="input-label">
                        <Label>シリアル番号：</Label>
                    </div>
                    <div>
                        <Input icon={
                            <Icon
                                name="value-help"
                                onClick={() => setShowSerialSearchDialog(true)}>
                            </Icon>}
                            maxlength={18}
                            type="Number"
                            disabled={searchMode !== 'itemSerial'}
                        >
                        </Input>
                    </div>
                </ResponsiveGridLayout>
                <ResponsiveGridLayout columnsXL={12} columnSpanL={1} className="grid-row">
                    <div style={{
                        // background: 'var(--sapAccentColor1)',
                        gridColumn: 'span 9'
                    }}></div>
                    <div class='input-label'>
                        <Button design="Emphasized" onClick={() => setShowOASelectDialog(true)}>作業開始</Button>
                    </div>
                </ResponsiveGridLayout> */}



                {/* Toolbarを用いた実装 */}
                <Toolbar numberOfAlwaysVisibleItems={1} toolbarStyle="Clear" style={{'background-color': 'blue'}}>
                    {/* <FlexBox justifyContent="Center"> */}
                        <RadioButton
                            name="mode"
                            value='orderOp'
                            checked={searchMode === 'orderOp'}
                            onChange={handleRadioChange}
                            text="指図/作業検索"
                        />
                        <RadioButton
                            name="mode"
                            value='itemSerial'
                            checked={searchMode === 'itemSerial'}
                            onChange={handleRadioChange}
                            text="品目/シリアル番号検索"
                        />
                    {/* </FlexBox> */}
                </Toolbar>
                <Toolbar numberOfAlwaysVisibleItems={1} toolbarStyle="Clear">
                    <Label>指図/作業検索</Label>
                </Toolbar>
                <Toolbar numberOfAlwaysVisibleItems={1} toolbarStyle="Clear" className="center" alignItems="Center">
                    <Label>指図：</Label>
                    <Input icon={
                        <Icon
                            name="value-help"
                            onClick={() => setShowOrderSearchDialog(true)}>
                        </Icon>}
                        maxlength={12}
                        type="Number"
                        disabled={searchMode !== 'orderOp'}
                    >
                    </Input>
                    <Label>作業：</Label>
                    <Input icon={
                        <Icon
                            name="value-help"
                            onClick={() => setShowOpSearchDialog(true)}>
                        </Icon>}
                        maxlength={4}
                        type="Number"
                        disabled={searchMode !== 'orderOp'}
                    >
                    </Input>
                </Toolbar>
                <Toolbar numberOfAlwaysVisibleItems={1} toolbarStyle="Clear">
                    <Label>品目・シリアル番号検索</Label>
                </Toolbar>
                <Toolbar numberOfAlwaysVisibleItems={1} toolbarStyle="Clear">
                    <Label>品目：</Label>
                    <Input icon={
                        <Icon
                            name="value-help"
                            onClick={() => setShowItemSearchDialog(true)}>
                        </Icon>}
                        maxlength={40}
                        disabled={searchMode !== 'itemSerial'}
                    >
                    </Input>
                    <Label>シリアル番号：</Label>
                    <Input icon={
                        <Icon
                            name="value-help"
                            onClick={() => setShowSerialSearchDialog(true)}>
                        </Icon>}
                        maxlength={18}
                        disabled={searchMode !== 'itemSerial'}
                    >
                    </Input>
                </Toolbar>
                <Toolbar numberOfAlwaysVisibleItems={1} toolbarStyle="Clear">
                    <Button
                        design="Emphasized"
                        onClick={() => setShowOASelectDialog(true)}
                    >
                        作業開始
                    </Button>
                </Toolbar>
            </Page>
            <OASelectDialog isOpen={showOASelectDialog} closeDialog={closeWorkSelectionDialog} />
            <OrderSearchDialog isOpen={showOrderSearchDialog} closeDialog={closeOrderSearchDialog} />
            <OpSearchDialog isOpen={showOpSearchDialog} closeDialog={closeOpSearchDialog} />
            <ItemSearchDialog isOpen={showItemSearchDialog} closeDialog={closeItemSearchDialog} />
            <SerialSearchDialog isOpen={showSerialSearchDialog} closeDialog={closeSerialSearchDialog} />
        </>
    );
}
