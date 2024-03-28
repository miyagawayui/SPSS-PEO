import React, { useEffect, useState } from "react";
import { Button, Dialog, Table, FlexBox, Toolbar, ToolbarSpacer } from '@ui5/webcomponents-react';
import { TableRow, TableCell, TableColumn, Label } from '@ui5/webcomponents-react';
import { getOAData } from "api/OdataManager";
import orderOpOA from '../mock_data/orderOpOA.json'
import itemSerialOA from '../mock_data/itemSerialOA.json'
import loginUserInfo from '../mock_data/loginUserInfo.json'
import "../App.css";

//作業活動情報取得 Odata
export const OASelectDialog = ({
    isOpen,
    closeDialog,
    mode,
    manufacturingOrder,
    manufacturingOrderOperation,
    serialNumber,
    material, 
    openSerialnoSelectDialog}) => {

    // 定数
    const SEARCH_MODE_ORDER_OP = 'orderOp';
    const SEARCH_MODE_ITEM_SERIAL = 'itemSerial';

    // リスト表示要素
    const [OAList, setOAList] = useState([])
    const [children, setChildren] = useState([]);

    useEffect(() => {
        setOAList([]);
        setChildren([]);
        if (isOpen) {

            setChildren([]);

            if (mode === SEARCH_MODE_ORDER_OP) {
                // Odataサービス名：PP_MPE_OPER_MANAGE
                // Entity名：C_ProcgExecOperationActivity
                setOAList(orderOpOA);
            } else if (mode === SEARCH_MODE_ITEM_SERIAL) {
                // Odataサービス名：MPE_SFI_EXECUTION_SRV
                // Entity名：C_ShopFloorItemAtOpActy
                setOAList(itemSerialOA);
            }
        }
    }, [isOpen]);

    useEffect(() => {
        OAList.forEach((data, i) => {
            // ログインユーザ情報取得処理
            const user = loginUserInfo;

            const isUsersWorkCenter = (
                user[0].WorkCenter === data.WorkCenter &&
                user[0].Plant === data.ProductionPlant)

            setChildren((prev) => [
                ...prev,
                <TableRow key={i} onClick={rowClick} className={isUsersWorkCenter ? "" : "disabled-table-row"} data-rowIndex={i}>
                    <TableCell className={isUsersWorkCenter ? "" : "disabled-table-column"}>
                        <Label>
                            {data.ManufacturingOrderOperation}
                        </Label>
                    </TableCell>
                    <TableCell className={isUsersWorkCenter ? "" : "disabled-table-column"}>
                        <Label>
                            {data.OpActyNtwkElementExternalID}
                        </Label>
                    </TableCell>
                    <TableCell className={isUsersWorkCenter ? "" : "disabled-table-column"}>
                        <Label>
                            {data.WorkCenter}
                        </Label>
                    </TableCell>
                    <TableCell className={isUsersWorkCenter ? "" : "disabled-table-column"}>
                        <Label>
                            {data.WorkCenterText}
                        </Label>
                    </TableCell>
                    <TableCell className={isUsersWorkCenter ? "" : "disabled-table-column"}>
                        <Label>
                            {data.SASStatusName}
                        </Label>
                    </TableCell>
                </TableRow>
            ])
        });
    }, [OAList])

    const rowClick = (e) => {
        console.log('クリックされました')

        const index = e.currentTarget.getAttribute("data-rowIndex");
        const rowData = OAList[index]
        console.log(rowData)

        if (mode === SEARCH_MODE_ORDER_OP && rowData.OpActyConfIsSFIBased) {
            console.log('シリアル管理品');
            openSerialnoSelectDialog();
        } else {
            console.log('ロット管理品')
        }
    }

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

                </Table>
                <FlexBox
                    justifyContent="End"
                >
                </FlexBox>
            </Dialog>
        </>
    )
}
