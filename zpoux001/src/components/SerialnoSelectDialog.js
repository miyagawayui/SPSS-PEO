import React, { useEffect, useState } from "react";
import { Button, Dialog, List, Table } from '@ui5/webcomponents-react';
import { StandardListItem } from '@ui5/webcomponents-react';
import { TableRow, TableCell, TableColumn, Label } from '@ui5/webcomponents-react';

export const SerialnoSelectDialog = ({ isOpen, closeDialog }) => {
    return (
        <>
            <Dialog 
                id="SerialnoSelectDialog"
                open={isOpen}
                style={{ width: "500px"}}
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
                onLoadMore={function _a(){}}
                onPopinChange={function _a(){}}
                onRowClick={function _a(){}}
                onSelectionChange={function _a(){}}                
                stickyColumnHeader
                columns=
                {
                    <>
                    <TableColumn 
                        className="App-TableHeader" 
                        style={{width: '300px'}}
                    >                       
                        <Label>シリアル番号</Label>
                    </TableColumn>
                    <TableColumn 
                        className="App-TableHeader" 
                        style={{width: '300px'}}
                    >
                        <Label>ステータス</Label>
                    </TableColumn>
                    </>
                }
            >

            <TableRow>
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
            </TableRow>           
            </Table>
            <FlexBox
                justifyContent="End"
            >
            </FlexBox>
            </Dialog>
        </>
    )
}