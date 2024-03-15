import { Button, Dialog } from '@ui5/webcomponents-react';

export const ItemSearchDialog = ({ isOpen, closeDialog }) => {
    return (
        <>
            <Dialog open={isOpen}>品目検索
                <Button onClick={closeDialog}>キャンセル</Button>
            </Dialog>
        </>
    )
}