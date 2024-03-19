import axios from "axios";

const baseURL = "ReactTestCAP-srv/odata/v2/cloud.sdk.capng";
// const baseURL = "s4hana/odata/v2/cloud.sdk.capng";

const instance = axios.create({
  baseURL
});

// export const getTableData = async (params = { $top: 100, $skip: 0 }) => {
//   const { data } = await instance.get("/YY0050_DueCash", {
//     params
//   });

// export const getTableData = async (params) => {
//   const { data } = await instance.get("/COpActyWorklistOfCurUsrTP", params)
//     return data.d?.results || data.d || data.value;
// };

// 作業一覧取得
export const getTableData = async (params) => {
  return await instance.get("/COpActyWorklistOfCurUsrTP", params)
  .then( response => {
    console.log(response.data);
    const data = response.data;
    return data.d?.results || data.d || data.value;
  })
  .catch( error => {
    console.log(error);
    return error;
  });
};

// シリアル番号一覧取得
export const getSerialNumberList = async (params) => {
  return await instance.get("/SerialNumberList", params)
  .then( response => {
    console.log(response.data);
    const data = response.data;
    return data.d?.results || data.d || data.value;
  })
  .catch( error => {
    console.log(error);
    return error;
  });
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

{/*
// ＊作業選択画面＊
// ログインユーザ情報取得ODS（F1）
export const getUserSettingSet = async (params) => {
  return await instance.get("/UserSettingsSet", params)
  .then( response => {
    console.log(response.data);
    const data = response.data;
    return data.d?.results || data.d || data.value;
  })
  .catch( error => {
    console.log(error);
    return error;
  });
};

// 作業活動情報取得ODS（E1）
export const getOADataByOrderAndOP = async (params) => {
  return await instance.get("/CProcgExecOperationActivity", params)
  .then( response => {
    console.log(response.data);
    const data = response.data;
    return data.d?.results || data.d || data.value;
  })
  .catch( error => {
    console.log(error);
    return error;
  });
};

// 作業活動情報取得ODS（E2）
export const getOADataByMaterialAndSerial = async (params) => {
  return await instance.get("/CShopFloorItemAtOpActy", params)
  .then( response => {
    console.log(response.data);
    const data = response.data;
    return data.d?.results || data.d || data.value;
  })
  .catch( error => {
    console.log(error);
    return error;
  });
};

// 作業記録画面へ（シリアル品目の場合）（H1）
export const postCShopFloorItemAtOpActyExecutesfisaction = async (params) => {
  return await instance.post("/CShopFloorItemAtOpActyExecutesfisaction", params)
  .then( response => {
    // OKであればブランク（""）を返す
    return "";
  })
  .catch( error => {
    return error.response.data.error;
  })
};

// 作業記録画面へ（ロット品目の場合）（H2）
export const postCProcgExecOperationActivityExecoaaction = async (params) => {
  return await instance.post("/CProcgExecOperationActivityExecoaaction", params)
  .then( response => {
    // OKであればブランク（""）を返す
    return "";
  })
  .catch( error => {
    return error.response.data.error;
  })
};

// レイバーオン（シリアル品目の場合）（H3）
export const postCProcgExecOperationActivityLaborTrckg = async (params) => {
  return await instance.post("/CProcgExecOperationActivityLaborTrckg", params)
  .then( response => {
    // OKであればブランク（""）を返す
    return "";
  })
  .catch( error => {
    return error.response.data.error;
  })
};

// レイバーオン（ロット品目の場合）（H4）
export const postCShopFloorItemAtOpActyLaborTrckg = async (params) => {
  return await instance.post("/CShopFloorItemAtOpActyLaborTrckg", params)
  .then( response => {
    // OKであればブランク（""）を返す
    return "";
  })
  .catch( error => {
    return error.response.data.error;
  })
};
*/}