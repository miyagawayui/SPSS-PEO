import React, { useEffect, useState } from "react";
import { Button, Dialog, Table, FlexBox, Toolbar, ToolbarSpacer } from '@ui5/webcomponents-react';
import { TableRow, TableCell, TableColumn, Label } from '@ui5/webcomponents-react';
import { getOAData } from "api/OdataManager";
import orderOpOA from '../mock_data/orderOpOA.json'
import itemSerialOA from '../mock_data/itemSerialOA.json'
import serialnoOA from '../mock_data/serialnoOA.json'
import mock from '../mock_data/orderOp.json'

//作業活動情報取得 Odata
export const OASelectDialog = ({ isOpen, closeDialog, mode }) => {

    // 定数
    const SEARCH_MODE_ORDER_OP = 'orderOp';
    const SEARCH_MODE_ITEM_SERIAL = 'itemSerial';

    // リスト表示要素
    const [children, setChildren] = useState([]);

    //ロジック
    //作業活動を取得（OdataService返却値）
    //シリアルの場合のOdata
    //ロットの場合のOdata

    //画面表示





    //作業区比較
    //画面表示：担当作業区は活性、担当外作業区は非活性

    //品目のロット/シリアルチェック


    //作業活動選択時
    //指図/作業検索_ロット管理品の場合：作業記録へ遷移
    //指図/作業検索_シリアル管理品の場合：「シリアル番号選択」へ遷移
    //品目/シリアル番号検索_シリアル管理品の場合：作業記録へ遷移

    //キャンセルボタン押下でメイン画面に戻る

    useEffect(() => {
        setChildren([]);
        if (isOpen) {
            // ログインユーザ情報取得処理
            const user = ''

            setChildren([]);
            let OAList = [];
            if (mode === SEARCH_MODE_ORDER_OP) {
                // Odataサービス名：PP_MPE_OPER_MANAGE
                // Entity名：C_ProcgExecOperationActivity
                OAList = orderOpOA
            } else if (mode === SEARCH_MODE_ITEM_SERIAL) {
                // Odataサービス名：MPE_SFI_EXECUTION_SRV
                // Entity名：C_ShopFloorItemAtOpActy
                OAList = itemSerialOA
            }
            OAList.forEach((data, i) => {
                setChildren((prev) => [
                    ...prev,
                    // <TableRow key={i} onClick={rowClick}>
                    <TableRow key={i} >
                        <TableCell>
                            <Label>
                                {data.ManufacturingOrderOperation}
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                {data.OpActyNtwkElementExternalID}
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                {data.WORKCENTER}
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                {data.WORKCENTERTEXT}
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                {data.SASStatusName}
                            </Label>
                        </TableCell>
                    </TableRow>
                ])
            });
        }
    }, [isOpen]);

    return (
        <>
            <Dialog
                id="OASelectDialog"
                open={isOpen}
                style={{ width: "500px" }}
                header={
                    <Toolbar toolbarStyle="Clear">
                        <Label style={{ fontSize: "17px", fontWeight: "bold" }}>
                            作業活動選択
                        </Label>
                    </Toolbar>
                }
                footer={
                    <Toolbar toolbarStyle="Clear">
                        <ToolbarSpacer />
                        <Button
                            design="Transparent"
                            onClick={closeDialog}
                        >キャンセル
                        </Button>
                    </Toolbar>
                }
            >
                <Table
                    id="OASelectDialogTable"
                    style={{ height: "300px", overflow: "auto" }}
                    mode="SingleSelect"
                    noDataText="データがありません"
                    onLoadMore={function _a() { }}
                    onPopinChange={function _a() { }}
                    onRowClick={function _a() { }}
                    onSelectionChange={function _a() { }}
                    stickyColumnHeader
                    columns=
                    {
                        <>
                            <TableColumn
                                className="App-TableHeader"
                                style={{ width: '300px' }}
                            >
                                <Label>作業</Label>
                            </TableColumn>
                            <TableColumn
                                className="App-TableHeader"
                                style={{ width: '300px' }}
                            >
                                <Label>作業活動</Label>
                            </TableColumn>
                            <TableColumn
                                className="App-TableHeader"
                                style={{ width: '300px' }}
                            >
                                <Label>作業区</Label>
                            </TableColumn>
                            <TableColumn
                                className="App-TableHeader"
                                style={{ width: '300px' }}
                            >
                                <Label>作業区テキスト</Label>
                            </TableColumn>
                            <TableColumn
                                className="App-TableHeader"
                                style={{ width: '300px' }}
                            >
                                <Label>ステータス</Label>
                            </TableColumn>
                        </>
                    }
                >

                    {children}
                    {/* <TableRow>
                        <TableCell>
                            <Label>
                                0100
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                0010
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                Z001
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                デモ作業区
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                処理中
                            </Label>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Label>
                                0100
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                0020
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                Z001
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                デモ作業区
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                待機中
                            </Label>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Label>
                                0100
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                0020
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                Z001
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                デモ作業区
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                待機中
                            </Label>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Label>
                                0100
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                0020
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                Z001
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                デモ作業区
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                待機中
                            </Label>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Label>
                                0100
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                0020
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                Z001
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                デモ作業区
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                待機中
                            </Label>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Label>
                                0100
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                0020
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                Z001
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                デモ作業区
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                待機中
                            </Label>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Label>
                                0100
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                0020
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                Z001
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                デモ作業区
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                待機中
                            </Label>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Label>
                                0100
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                0020
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                Z001
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                デモ作業区
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                待機中
                            </Label>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Label>
                                0100
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                0020
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                Z001
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                デモ作業区
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                待機中
                            </Label>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Label>
                                0100
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                0020
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                Z001
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                デモ作業区
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                待機中
                            </Label>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Label>
                                0100
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                0020
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                Z001
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                デモ作業区
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                待機中
                            </Label>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Label>
                                0100
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                0020
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                Z001
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                デモ作業区
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                待機中
                            </Label>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Label>
                                0100
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                0020
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                Z001
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                デモ作業区
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                待機中
                            </Label>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Label>
                                0100
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                0020
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                Z001
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                デモ作業区
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                待機中
                            </Label>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Label>
                                0100
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                0020
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                Z001
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                デモ作業区
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                待機中
                            </Label>
                        </TableCell>
                    </TableRow> */}

                </Table>
                <FlexBox
                    justifyContent="End"
                >
                </FlexBox>
            </Dialog>
        </>
    )
}
