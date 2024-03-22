import { Button, Dialog, Label, Toolbar, ToolbarSpacer, Table, TableColumn, Input, TableRow, TableCell } from '@ui5/webcomponents-react';

export const OrderSearchDialog = ({ isOpen, closeDialog, mode }) => {
    const rowClick = () => {
        console.log('aaa');
        closeDialog();
    }
    return (
        <>
            <Dialog
                id="OASelectDialog"
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
                            onClick={closeDialog}
                        >キャンセル
                        </Button>
                    </Toolbar>
                }
            >
                <Toolbar toolbarStyle="Clear" className='dialog-search-bar'>
                    <Input placeholder='検索' className='dialog-search-box'></Input>
                    <ToolbarSpacer></ToolbarSpacer>
                    <Button design="Emphasized" onClick={function _a() { }}>検索</Button>
                </Toolbar>
                <Table
                    id="OrderSearchDialogTable"
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
                                {/* <Label>指図</Label> */}
                                {mode === 'order' ? <Label>指図</Label> : <Label>作業</Label>}
                            </TableColumn>
                            <TableColumn
                                className="App-TableHeader"
                                style={{ width: '300px' }}
                            >
                                {/* <Label>作業</Label> */}
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
                    <TableRow onClick={rowClick}>
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
                    </TableRow>
                </Table>
            </Dialog>
        </>
    )
}