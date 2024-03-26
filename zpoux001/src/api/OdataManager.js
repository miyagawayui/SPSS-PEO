import axios from "axios";

const baseURL = "ZPOBS001/odata/v2/cloud.sdk.capng";
// const baseURL = "s4hana/odata/v2/cloud.sdk.capng";

const instance = axios.create({
  baseURL
});

// 作業一覧取得
export const getTableData = async (filter, orderby, search, lang) => {
  // const params = { filter: filter, orderby: orderby, search: search, targetDate: targetDate }
  let params = {};
  if(filter != ""){ params.filter = filter; }
  if(orderby != ""){ params.orderby = orderby; }
  if(search != ""){ params.search = search; }
  if(lang != ""){ params.lang = lang; }
  return await instance.get("/COpActyWorklistOfCurUsrTP", {params})
  .then( response => {
    const data = response.data;
    return data.d?.results || data.d || data.value;
  })
  .catch( error => {
    return error.response;
  })
};

// シリアル番号一覧取得
export const getSerialNumberList = async (OpActyNtwkInstance, OpActyNtwkElement, lang) => {
  const params = { OpActyNtwkInstance: OpActyNtwkInstance, OpActyNtwkElement: OpActyNtwkElement, lang: lang }
  return await instance.get("/SerialNumberList", {params})
  .then( response => {
    const data = response.data;
    return data.d?.results || data.d || data.value;
  })
  .catch( error => {
    return error.response;
  })
};

// 作業活動内容取得（シリアル番号）
export const getContentsSerial = async (OpActyNtwkInstance, OpActyNtwkElement, ShopFloorItem, lang) => {
  const params = { OpActyNtwkInstance: OpActyNtwkInstance, OpActyNtwkElement: OpActyNtwkElement, ShopFloorItem: ShopFloorItem, lang: lang }
  return await instance.get("/ShopFloorItemAtOpActySerial", {params})
  .then( response => {
    const data = response.data;
    return data.d?.results || data.d || data.value;
  })
  .catch( error => {
    return error.response;
  })
};

// 作業活動内容取得（ロット管理品）
export const getContentsLot = async (OpActyNtwkInstance, OpActyNtwkElement, lang) => {
  const params = { OpActyNtwkInstance: OpActyNtwkInstance, OpActyNtwkElement: OpActyNtwkElement, lang: lang }
  return await instance.get("/ProcgExecOperationActivityLot", {params})
  .then( response => {
    const data = response.data;
    return data.d?.results || data.d || data.value;
  })
  .catch( error => {
    return error.response;
  })
};

// 作業開始ODS（シリアル管理品）
export const postDataSerial = async (params) => {
  return await instance.post("/SerialWorkStart", params)
  .then( response => {
    // OKであればブランク（""）を返す
    return "";
  })
  .catch( error => {
    return error.response.data.error;
  })
};

// 作業開始ODS（ロット管理品）
export const postDataLot = async (params) => {
  return await instance.post("/LotWorkStart", params)
  .then( response => {
    // OKであればブランク（""）を返す
    return "";
  })
  .catch( error => {
    return error.response.data.error;
  })
};

// export const getTableCount = async () => {
//   const { data } = await instance.get("/COpActyWorklistOfCurUsrTP/$count");
//   return data;
// };


// 作業一覧　完了件数
export const getTableCount = async (filter, orderby, search, lang) => {
  let params = {};
  if(filter != ""){ params.filter = filter; }
  if(orderby != ""){ params.orderby = orderby; }
  if(search != ""){ params.search = search; }
  if(lang != ""){ params.lang = lang; }
  return await instance.get("/COpActyWorklistOfCurUsrTP/$count", {params})
  .then( response => {
    const data = response;
    return data;
  })
  .catch( error => {
    return error.response.data;
  })
};
