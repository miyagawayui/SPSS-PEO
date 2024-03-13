//作業活動選択画面（モーダル）
import React, {useState, useEffect} from "react";
import {
  Modals
} from "@ui5/webcomponents-react";

// when you can use hooks
const showDialog = Modals.useShowDialog();
const { ref, close } = showDialog(props, container);

{
  render: () => {
    const showDialog = Modals.useShowDialog();
    return <Button onClick={() => {
      const {
        close
      } = showDialog({
        headerText: 'Dialog Title',
        children: "I'm a Dialog!",
        footer: <Bar endContent={<Button onClick={() => close()}>Close</Button>} />
      });
    }}>
        Show Dialog
      </Button>;
  }
}