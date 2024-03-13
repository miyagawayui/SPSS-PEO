import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import NotFound from "pages/NotFound";
import TestPage from "pages/TestPage";
import WorkListPage from "pages/WorkListPage";
import MaterialSerialSelectPage from "pages/MaterialSerialSelectPage";
// import Router from "pages/Router";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from '@ui5/webcomponents-react';

// 言語関係
import { registerI18nLoader } from '@ui5/webcomponents-base/dist/asset-registries/i18n.js';
import '@ui5/webcomponents-react/dist/Assets';
import parse from "@ui5/webcomponents-base/dist/PropertiesFileFormat.js";

// TODO:SAPの言語に修正が必要（一旦はブラウザ）
const lang = window.navigator.language; // 言語

// 作業一覧のproperties
registerI18nLoader('i18n_WorkListPage', lang, async () => {
  const props = await (await fetch("./i18n/i18n_WorkListPage_" + lang + ".properties")).text();
  return parse(props); // this call is required for parsing the properties text
});

// MaterialSerialSelectPageのproperties
//registerI18nLoader('i18n_MaterialSerialSelectPage', lang, async () => {
//  const props = await (await fetch("./i18n/i18n_MaterialSerialSelectPage_" + lang + ".properties")).text();
//  return parse(props); // this call is required for parsing the properties text
//});

// 別ファイル読み込み
registerI18nLoader('i18n_', lang, async () => {
  const props = await (await fetch("./i18n/i18n_WorkListPage_" + lang + ".properties")).text();
  return parse(props); // this call is required for parsing the properties text
});

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* ここに遷移するページコンポーネントを記載 */}
          <Route path={`/`} element={<TestForModalPage />} />
          <Route path={`/pages/TestPage`} element={<TestPage />} />
          <Route path={`/pages/NotFound`} element={<NotFound />} />
          <Route path={`/pages/TestForModalPage`} element={<TestForModalPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;