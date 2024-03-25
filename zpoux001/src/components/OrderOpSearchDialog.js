import { Button, Dialog, Label, Toolbar, ToolbarSpacer, Table, TableColumn, Input, TableRow, TableCell } from '@ui5/webcomponents-react';
import { useState } from 'react';
import mock from '../mock_data/orderOp.json'

export const OrderOpSearchDialog = ({ isOpen, closeDialog, mode, setOrderValue, setOpValue }) => {

    // 定数
    const MODE_ORDER = 'order';
    const MODE_OP = 'op';

    const rowClick = (e) => {
        const rowCells = e.currentTarget.querySelectorAll('ui5-table-cell');
        const firstCellContent = rowCells[0].textContent;
        const secondCellContent = rowCells[1].textContent;
        if (mode === MODE_ORDER) {
            setOrderValue(firstCellContent);
            setOpValue(secondCellContent);
        } else if (mode === MODE_OP) {
            setOpValue(firstCellContent);
            setOrderValue(secondCellContent);
        }
        setChildren([]);
        closeDialog();
    }

    const handleCancel = () => {
        setChildren([]);
        closeDialog();
    }

    // リスト表示要素
    const [children, setChildren] = useState([]);

    const search = () => {
        // API呼び出しを想定
        const mockData = mock;
        setChildren([]);
        mockData.forEach((data, i) => {
            setChildren((prev) => [
                ...prev,
                <TableRow key={i} onClick={rowClick}>
                    <TableCell>
                        <Label>{mode === MODE_ORDER ? data.ManufacturingOrder : data.OperationUnit}</Label>
                    </TableCell>
                    <TableCell>
                        <Label>{mode === MODE_ORDER ? data.OperationUnit : data.ManufacturingOrder}</Label>
                    </TableCell>
                    <TableCell>
                        <Label>
                            {data.Material}
                        </Label>
                    </TableCell>
                    <TableCell>
                        <Label>
                            {data.MaterialName}
                        </Label>
                    </TableCell>
                </TableRow>
            ])
        });
    }

    return (
        <>
            <Dialog
                id="OrderOpSearchDialog"
                open={isOpen}
                style={{ width: "500px" }}
                header={
                    <Toolbar toolbarStyle="Clear">
                        <Label style={{ fontSize: "17px", fontWeight: "bold" }}>指図/作業検索</Label>
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
                <Toolbar toolbarStyle="Clear" className='dialog-search-bar' numberOfAlwaysVisibleItems={2}>
                    <Input placeholder='検索' className='dialog-search-box'></Input>
                    <ToolbarSpacer></ToolbarSpacer>
                    <Button design="Emphasized" onClick={search}>検索</Button>
                </Toolbar>
                <Table
                    id="OrderOpSearchDialogTable"
                    style={{ height: "300px", overflow: "auto" }}
                    mode="SingleSelect"
                    noDataText="データがありません"
                    stickyColumnHeader
                    columns=
                    {
                        <>
                            <TableColumn
                                className="App-TableHeader"
                                style={{ width: '300px' }}
                            >
                                <Label>
                                    {mode === MODE_ORDER ? '指図' : '作業'}
                                </Label>
                            </TableColumn>
                            <TableColumn
                                className="App-TableHeader"
                                style={{ width: '300px' }}
                            >
                                <Label>
                                    {mode === MODE_ORDER ? '作業' : '指図'}
                                </Label>
                            </TableColumn>
                            <TableColumn
                                className="App-TableHeader"
                                style={{ width: '300px' }}
                            >
                                <Label>品目</Label>
                            </TableColumn>
                            <TableColumn
                                className="App-TableHeader"
                                style={{ width: '300px' }}
                            >
                                <Label>品目テキスト</Label>
                            </TableColumn>
                        </>
                    }
                >
                    {children}
                </Table>
            </Dialog>
        </>
    )
}