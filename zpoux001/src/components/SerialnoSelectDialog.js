import React, { useEffect, useState } from "react";
import { Button, Dialog, List, Table } from '@ui5/webcomponents-react';
import { StandardListItem } from '@ui5/webcomponents-react';
import { TableRow, TableCell, TableColumn, Label } from '@ui5/webcomponents-react';

export const SerialnoSelectDialog = ({ isOpen, closeDialog }) => {
    return (
        <>
            <Dialog open={isOpen}
            style={{ width: "500px" }}
            >シリアル番号選択

            <Table
                columns=
                {
                    <>
                    <TableColumn style={{width: '300px'}}>
                        <Label>シリアル番号</Label>
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
                    ooooooo1
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
                    00000002
                </Label>
                </TableCell>
                <TableCell>
                <Label>
                    待機中
                </Label>
                </TableCell>
            </TableRow>

            </Table>

                <Button onClick={closeDialog}>キャンセル</Button>
            </Dialog>
        </>
    )
}