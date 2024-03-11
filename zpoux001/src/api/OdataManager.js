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
