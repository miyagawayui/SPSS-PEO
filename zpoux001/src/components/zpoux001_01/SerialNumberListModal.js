// シリアル番号選択一覧画面
import React, { useState, useEffect } from "react";
import {
  SelectDialog,
  ListMode,
  Table,
  TableColumn,
  TableCell,
  Text,
  TableRow,
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-react/dist/Assets.js";
import "../../App.css";
// 言語関係
import { useI18nBundle } from '@ui5/webcomponents-react-base';

// シリアル番号 = Material
// ステータス = MaterialName
// シリアル番号グループ = MatlCompAssembleControlName
/**
 * シリアル番号選択一覧
 * @param {作業一覧画面からのパラメータ} props 
 * @returns 
 */
const SerialNumberListModal = (props) => {
  // i18n読み込み
  const i18nBundle = useI18nBundle('i18n_zpoux001_01');
  // テーブル行用ステート
  const [children, setChildren] = useState("");
  const [searchVal, setSearchVal] = useState();
  const [saveData, setSaveData] = useState("");
  // 品目情報用ステート
	const { closeDialog } = props;
	const { cancelDialog } = props;
  useEffect(() => {
    if(saveData == ""){
      setSaveData(props.componentList);
    }
    setChildren("");
    props.componentList.forEach((comp, i) => {
      setChildren((prev) => [
        ...prev,
        <TableRow key={i} aria-rowindex={i}>
          <TableCell className="App-TableCell">
            <Text style={{ fontSize: "17px", textAlign: "left" }}>
              {comp.SerialNumber}
              {/*シリアル番号*/}
            </Text>
          </TableCell>
          <TableCell className="App-TableCell">
            <Text style={{ fontSize: "17px", textAlign: "left" }}>
              {comp.SASStatusName}
              {/*ステータス*/}
            </Text>
          </TableCell>
          <TableCell className="App-TableCell">
            <Text style={{ fontSize: "17px", textAlign: "left" }}>
              {comp.OpActySFIGroupName}
              {/*シリアル番号グループ*/}
            </Text>
          </TableCell>
        </TableRow>,
      ]);
    });
  }, [props.componentList]);
  
  // 検索
  const handleSearch = (e) => {
    const data = saveData;
    props.componentList = GetElement(data, "SerialNumber", searchVal);
    setSearchVal(e.detail.value);
  };
  // 検索フィールドの入力値をリセット
  const handleSearchReset = () => {
    props.componentList = saveData;
    setSearchVal(undefined);
  };
  const GetElement = (tree, targetKey, searchValue) => {
      let data = null;
      for (const i in tree) {
          if (tree[i][targetKey].toLowerCase().includes(searchValue)) {
              data = tree[i];
              break;
          }
          if (data) {
              break;
          }
      }
      return data;
  }
  return (
    <>
      <SelectDialog
        style={{ backgroundColor: "#F7F7F7", padding: "1rem" }}
        id="MaterialsModal"
        className="SelectSerialHeder"
        initialFocus="ComponentsTable"
        open={props.dialogIsOpen}
        headerText={i18nBundle.getText('SerialNumberSelectDialog')}
        growing="Scroll"
        header={""}
        footer={""}
        stretch
        onSearch={handleSearch}
        onSearchReset={handleSearchReset}
        onCancel={cancelDialog}
      >
        <Table
          id="ComponentsTable"
          mode={ListMode.SingleSelect}
          style={{ height: "auto", overflow: "auto"}}
          stickyColumnHeader
          onSelectionChange={(event)=>{
            const index = event.detail.selectedRows[0].ariaRowIndex;
            props.componentList[index].popoverid = props.popoverid;
            closeDialog(props.componentList[index]);
          }}
          columns={
            <>
              <TableColumn className="App-TableHeader">
                <Text style={{ textAlign: "left" }}>
                  {i18nBundle.getText('SerialNumber')}
                </Text>
              </TableColumn>
              <TableColumn className="App-TableHeader">
                <Text style={{ textAlign: "left" }}>
                  {i18nBundle.getText('StatusAndActionSchemaStatus')}
                </Text>
              </TableColumn>
              <TableColumn className="App-TableHeader">
                <Text style={{ textAlign: "left" }}>
                  {i18nBundle.getText('OpActySFIGroupName')}
                </Text>
              </TableColumn>
            </>
          }
        >
          {children}
        </Table>
      </SelectDialog>
    </>
  );
};

export default SerialNumberListModal;
