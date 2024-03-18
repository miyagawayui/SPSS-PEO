using { cloudsdk.ZPOBS001 as db } from '../db/schema';

service cloud.sdk.capng {
    entity COpActyWorklistOfCurUsrTP as projection on db.ListOpActyWorklistOfCurUsrTP           // 作業一覧
    entity SerialWorkStart as projection on db.SerialWorkStart                                  // 作業開始（シリアル番号）
    entity LotWorkStart as projection on db.LotWorkStart                                        // 作業開始（ロット管理品）
    entity SerialNumberList as projection on db.SerialNumberList                                // シリアル番号一覧
    entity ShopFloorItemAtOpActySerial as projection on db.ShopFloorItemAtOpActySerial          // 作業活動内容（シリアル番号）
    entity ProcgExecOperationActivityLot as projection on db.ProcgExecOperationActivityLot      // 作業活動内容（ロット管理品）
};
