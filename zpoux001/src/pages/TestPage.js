import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider, Page, Button, Label } from '@ui5/webcomponents-react';
export default function TestPage () {
  const navigate = useNavigate();
  const location = useLocation();

  // 値受け渡し
  const OpActyNtwkInstance = location.state.OpActyNtwkInstance;
  const OpActyNtwkElement = location.state.OpActyNtwkElement;
  const ShopFloorItem = location.state.ShopFloorItem;

  return (
    <ThemeProvider>
      <Page
        backgroundDesign="Solid"
        style={{
          height: '100svh'
        }}>
        <h1>テストページです</h1>
        <h1>OpActyNtwkInstance：{OpActyNtwkInstance}</h1>
        <h1>OpActyNtwkElement：{OpActyNtwkElement}</h1>
        <h1>ShopFloorItem：{ShopFloorItem}</h1>
        <Button onClick={(e) => {navigate("/");}} design="Emphasized">戻る</Button>
      </Page>
    </ThemeProvider>
  )
}