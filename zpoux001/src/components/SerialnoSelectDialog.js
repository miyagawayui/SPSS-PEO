import React, { useEffect, useState } from "react";
import { Button, Dialog, List, Table } from '@ui5/webcomponents-react';
import { StandardListItem } from '@ui5/webcomponents-react';
import {
    TableRow,
    TableCell,
    TableColumn,
    Label,
    Toolbar,
    ToolbarSpacer,
    FlexBox
} from '@ui5/webcomponents-react';
import mock from '../mock_data/serialNo.json'

export const SerialnoSelectDialog = ({ isOpen, closeDialog, ManufacturingOrder, ManufacturingOrderOperation }) => {

    useEffect(() => {
        if (isOpen) {
            const mockData = mock;
            setChildren([]);
            mockData.forEach((data, i) => {
                setChildren((prev) => [
                    ...prev,
                    <TableRow key={i} onClick={rowClick}>
                        <TableCell>
                            <Label>{data.SerialNumber}</Label>
                        </TableCell>
                        <TableCell>
                            <Label>{data.SASStatusName}</Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                {data.OpActySFIGroupName}
                            </Label>
                        </TableCell>
                    </TableRow>
                ])
            });
        }
    }, [isOpen]);

    // リスト表示要素
    const [children, setChildren] = useState([]);

    const rowClick = (e) => {
        // const rowCells = e.currentTarget.querySelectorAll('ui5-table-cell');
        // const firstCellContent = rowCells[0].textContent;
        // const secondCellContent = rowCells[1].textContent;
        // if (mode === MODE_ORDER) {
        //     setOrderValue(firstCellContent);
        //     setOpValue(secondCellContent);
        // } else if (mode === MODE_OP) {
        //     setOpValue(firstCellContent);
        //     setOrderValue(secondCellContent);
        // }
        // setChildren([]);
        // closeDialog();
    }

    const handleCancel = () => {
        setChildren([]);
        closeDialog();
    }

    return (
        <>
            <Dialog
                id="SerialnoSelectDialog"
                open={isOpen}
                style={{ width: "500px" }}
                header={
                    <Toolbar toolbarStyle="Clear">
                        <Label style={{ fontSize: "17px", fontWeight: "bold" }}>
                            シリアル番号選択
                        </Label>
                    </Toolbar>
                }
                footer={
                    <Toolbar toolbarStyle="Clear">
                        <ToolbarSpacer />
                        <Button
                            design="Transparent"
                            onClick={handleCancel}
                        >キャンセル
                        </Button>
                    </Toolbar>
                }
            >
                <Table
                    id="SerialnoSelectDialog"
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
                                <Label>シリアル番号</Label>
                            </TableColumn>
                            <TableColumn
                                className="App-TableHeader"
                                style={{ width: '300px' }}
                            >
                                <Label>ステータス</Label>
                            </TableColumn>
                            <TableColumn
                                className="App-TableHeader"
                                style={{ width: '300px' }}
                            >
                                <Label>シリアル番号グループ</Label>
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