namespace cloudsdk.ZPOBS001;

/**
 * 作業一覧　取得用
 */
entity ListOpActyWorklistOfCurUsrTP {
    key OpActyNtwkElement : Integer;                // ネットワークエレメント(要素番号)
    key OpActyNtwkInstance : Integer;               // ネットワーク：インスタンス ID
    OpActyNtwkElementExternalID : String(10);       // 作業活動
    OperationActivityName : String(60);             // 作業活動テキスト
    StatusAndActionSchemaStatus : String(40);       // 作業活動ステータス
    SASStatusName : String(40);                     // 作業活動ステータス名称
    ManufacturingOrderOperation : String(4);        // 作業
    MfgOrderOperationText : String(40);             // 作業テキスト (短)
    ManufacturingOrder : String(12);                // 指図
    ManufacturingOrderText : String(40);            // 指図テキスト
    Material : String(40);                          // 品目
    MaterialName : String(40);                      // 品目テキスト
    OpLtstSchedldExecStrtDteTme : DateTime;         // 計画開始
    OpActyIsSeldForRtactvPostg : Boolean;           // 遡及
    NrOfOpActyUserAssignments : Integer;            // 担当者数
    UserDescription : String(80);                   // 内容説明
    ProductionHold : Integer64;                     // 保留 ID
    OpActyHasMissingComponents : Boolean;           // チェックボックス
    NrOfOpActyTeamAssignments : Integer;            // チーム数
    TeamName : String(40);                          // チーム名称
    ManufacturingOrderImportance : String(1);       // 指図重要度
    OrderIsTechnicallyCompleted : Boolean;          // 指図技術的完了
    SASStatusCategory : Int16;                      // ステータスカテゴリ
    SASStatusCategoryName : String(60);             // ステータスカテゴリ内容説明
    OperationExecutionAvailableQty : Decimal;       // 利用可能数量
    ProductionUnit : String(3);                     // OA 数量単位
    OpActyExpdExecutionDuration : Decimal;          // 目標作業活動時間
    DurationUnit : String(3);                       // 期間単位
    OpActyExpdExecutionLaborDurn : Decimal;         // 目標労働時間
    OpActyNtwkSegmentType : String(1);              // OA セグメントタイプ
    OpActyNtwkSegmentTypeText : String(60);         // OA セグメントタイプ(作業活動セグメントタイプ名)
    WorkCenter : String(8);                         // 作業区
    WorkCenterText : String(40);                    // 作業区(名称)
    ProductionPlant : String(4);                    // プラント
    OpLtstSchedldExecEndDteTme : DateTime;          // 計画終了
    OpActualExecutionStartDateTime : DateTime;      // 実際開始
    OpActualExecutionEndDateTime : DateTime;        // 実績終了
    EffectivityParameterDesc : String(256);         // 有効性
    MfgOpActyExecutionPriority : Int16;             // 実行優先度
    ZZ1_INCIDENTAL_ITEM_1_MOA : String(100);        // 付帯項目１
    ZZ1_INCIDENTAL_ITEM_2_MOA : String(100);        // 付帯項目２
    ZZ1_INCIDENTAL_ITEM_3_MOA : String(100);        // 付帯項目３
    ZZ1_INCIDENTAL_ITEM_4_MOA : String(100);        // 付帯項目４
    ZZ1_INCIDENTAL_ITEM_5_MOA : String(100);        // 付帯項目５
    ZZ1_ACTGRP_ID_MOA : String(20);                 // 要素グループID
    ZZ1_ACTGRP_NM_MOA : String(40);                 // 要素グループ名称
    ZZ1_KMGRP_ID_MOA : String(20);                  // 組合せグループID
    ZZ1_KMGRP_NM_MOA : String(40);                  // 組合せグループ名称
    ZZ1_ASSIGN_TEMPLATE_ID_MOA : String(20);        // 差立テンプレートID
    ZZ1_ASSIGN_TEMPLATE_NM_MOA : String(40);        // 差立テンプレート名称
    ZZ1_TARGET_TIME_MOA : DateTime;                 // 目標時間
    OpActyExpdExecDurnInSeconds : Integer;          // 目標時間 (秒数)
    OpActyConfIsSFIBased : String(1);               // 品目確認
    RespyMgmtTeamID : String(8);                    // チーム
    OperationActivityHasProdnHold : Boolean;        // チェックボックス
    Start_rtactv_ac : Boolean;                      // Dyn. Action Control
    NumberOfActiveShopFloorItems : Integer;
}   

