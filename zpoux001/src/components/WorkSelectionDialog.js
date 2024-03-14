import React, { useEffect, useState } from "react";
import { Button, Dialog } from '@ui5/webcomponents-react';

export const WorkSelectionDialog = ({ isOpen, closeDialog }) => {
    return (
        <>
            <Dialog open={isOpen}>モーダル
                <Button onClick={closeDialog}>キャンセル</Button>
            </Dialog>
        </>
    )
}