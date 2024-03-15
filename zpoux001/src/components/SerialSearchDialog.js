import { Button, Dialog } from '@ui5/webcomponents-react';

export const SerialSearchDialog = ({ isOpen, closeDialog }) => {
    return (
        <>
            <Dialog open={isOpen}>シリアル番号検索
                <Button onClick={closeDialog}>キャンセル</Button>
            </Dialog>
        </>
    )
}