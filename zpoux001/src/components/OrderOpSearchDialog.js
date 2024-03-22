import { Button, Dialog, Label, Toolbar, ToolbarSpacer, Table, TableColumn, Input, TableRow, TableCell } from '@ui5/webcomponents-react';
import { useEffect, useState } from 'react';
import mock from '../mock_data/orderOp.json'

export const OrderOpSearchDialog = ({ isOpen, closeDialog, mode, onClickRow }) => {

    const rowClick = (e) => {
        const firstCellContent = e.currentTarget.querySelector('ui5-table-cell').textContent;
        onClickRow(firstCellContent);
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
                        <Label>{mode === 'order' ? data.ManufacturingOrder : data.OperationUnit}</Label>
                    </TableCell>
                    <TableCell>
                        <Label>{mode === 'order' ? data.OperationUnit : data.ManufacturingOrder}</Label>
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
                    // onLoadMore={function _a() { }}
                    // onPopinChange={function _a() { }}
                    // onRowClick={function _a() { }}
                    // onRowClick={rowClick}
                    // onSelectionChange={function _a() { }}
                    stickyColumnHeader
                    columns=
                    {
                        <>
                            <TableColumn
                                className="App-TableHeader"
                                style={{ width: '300px' }}
                            >
                                {mode === 'order' ? <Label>指図</Label> : <Label>作業</Label>}
                            </TableColumn>
                            <TableColumn
                                className="App-TableHeader"
                                style={{ width: '300px' }}
                            >
                                {mode === 'order' ? <Label>作業</Label> : <Label>指図</Label>}
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
                    {/* <TableRow onClick={rowClick}>
                        <TableCell>
                            {mode === 'order' ? <Label>0100</Label> : <Label>0010</Label>}
                        </TableCell>
                        <TableCell>
                            {mode === 'order' ? <Label>0010</Label> : <Label>0100</Label>}
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
                    </TableRow>
                    <TableRow onClick={rowClick}>
                        <TableCell>
                            {mode === 'order' ? <Label>0200</Label> : <Label>0020</Label>}
                        </TableCell>
                        <TableCell>
                            {mode === 'order' ? <Label>0020</Label> : <Label>0200</Label>}
                        </TableCell>
                        <TableCell>
                            <Label>
                                Z002
                            </Label>
                        </TableCell>
                        <TableCell>
                            <Label>
                                デモ作業区2
                            </Label>
                        </TableCell>
                    </TableRow> */}
                </Table>
            </Dialog>
        </>
    )
}