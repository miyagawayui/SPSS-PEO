import { Button, Dialog } from '@ui5/webcomponents-react';

export const OrderSearchDialog = ({ isOpen, closeDialog }) => {
    return (
        <>
            <Dialog open={isOpen}>指図検索
                <Button onClick={closeDialog}>キャンセル</Button>
            </Dialog>
        </>
    )
}