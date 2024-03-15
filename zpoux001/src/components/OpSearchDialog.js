import { Button, Dialog } from '@ui5/webcomponents-react';

export const OpSearchDialog = ({ isOpen, closeDialog }) => {
    return (
        <>
            <Dialog open={isOpen}>作業検索
                <Button onClick={closeDialog}>キャンセル</Button>
            </Dialog>
        </>
    )
}