import React, { useEffect, useState } from "react";
import "@ui5/webcomponents/dist/TabContainer";
import "@ui5/webcomponents/dist/Tab";
import "@ui5/webcomponents/dist/TabSeparator";
import {
    Page,
    ResponsiveGridLayout,
    Button,
    RadioButton,
    Input,
    Label,
    Icon,
    MessageBox
} from '@ui5/webcomponents-react';
import { OASelectDialog } from "components/OASelectDialog"
import { OrderOpSearchDialog } from 'components/OrderOpSearchDialog'
import { ItemSerialSearchDialog } from 'components/ItemSerialSearchDialog'
import { SerialnoSelectDialog } from 'components/SerialnoSelectDialog'
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

    // 定数
    const SEARCH_MODE_ORDER_OP = 'orderOp';
    const SEARCH_MODE_ITEM_SERIAL = 'itemSerial';
    const DIALOG_MODE_ORDER = 'order';
    const DIALOG_MODE_OP = 'op';
    const DIALOG_MODE_ITEM = 'item';
    const DIALOG_MODE_SERIAL = 'serial';

    // メッセージ
    const NO_INPUT_ORDER = '指図を入力してください。';
    const NO_INPUT_OP = '作業を入力してください。';
    const NO_INPUT_ORDER_AND_OP = '指図および作業を入力してください。';
    const NO_INPUT_ITEM = '品目を入力してください。';
    const NO_INPUT_SERIAL = 'シリアル番号を入力してください。';
    const NO_INPUT_ITEM_AND_SERIAL = '品目およびシリアル番号を入力してください。';

    // 作業活動選択の変数定義
    const [showOASelectDialog, setShowOASelectDialog] = useState(false);
    const closeWorkSelectionDialog = () => {
        setShowOASelectDialog(false);
    }

    // シリアルNo選択の変数定義
    const [showSerialnoSelectDialog, setShowSerialnoSelectDialog] = useState(false);
    const closeSerialnoSelectDialog = () => {
        setShowSerialnoSelectDialog(false);
    }
    const openSerialnoSelectDialog = () => {
        setShowSerialnoSelectDialog(true);
    }
    

    // 指図/作業検索ヘルプの変数定義
    const [showOrderOpSearchDialog, setShowOrderOpSearchDialog] = useState(false);
    const [orderValue, setOrderValue] = useState('');
    const [opValue, setOpValue] = useState('');
    const closeOrderOpSearchDialog = () => {
        setShowOrderOpSearchDialog(false);
    }
    const [orderOpHandler, setOrderOpHandler] = useState(DIALOG_MODE_ORDER)

    // 指図検索ヘルプの表示
    const openOrderSearchDialog = () => {
        setOrderOpHandler(DIALOG_MODE_ORDER);
        setShowOrderOpSearchDialog(true);
    }

    // 作業検索ヘルプの表示
    const openOpSearchDialog = () => {
        setOrderOpHandler(DIALOG_MODE_OP);
        setShowOrderOpSearchDialog(true);
    }

    // 品目/シリアル番号検索ヘルプの変数定義
    const [showItemSerialSearchDialog, setShowItemSerialSearchDialog] = useState(false);
    const [itemValue, setItemValue] = useState('');
    const [serialValue, setSerialValue] = useState('');
    const closeItemSerialSearchDialog = () => {
        setShowItemSerialSearchDialog(false);
    }
    const [itemSerialHandler, setItemSerialHandler] = useState(DIALOG_MODE_ITEM);

    // 品目検索ヘルプの表示
    const openItemSearchDialog = () => {
        setItemSerialHandler(DIALOG_MODE_ITEM);
        setShowItemSerialSearchDialog(true);
    }

    // シリアル番号検索ヘルプの表示
    const openSerialSearchDialog = () => {
        setItemSerialHandler(DIALOG_MODE_SERIAL);
        setShowItemSerialSearchDialog(true);
    }

    // モード活性制御
    const [searchMode, setSearchMode] = useState(SEARCH_MODE_ORDER_OP);
    const handleRadioChange = (e) => {
        setSearchMode(e.target.value);
    }

    // エラー用メッセージボックス
    const [errorMessage, setErrorMessage] = useState("");
    const [messageIsOpen, setMessageIsOpen] = useState(false);
    const openMessage = () => {
        setMessageIsOpen(true);
    };
    const closeMessage = () => {
        setMessageIsOpen(false);
    };

    // 入力バリデーションチェック
    const onClickOpStart = () => {
        if (searchMode === SEARCH_MODE_ORDER_OP) {
            if (orderValue.length === 0 && opValue.length === 0) {
                setErrorMessage(NO_INPUT_ORDER_AND_OP);
                openMessage();
                return;
            } else if (orderValue.length === 0) {
                setErrorMessage(NO_INPUT_ORDER);
                openMessage();
                return;
            } else if (opValue.length === 0) {
                setErrorMessage(NO_INPUT_OP);
                openMessage();
                return;
            }
        } else if (searchMode === SEARCH_MODE_ITEM_SERIAL) {
            if (itemValue.length === 0 && serialValue.length === 0) {
                setErrorMessage(NO_INPUT_ITEM_AND_SERIAL);
                openMessage();
                return;
            } else if (itemValue.length === 0) {
                setErrorMessage(NO_INPUT_ITEM);
                openMessage();
                return;
            } else if (serialValue.length === 0) {
                setErrorMessage(NO_INPUT_SERIAL);
                openMessage();
                return;
            }
        }
        setShowOASelectDialog(true);
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
                <ResponsiveGridLayout columnsXL={12} columnSpanXL={2} columnSpanL={2} columnSpanM={3} columnSpanS={12} className="grid-row">
                    <div></div>
                    <div></div>
                    <div>
                        <RadioButton name="mode" value={SEARCH_MODE_ORDER_OP} checked={searchMode === SEARCH_MODE_ORDER_OP} onChange={handleRadioChange} text="指図/作業検索" />
                    </div>
                    <div>
                        <RadioButton name="mode" value={SEARCH_MODE_ITEM_SERIAL} checked={searchMode === SEARCH_MODE_ITEM_SERIAL} onChange={handleRadioChange} text="品目/シリアル番号検索" />
                    </div>
                </ResponsiveGridLayout>
                <ResponsiveGridLayout columnsXL={12} columnSpanXL={2} columnSpanL={2} columnSpanM={6} columnSpanS={12} className="grid-row">
                    <div style={{
                        gridColumn: 'span 3'
                    }}></div>
                    <div class="input-title">
                        <Label>指図/作業検索</Label>
                    </div>
                </ResponsiveGridLayout>
                <ResponsiveGridLayout
                    columnsXL={14}
                    columnSpanXL={4}
                    columnSpanL={4}
                    columnSpanM={8}
                    columnSpanS={8}
                    className="grid-row"
                    style={{
                        alignItems: 'center'
                    }}>
                    <div style={{
                        gridColumn: 'span 2'
                    }}></div>
                    <div class="input-label">
                        <Label>指図：</Label>
                        <Input icon={
                            <Icon
                                name="value-help"
                                onClick={() => openOrderSearchDialog()}>
                            </Icon>}
                            type="Number"
                            disabled={searchMode !== SEARCH_MODE_ORDER_OP}
                            value={orderValue}
                            onChange={(e) => { setOrderValue(e.target.value) }}
                        >
                        </Input>
                    </div>
                    <div class="input-label">
                        <Label>作業：</Label>
                        <Input icon={
                            <Icon
                                name="value-help"
                                onClick={() => openOpSearchDialog()}>
                            </Icon>}
                            type="Number"
                            disabled={searchMode !== SEARCH_MODE_ORDER_OP}
                            value={opValue}
                            onChange={(e) => { setOpValue(e.target.value) }}
                        >
                        </Input>
                    </div>
                </ResponsiveGridLayout>
                <ResponsiveGridLayout columnsXL={12} columnSpanXL={2} columnSpanL={2} columnSpanM={6} columnSpanS={12} className="grid-row">
                    <div style={{
                        gridColumn: 'span 3'
                    }}></div>
                    <div class="input-title">
                        <Label>品目/シリアル番号検索</Label>
                    </div>
                </ResponsiveGridLayout>
                <ResponsiveGridLayout
                    columnsXL={14}
                    columnSpanXL={4}
                    columnSpanL={4}
                    columnSpanM={8}
                    columnSpanS={8}
                    className="grid-row">
                    <div style={{
                        gridColumn: 'span 2'
                    }}></div>
                    <div class="input-label">
                        <Label>品目：</Label>
                        <Input icon={
                            <Icon
                                name="value-help"
                                onClick={openItemSearchDialog}>
                            </Icon>}
                            maxlength={40}
                            type="Text"
                            disabled={searchMode !== SEARCH_MODE_ITEM_SERIAL}
                            value={itemValue}
                            onChange={(e) => { setItemValue(e.target.value) }}
                        >
                        </Input>
                    </div>
                    <div class="input-label">
                        <Label>シリアル番号：</Label>
                        <Input icon={
                            <Icon
                                name="value-help"
                                onClick={openSerialSearchDialog}>
                            </Icon>}
                            maxlength={18}
                            type="Text"
                            disabled={searchMode !== SEARCH_MODE_ITEM_SERIAL}
                            value={serialValue}
                            onChange={(e) => { setSerialValue(e.target.value) }}
                        >
                        </Input>
                    </div>
                </ResponsiveGridLayout>
                <ResponsiveGridLayout columnsXL={12} columnSpanL={1} columnSpanM={8} className="grid-row">
                    <div style={{
                        gridColumn: 'span 9'
                    }}></div>
                    <div class='input-label'>
                        <Button design="Emphasized" onClick={onClickOpStart}>作業開始</Button>
                    </div>
                </ResponsiveGridLayout>
                <ResponsiveGridLayout columnsXL={12} columnSpanL={1} columnSpanM={8} className="grid-row">
                    <div style={{
                        gridColumn: 'span 9'
                    }}></div>
                    <div class='input-label'>
                        <Button design="Emphasized" onClick={openSerialnoSelectDialog}>シリアル選択開始仮</Button>
                    </div>
                </ResponsiveGridLayout>
            </Page>
            <OASelectDialog isOpen={showOASelectDialog} closeDialog={closeWorkSelectionDialog} mode={searchMode} />
            <OrderOpSearchDialog isOpen={showOrderOpSearchDialog} closeDialog={closeOrderOpSearchDialog} mode={orderOpHandler} setOrderValue={setOrderValue} setOpValue={setOpValue} />
            <ItemSerialSearchDialog isOpen={showItemSerialSearchDialog} closeDialog={closeItemSerialSearchDialog} mode={itemSerialHandler} setItemValue={setItemValue} setSerialValue={setSerialValue} />
            <SerialnoSelectDialog isOpen={showSerialnoSelectDialog} closeDialog={closeSerialnoSelectDialog} ManufacturingOrder={orderValue} ManufacturingOrderOperation={opValue} />
            <MessageBox type="Error" open={messageIsOpen} onClose={closeMessage}>
                {errorMessage}
            </MessageBox>
        </>
    );
}
