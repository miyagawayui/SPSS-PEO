import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import TestPage from "pages/TestPage";
import ZPOUX001_01 from "pages/ZPOUX001_01.js";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

// 言語関係
import { registerI18nLoader } from '@ui5/webcomponents-base/dist/asset-registries/i18n.js';
import '@ui5/webcomponents-react/dist/Assets';
import parse from "@ui5/webcomponents-base/dist/PropertiesFileFormat.js";
import { getLanguage } from "@ui5/webcomponents-base/dist/config/Language.js";

// 共通関数読み込み
import "./common_components/component/common";
const lang = getLanguage();
// 作業一覧のproperties
registerI18nLoader('i18n_zpoux001_01', lang, async () => {
  const props = await (await fetch("./i18n/i18n_zpoux001_01_" + lang + ".properties")).text();
  return parse(props); // this call is required for parsing the properties text
});

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ここに遷移するページコンポーネントを記載 */}
        <Route path={`/`} element={<ZPOUX001_01 />} />
        <Route path={`/pages/TestPage`} element={<TestPage />} />
      </Routes>
    </Router>
  );
};

export default App;
