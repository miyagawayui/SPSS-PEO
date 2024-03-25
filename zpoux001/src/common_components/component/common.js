/**
 *----------------------------------------------------------------------*
 * SourceName  commom クラス
 * CreateDate    2024/1/19
 * CreateAuthor：Hiramatsu Katsuma
 * Ver 1.0 
 * Update Date : 2024/1/19 Hiramatsu Katsuma YDC
 *----------------------------------------------------------------------*
 * Copyright(C) FUJITSU LIMITED 2024.
 * All rights reserved.
 *----------------------------------------------------------------------*
 */
 import '@ui5/webcomponents-react/dist/Assets';
 import parse from "@ui5/webcomponents-base/dist/PropertiesFileFormat.js";
 import { registerI18nLoader, getI18nBundle } from "@ui5/webcomponents-base/dist/i18nBundle.js";
 import { setLanguage, getLanguage, setFetchDefaultLanguage } from "@ui5/webcomponents-base/dist/config/Language.js";
 
// SAPの言語(SAPの言語が取れなければブラウザ言語で回避)
const lang = window.parent.document.documentElement.lang? window.parent.document.documentElement.lang.substring(0,2): window.navigator.language; // 言語
 setFetchDefaultLanguage(true);				// propertiesを使えるようにする設定
 setLanguage(lang);							// ui5 webcomponentsに設定をセットする
 var propertiesStatus = "200";				// プロパティファイルの読み込みステータス
 // サポート言語
 const supportedLocales = [lang];
 
 /**
  * プロパティファイル読み込み関数の定義
  */
 supportedLocales.forEach(localeToRegister => {
	 try {
		 /**
		  * プロパティファイル読み込み関数
		  * @param packageName パッケージ名
		  * @param localeToRegister 言語
		  * @param "i18nファイル読み込み関数"
		  */
		 registerI18nLoader("i18n", localeToRegister,
			 /**
			  * i18nファイル読み込み
			  * @param localeId 言語
			  */
			 async (localeId) => {
				 try {
					 const propsclass = await fetch(`./i18n/i18n_${localeId}.properties`);
					 const props = await propsclass.text();
					 propertiesStatus = propsclass.status;
					 return parse(props);
				 } catch (e) {
					 // 例外エラー
					 // 日本語：プロパティ ファイル ローダー エラー。
					 console.error("Properties file loader error.");
					 return "";
				 }
			 }
		 );
	 } catch (e) {
		 // 例外エラー
		 // 日本語：プロパティファイルロード関数の定義に失敗しました。
		 console.error("Defining the property file loading function failed.");
	 }
 });
 
 // プロパティファイル読み込み関数呼び出し
 const bundle = await getI18nBundle("i18n");
 
 /**
  * メッセージ取得処理
  * @param {String} msgId 
  * @param {String} prm1 
  * @param {String} prm2 
  * @param {String} prm3 
  * @param {String} prm4 
  * @returns {string}
  */
 export const getMessage = async (msgId, prm1, prm2, prm3, prm4) => {
	 try {
		 // プロパティファイル読み込みチェック
		 if (propertiesStatus == "404") {
			 // 日本語：言語コード{locale}のプロパティファイルが存在しません。システム管理者に問い合わせてください。
			 return "The property file for language code { " + getLanguage() + " } does not exist. Please contact your system administrator.";
		 }
		 // 結果にメッセージIDが返却された場合
		 const message = bundle.getText(msgId, prm1, prm2, prm3, prm4);
		 if (message == msgId) {
			 // 日本語：メッセージID[msgId]が存在しないまたは、メッセージが未設定です。システム管理者に問い合わせてください。
			 return "Message ID [" + msgId + "] does not exist or has not been set. Please contact your system administrator.";
		 }
		 // メッセージが301文字以上の場合
		 if (message.length > 300) {
			 // 日本語：メッセージが301文字以上となっております。システム管理者にお問い合わせください。メッセージID：msgId
			 return "The message is over 301 characters. Please contact your system administrator. Message ID:" + msgId;
		 }
		 return message;
	 } catch (e) {
		 // 例外エラー
		 console.error(e.message);
		 // 日本語：メッセージ取得に失敗しました。管理者に問い合わせください。
		 return "Failed to retrieve message. Please contact your administrator.";
	 }
 };
 