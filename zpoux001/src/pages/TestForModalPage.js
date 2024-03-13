import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider, Page, Button, Label } from '@ui5/webcomponents-react';
export default function TestPage () {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ThemeProvider>
      <Page
        backgroundDesign="Solid"
        style={{
          height: '100svh'
        }}>
        <h1>テストページです</h1>
        <Button onClick={(e) => {navigate("/");}} design="Emphasized">作業選択</Button>
        <Button onClick={(e) => {navigate("/");}} design="Emphasized">シリアル番号選択</Button>
        <Button onClick={(e) => {navigate("/");}} design="Emphasized">指図検索ヘルプ</Button>
        <Button onClick={(e) => {navigate("/");}} design="Emphasized">作業検索ヘルプ</Button>
        <Button onClick={(e) => {navigate("/");}} design="Emphasized">品目検索ヘルプ</Button>
        <Button onClick={(e) => {navigate("/");}} design="Emphasized">シリアル番号検索ヘルプ</Button>
      </Page>
    </ThemeProvider>
  )
}