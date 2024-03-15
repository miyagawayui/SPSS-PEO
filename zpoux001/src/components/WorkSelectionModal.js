import React, { useEffect, useState } from "react";
import { Button, Dialog, List, Table } from '@ui5/webcomponents-react';
import { StandardListItem } from '@ui5/webcomponents-react';
import { TableRow, TableCell, TableColumn, Label } from '@ui5/webcomponents-react';

export const WorkSelectionDialog = ({ isOpen, closeDialog }) => {
    return (
        <>
            <Dialog open={isOpen}
            style={{ width: "500px" }}
            >作業活動選択

            <Table
                columns=
                {
                    <>
                    <TableColumn style={{width: '300px'}}>
                        <Label>作業</Label>
                    </TableColumn>
                    <TableColumn style={{width: '300px'}}>
                        <Label>作業活動</Label>
                    </TableColumn>
                    <TableColumn style={{width: '300px'}}>
                        <Label>作業区</Label>
                    </TableColumn>
                    <TableColumn style={{width: '300px'}}>
                        <Label>作業区テキスト</Label>
                    </TableColumn>
                    <TableColumn style={{width: '300px'}}>
                        <Label>ステータス</Label>
                    </TableColumn>
                    </>
                }
                growing="Scroll"
                mode="SingleSelect"
                onLoadMore={function _a(){}}
                onPopinChange={function _a(){}}
                onRowClick={function _a(){}}
                onSelectionChange={function _a(){}}
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

            </Table>


            {/*
                <List
                    growing="Scroll"
                    header="作業"
                    mode="Single Select"
                    onItemClick={function _a(){}}
                    nItemClose={function _a(){}}
                    onItemDelete={function _a(){}}
                    onItemToggle={function _a(){}}
                    onLoadMore={function _a(){}}
                    onSelectionChange={function _a(){}}
                    separators="All"
                >
                <StandardListItem additionalText="3">
                    List Item 1
                </StandardListItem>
                <StandardListItem additionalText="2">
                   List Item 2
                </StandardListItem>
                <StandardListItem additionalText="1">
                 List Item 3
                </StandardListItem>
                <StandardListItem additionalText="1">
                 List Item 4
                </StandardListItem>
                <StandardListItem additionalText="1">
                 List Item 5
                 </StandardListItem>
                </List>
            */}    
                <Button onClick={closeDialog}>キャンセル</Button>
            </Dialog>
        </>
    )
}