/**
 * 作業活動内容　取得用
 */
entity CShopFloorItemAtOpActy {
    key OpActyNtwkElement : String(10);             // ネットワークエレメント(要素番号)
    key OpActyNtwkInstance : String(10);            // ネットワーク：インスタンス ID
    key ShopFloorItem : String(10);                 // シリアル化品目 ID
    MfgWorkInstructionContent :String(1000);        // 作業指示コンテンツ
}   

/**
 * シリアル番号一覧 取得用
 */
entity SerialNumberList {
    key OpActyNtwkElement : Integer;                // ネットワークエレメント(要素番号)
    key OpActyNtwkInstance : Integer;               // ネットワーク：インスタンス ID
    key ShopFloorItem : Integer64;                  // シリアル化品目 ID
    SerialNumber : String(18);                      // シリアル番号
    StatusAndActionSchemaStatus: String(40);        // シリアル番号ステータス
    OpActySFIGroupName: String(100);                // シリアル番号グループ
    ManufacturingOrder : String(12);                // 指図
    ManufacturingOrderOperation : String(4);        // 作業
    MfgOrderOperationText : String(40);             // 作業テキスト
    OpActyNtwkElementExternalID : String(10);       // 作業活動
    OperationActivityName : String(60);             // 作業活動テキスト
    SASStatusCategory : Int16;                      // ステータスカテゴリ
    SASStatusName : String(40);                     // ステータス
    SASStatusCriticality : Int16;                   // クリティカル度レベル
    Assemblesficomp_ac : Boolean;                   // Dyn. Action Control
}   

/**
 * 作業活動内容（シリアル番号） 取得用
 */
entity ShopFloorItemAtOpActySerial {
    key OpActyNtwkElement : Integer;                // ネットワークエレメント(要素番号)
    key OpActyNtwkInstance : Integer;               // ネットワーク：インスタンス ID
    key ShopFloorItem : Integer64;                  // シリアル化品目 ID
    SerialNumber : String(18);                      // シリアル番号
    StatusAndActionSchemaStatus: String(40);        // シリアル番号ステータス
    OpActySFIGroupName: String(100);                // シリアル番号グループ
    ManufacturingOrder : String(12);                // 指図
    ManufacturingOrderOperation : String(4);        // 作業
    MfgOrderOperationText : String(40);             // 作業テキスト
    OpActyNtwkElementExternalID : String(10);       // 作業活動
    SASStatusName : String(40);                     // ステータス
    MfgWorkInstructionContent :String(3000);        // 作業指示コンテンツ
}   

/**
 * 作業活動内容（ロット管理品） 取得用
 */
entity ProcgExecOperationActivityLot {
    key OpActyNtwkElement : Integer;                // ネットワークエレメント(要素番号)
    key OpActyNtwkInstance : Integer;               // ネットワーク：インスタンスID
    StatusAndActionSchemaStatus: String(40);        // シリアル番号ステータス
    ManufacturingOrder : String(12);                // 指図
    ManufacturingOrderOperation : String(4);        // 作業StatusAndActionSchemaStatus
    MfgOrderOperationText : String(40);             // 作業テキスト (短)
    OpActyNtwkElementExternalID : String(10);       // 作業活動
    SASStatusName : String(40);                     // ステータス
    MfgWorkInstructionContent :String(3000);        // 作業指示コンテンツ
}   

/**
 * シリアル番号
 * 作業開始　取得用
 */
entity SerialWorkStart {
    key OpActyNtwkElement : Integer;                // ネットワークエレメント(要素番号)
    key OpActyNtwkInstance : Integer;               // ネットワーク：インスタンス ID
    key ShopFloorItem : Integer64;                  // シリアル化品目 ID
    key SASStatusCategory : String(40);             // ステータスカテゴリ
}

/**
 * ロット番号
 * 作業開始　取得用
 */
entity LotWorkStart {
    key OpActyNtwkElement : Integer;                // ネットワークエレメント(要素番号)
    key OpActyNtwkInstance : Integer;               // ネットワーク：インスタンス ID
    key SASStatusCategory : String(40);             // ステータスカテゴリ
}
