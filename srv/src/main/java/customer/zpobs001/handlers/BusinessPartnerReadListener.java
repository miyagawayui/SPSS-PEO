package customer.zpobs001.handlers;

import static com.sap.cds.ResultBuilder.selectedRows;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.net.URLDecoder;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Date; 
import java.util.Locale; 
import java.util.stream.Collectors;
import java.text.SimpleDateFormat;  
import com.sap.cds.ql.cqn.CqnPredicate;
import com.sap.cds.ql.cqn.AnalysisResult;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.Result;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cloud.sdk.cloudplatform.connectivity.DestinationAccessor;
import com.sap.cloud.sdk.cloudplatform.connectivity.HttpDestination;
import com.sap.cloud.sdk.cloudplatform.servlet.LocaleAccessor;
import com.sap.cloud.sdk.datamodel.odata.client.exception.ODataException;
import com.sap.cloud.sdk.datamodel.odata.client.exception.ODataServiceError;
import com.sap.cloud.sdk.datamodel.odata.client.exception.ODataServiceErrorException;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;

import com.sap.cds.services.messages.Messages;
import com.sap.cloud.sdk.datamodel.odata.helper.FluentHelperCreate;
import com.sap.cloud.sdk.datamodel.odata.helper.batch.BatchResponse;
import com.sap.cloud.sdk.datamodel.odata.helper.batch.BatchResponseChangeSet;
import com.sap.cloud.sdk.datamodel.odata.helper.VdmEntity;

import io.vavr.control.Try;
import lombok.extern.slf4j.Slf4j;
import cds.gen.cloudsdk.zpobs001.ListOpActyWorklistOfCurUsrTP;      // 作業一覧
import cds.gen.cloudsdk.zpobs001.SerialNumberList;                  // シリアル番号一覧
import cds.gen.cloudsdk.zpobs001.SerialWorkStart;                   // 作業開始（シリアル番号）
import cds.gen.cloudsdk.zpobs001.LotWorkStart;                      // 作業開始（ロット管理品）
import cds.gen.cloudsdk.zpobs001.ShopFloorItemAtOpActySerial;       // 作業活動内容（シリアル番号）
import cds.gen.cloudsdk.zpobs001.ProcgExecOperationActivityLot;     // 作業活動内容（ロット管理品）

/**
 *  MPE_PERSONAL_WORK_QUEUE_SRV
 */
// 作業一覧
import com.mycompany.vdm.namespaces.mpepersonalworkqueuesrv.OpActyWorklistOfCurUsrTP;
import com.mycompany.vdm.namespaces.mpepersonalworkqueuesrv.OpActyWorklistOfCurUsrTPCreateFluentHelper;
import com.mycompany.vdm.namespaces.mpepersonalworkqueuesrv.OpActyWorklistOfCurUsrTPFluentHelper;
import com.mycompany.vdm.services.DefaultMPEPERSONALWORKQUEUESRVService;

// シリアル番号一覧
import com.mycompany.vdm.namespaces.mpepersonalworkqueuesrv.ShopFloorItemAtOpActyFluentHelper;
import com.mycompany.vdm.namespaces.mpepersonalworkqueuesrv.ShopFloorItemAtOpActy;

/**
 *  MPE_SFI_EXECUTION_SRV
 */
// 作業開始（シリアル番号）
import com.mycompany.vdm.services.DefaultMPESFIEXECUTIONSRVService;
import com.mycompany.vdm.namespaces.mpesfiexecutionsrv.ShopFloorItemAtOpActyExecutesfisactionFluentHelper;
import com.mycompany.vdm.namespaces.mpesfiexecutionsrv.ShopFloorItemAtOpActyLabor_trckgFluentHelper;
import com.mycompany.vdm.namespaces.mpesfiexecutionsrv.ShopFloorItemCreateFluentHelper;
import com.mycompany.vdm.namespaces.mpesfiexecutionsrv.ShopFloorItemAtOpActyCreateFluentHelper;

/**
 *  MPE_OA_EXECUTION_SRV
 */
// 作業開始（ロット管理品）
import com.mycompany.vdm.services.DefaultMPEOAEXECUTIONSRVService;
import com.mycompany.vdm.namespaces.mpeoaexecutionsrv.ProcgExecOperationActivity;
import com.mycompany.vdm.namespaces.mpeoaexecutionsrv.ProcgExecOperationActivityExecoaactionFluentHelper;
import com.mycompany.vdm.namespaces.mpeoaexecutionsrv.ProcgExecOperationActivityLabor_trckgFluentHelper;

@Slf4j
@Component
@ServiceName("cloud.sdk.capng")
@SpringBootApplication
// @Configuration
// @EnableWebSecurity
public class BusinessPartnerReadListener implements EventHandler {

    @Autowired
    Messages message;

    //S4用接続先
    private final String destination = "testOdata"; 

//#region 作業一覧 取得

    @On(event = CqnService.EVENT_READ, entity = "cloud.sdk.capng.COpActyWorklistOfCurUsrTP")
    /**
     * onReadCOpActyWorklistOfCurUsrTPは、作業一覧 取得用のメソッドです
     * @param context　イベントコンテキストです
     * @throws ODataException  ODataService例外発生時に起こりうる例外
    */
    public void onReadCOpActyWorklistOfCurUsrTP(CdsReadEventContext context) throws ODataException, Exception, UnsupportedEncodingException {
    
        Messages messages = context.getMessages();

        try {
            // S/4へ接続するdistnationサービスの定義
            final HttpDestination httpDestination = DestinationAccessor.getDestination(destination).asHttp();

            // UXレイヤのパラメータを取得する
            // 取得言語
            String strLang = context.getParameterInfo().getQueryParameter("lang");
            setLanguage(strLang);

            // 検索条件取得
            String strFilter = context.getParameterInfo().getQueryParameter("filter");

            // ソート順序取得
            String strSorter = context.getParameterInfo().getQueryParameter("orderby");

            // searchパラメータ
            String strSearch = context.getParameterInfo().getQueryParameter("search");
            
            // データ取得処理
            // 作業一覧情報の取得
            // 取得条件をODataサービスのオプション・パラメータに設定する
            DefaultMPEPERSONALWORKQUEUESRVService mpepersonalworkqueuesrvService = new DefaultMPEPERSONALWORKQUEUESRVService();
            OpActyWorklistOfCurUsrTPFluentHelper OpActyWorklistOfCurUsrTPFluentHelper = mpepersonalworkqueuesrvService.getAllC_OpActyWorklistOfCurUsrTP();
            OpActyWorklistOfCurUsrTPFluentHelper = OpActyWorklistOfCurUsrTPFluentHelper.withQueryParameter("$inlinecount", "allpages");
            OpActyWorklistOfCurUsrTPFluentHelper = OpActyWorklistOfCurUsrTPFluentHelper.withHeader("Accept-Language", strLang);

            // filter条件
            if (!StringUtils.isEmpty(strFilter)) {
                // UXレイヤから検索条件が指定された場合、指定された条件でOdataサービスに設定する。
                try{
                    String strFilterDecode = URLDecoder.decode(strFilter, "UTF-8");
                    OpActyWorklistOfCurUsrTPFluentHelper = OpActyWorklistOfCurUsrTPFluentHelper.withQueryParameter("$filter", strFilterDecode);
                }catch(UnsupportedEncodingException e){
                    throw e;
                }
            }

            // orderby条件
            if (!StringUtils.isEmpty(strSorter)) {
                //UXレイヤからソート条件が指定された場合、指定された条件を設定
                try{
                    String strSorterDecode = URLDecoder.decode(strSorter, "UTF-8");
                    OpActyWorklistOfCurUsrTPFluentHelper = OpActyWorklistOfCurUsrTPFluentHelper.withQueryParameter("$orderby", strSorterDecode);
                }catch(UnsupportedEncodingException e){
                    throw e;
                }
            }
            
            // search条件
            if (!StringUtils.isEmpty(strSearch)) {
                //UXレイヤからソート条件が指定された場合、指定された条件を設定
                try{
                    String strSearchDecode = URLDecoder.decode(strSearch, "UTF-8");
                    OpActyWorklistOfCurUsrTPFluentHelper = OpActyWorklistOfCurUsrTPFluentHelper.withQueryParameter("search", strSearchDecode);
                    log.info("search :{} ", strSearchDecode);
                }catch(UnsupportedEncodingException e){
                    throw e;
                }
            }
            
            // データを取得する
            final List<OpActyWorklistOfCurUsrTP> dataList = OpActyWorklistOfCurUsrTPFluentHelper.executeRequest(httpDestination);

            // エラーメッセージの返却
            // 例外によるエラー処理は、try/catchで行う

            // 返却用変数の用意
            final List<ListOpActyWorklistOfCurUsrTP> entitySet = new ArrayList<ListOpActyWorklistOfCurUsrTP>();

            // 取得したデータを返却用変数に編集する
            dataList.forEach(data -> {
                ListOpActyWorklistOfCurUsrTP entity = com.sap.cds.Struct.create(ListOpActyWorklistOfCurUsrTP.class);
                
                entity.setOpActyNtwkElementExternalID(data.getOpActyNtwkElementExternalID());               // 作業活動
                entity.setOpActyNtwkElement(data.getOpActyNtwkElement());                                   // ネットワークエレメント(要素番号)
                entity.setOpActyNtwkInstance(data.getOpActyNtwkInstance());                                 // ネットワーク：インスタンス ID
                entity.setOperationActivityName(data.getOperationActivityName());                           // 作業活動テキスト
                entity.setStatusAndActionSchemaStatus(data.getStatusAndActionSchemaStatus());               // 作業活動ステータス
                entity.setSASStatusName(data.getSASStatusName());                                           // 作業活動ステータス名称
                entity.setManufacturingOrderOperation(data.getManufacturingOrderOperation());               // 作業
                entity.setMfgOrderOperationText(data.getMfgOrderOperationText());                           // 作業テキスト (短)
                entity.setManufacturingOrder(data.getManufacturingOrder());                                 // 指図
                entity.setManufacturingOrderText(data.getManufacturingOrderText());                         // 指図テキスト
                entity.setMaterial(data.getMaterial());                                                     // 品目
                entity.setMaterialName(data.getMaterialName());                                             // 品目テキスト
                entity.setOpActyIsSeldForRtactvPostg(data.getOpActyIsSeldForRtactvPostg());                 // 遡及
                entity.setNrOfOpActyUserAssignments(data.getNrOfOpActyUserAssignments());                   // 担当者数
                entity.setUserDescription(data.getUserDescription());                                       // 内容説明
                entity.setProductionHold(data.getProductionHold());                                         // 保留 ID
                entity.setOpActyHasMissingComponents(data.getOpActyHasMissingComponents());                 // チェックボックス
                entity.setNrOfOpActyTeamAssignments(data.getNrOfOpActyTeamAssignments());                   // チーム数
                entity.setTeamName(data.getTeamName());                                                     // チーム名称
                entity.setManufacturingOrderImportance(data.getManufacturingOrderImportance());             // 指図重要度
                entity.setOrderIsTechnicallyCompleted(data.getOrderIsTechnicallyCompleted());               // 指図技術的完了
                entity.setSASStatusCategory(data.getSASStatusCategory());                                   // ステータスカテゴリ
                entity.setSASStatusCategoryName(data.getSASStatusCategoryName());                           // ステータスカテゴリ内容説明
                entity.setOperationExecutionAvailableQty(data.getOperationExecutionAvailableQty());         // 利用可能数量
                entity.setProductionUnit(data.getProductionUnit());                                         // OA 数量単位
                entity.setOpActyExpdExecutionDuration(data.getOpActyExpdExecutionDuration());               // 目標作業活動時間
                entity.setDurationUnit(data.getDurationUnit());                                             // 期間単位
                entity.setOpActyExpdExecutionLaborDurn(data.getOpActyExpdExecutionLaborDurn());             // 目標労働時間
                entity.setOpActyNtwkSegmentType(data.getOpActyNtwkSegmentType());                           // OA セグメントタイプ
                entity.setOpActyNtwkSegmentTypeText(data.getOpActyNtwkSegmentTypeText());                   // OA セグメントタイプ(作業活動セグメントタイプ名)
                entity.setWorkCenter(data.getWorkCenter());                                                 // 作業区
                entity.setWorkCenterText(data.getWorkCenterText());                                         // 作業区(名称)
                entity.setProductionPlant(data.getProductionPlant());                                       // プラント
                 
                // 計画開始
                if(data.getOpLtstSchedldExecStrtDteTme() == null){
                    entity.setOpLtstSchedldExecStrtDteTme(null);
                }else{
                    entity.setOpLtstSchedldExecStrtDteTme(data.getOpLtstSchedldExecStrtDteTme().toInstant());
                }

                // 計画終了
                if(data.getOpLtstSchedldExecEndDteTme() == null){
                    entity.setOpLtstSchedldExecEndDteTme(null);
                }else{
                    entity.setOpLtstSchedldExecEndDteTme(data.getOpLtstSchedldExecEndDteTme().toInstant());
                }
                
                // 実際開始
                if(data.getOpActualExecutionStartDateTime() == null){
                    entity.setOpActualExecutionStartDateTime(null);
                }else{
                    entity.setOpActualExecutionStartDateTime(data.getOpActualExecutionStartDateTime().toInstant());
                }
                
                // 実績終了
                if(data.getOpActualExecutionEndDateTime() == null){
                    entity.setOpActualExecutionEndDateTime(null);
                }else{
                    entity.setOpActualExecutionEndDateTime(data.getOpActualExecutionEndDateTime().toInstant());
                }
                
                entity.setEffectivityParameterDesc(data.getEffectivityParameterDesc());             // 有効性
                entity.setMfgOpActyExecutionPriority(data.getMfgOpActyExecutionPriority());         // 実行優先度
                entity.setOpActyExpdExecDurnInSeconds(data.getOpActyExpdExecDurnInSeconds());       // 目標時間 (秒数)
                entity.setOpActyConfIsSFIBased(data.getOpActyConfIsSFIBased());                     // 品目確認
                entity.setRespyMgmtTeamID(data.getRespyMgmtTeamID());                               // チーム
                entity.setStartRtactvAc(data.getStart_rtactv_ac());                                 // Dyn. Action Control
                entity.setNumberOfActiveShopFloorItems(data.getNumberOfActiveShopFloorItems());     // 

                entitySet.add(entity);
                
            });
            
            // データ出力処理
            //■実行結果の設定
            //Result result = selectedRows(entitySet).inlineCount(iInlineCount).result();
            Result result = selectedRows(entitySet).inlineCount(1).result();
            context.setResult(result);

        } catch(ODataServiceErrorException exception) {
            ODataServiceError odataError = exception.getOdataError();
            context.getMessages().error(odataError.getODataMessage());
            log.debug("end readInfomation method");
            throw new Exception(odataError.getODataMessage());
            // throw new ODataServiceErrorException(exception.getRequest(), (HttpResponse) odataError, odataError.getODataMessage(), exception, odataError);
        } catch(UnsupportedEncodingException UEe) {
            context.getMessages().error(UEe.getMessage());
            throw new UnsupportedEncodingException(UEe.getMessage());
        } catch(Exception exception) {
            context.getMessages().error(exception.getMessage());
            throw new Exception(exception.getMessage());
        } finally {
            log.debug("end readInfomation method");
        } 
    }

//#endregion 作業一覧 取得

//#region シリアル番号一覧 取得

    @On(event = CqnService.EVENT_READ, entity = "cloud.sdk.capng.SerialNumberList")
    /**
     * onReadSerialNumberListは、シリアル番号一覧取得用のメソッドです
     * @param context　イベントコンテキストです
     * @throws ODataException  ODataService例外発生時に起こりうる例外
    */
    public void onReadSerialNumberList(CdsReadEventContext context) throws ODataException, Exception {
    
        Messages messages = context.getMessages();

        try {
            log.info("Start onReadSerialNumberList");
            // 各種変数定義
            final HttpDestination httpDestination = DestinationAccessor.getDestination(destination).asHttp();

            // contextから取り出す
            // UXレイヤのパラメータを取得する
            // 取得言語
            String strLang = context.getParameterInfo().getQueryParameter("lang");
            setLanguage(strLang);

            // ネットワークインスタンス
            String strOpActyNtwkInstance = context.getParameterInfo().getQueryParameter("OpActyNtwkInstance");

            // ネットワークエレメント
            String strOpActyNtwkElement = context.getParameterInfo().getQueryParameter("OpActyNtwkElement");

            // ソート順序取得
            String strSorter = context.getParameterInfo().getHeader("$orderby");
            
            // データ取得処理
            // 作業一覧情報の取得
            // 取得条件をODataサービスのオプション・パラメータに設定するShopFloorItemAtOpActy
            DefaultMPEPERSONALWORKQUEUESRVService mpepersonalworkqueuesrvService = new DefaultMPEPERSONALWORKQUEUESRVService();
            ShopFloorItemAtOpActyFluentHelper ShopFloorItemAtOpActyFluentHelper = mpepersonalworkqueuesrvService.getAllC_ShopFloorItemAtOpActy();
            ShopFloorItemAtOpActyFluentHelper = ShopFloorItemAtOpActyFluentHelper.withQueryParameter("$inlinecount", "allpages");
            ShopFloorItemAtOpActyFluentHelper = ShopFloorItemAtOpActyFluentHelper.withHeader("Accept-Language", strLang);

            // filter条件
            ShopFloorItemAtOpActyFluentHelper.withQueryParameter("$filter", "OpActyNtwkInstance eq " + strOpActyNtwkInstance + " and OpActyNtwkElement eq " + strOpActyNtwkElement);

            // orderby条件
            if (!StringUtils.isEmpty(strSorter)) {
                //UXレイヤからソート条件が指定された場合、指定された条件を設定
                ShopFloorItemAtOpActyFluentHelper = ShopFloorItemAtOpActyFluentHelper.withQueryParameter("$orderby", strSorter);
            }
            
            // 3.1.2 データを取得する
            final List<ShopFloorItemAtOpActy> dataList = ShopFloorItemAtOpActyFluentHelper.executeRequest(httpDestination);

            // 3.1.3 エラーメッセージの返却
            // 例外によるエラー処理は、try/catchで行う

            // 返却用変数の用意
            final List<SerialNumberList> entitySet = new ArrayList<SerialNumberList>();

            // 取得したデータを返却用変数に編集する
            dataList.forEach(data -> {
                SerialNumberList entity = com.sap.cds.Struct.create(SerialNumberList.class);
                
                entity.setOpActyNtwkElement(data.getOpActyNtwkElement());                       // ネットワークエレメント(要素番号)
                entity.setOpActyNtwkInstance(data.getOpActyNtwkInstance());                     // ネットワーク：インスタンス ID
                entity.setSerialNumber(data.getSerialNumber());                                 // シリアル番号
                entity.setStatusAndActionSchemaStatus(data.getStatusAndActionSchemaStatus());   // シリアル番号ステータス
                entity.setOpActySFIGroupName(data.getOpActySFIGroupName());                     // シリアル番号グループ
                entity.setManufacturingOrder(data.getManufacturingOrder());                     // 指図
                entity.setManufacturingOrderOperation(data.getManufacturingOrderOperation());   // 作業
                entity.setMfgOrderOperationText(data.getMfgOrderOperationText());               // 作業テキスト (短)
                entity.setOpActyNtwkElementExternalID(data.getOpActyNtwkElementExternalID());   // 作業活動ステータス
                entity.setOperationActivityName(data.getOperationActivityName());               // 作業活動テキスト
                entity.setSASStatusCategory(data.getSASStatusCategory());                       // ステータスカテゴリ
                entity.setSASStatusName(data.getSASStatusName());                               // 作業活動ステータス名称
                entity.setSASStatusCriticality(data.getSASStatusCriticality());                 // クリティカル度レベル
                entity.setShopFloorItem(data.getShopFloorItem());                               // 品目
                entity.setAssemblesficompAc(data.getAssemblesficomp_ac());                      // Dyn. Action Control
                
                entitySet.add(entity);
                
            });
            
            // データ出力処理
            //■実行結果の設定
            //Result result = selectedRows(entitySet).inlineCount(iInlineCount).result();
            Result result = selectedRows(entitySet).inlineCount(1).result();
            context.setResult(result);

        } catch(ODataServiceErrorException exception) {
            ODataServiceError odataError = exception.getOdataError();
            context.getMessages().error(odataError.getODataMessage());
            log.debug("end readInfomation method");
            throw new Exception(odataError.getODataMessage());
            // throw new ODataServiceErrorException(exception.getRequest(), (HttpResponse) odataError, odataError.getODataMessage(), exception, odataError);
        } catch(Exception e) {
            context.getMessages().error(e.getMessage());
            throw new Exception(e.getMessage());
        } finally {
            log.debug("end readInfomation method");
        } 
    }

//#endregion シリアル番号一覧 取得

//#region 作業活動内容（シリアル番号） 取得

@On(event = CqnService.EVENT_READ, entity = "cloud.sdk.capng.ShopFloorItemAtOpActySerial")
/**
 * onReadShopFloorItemAtOpActySerialは、作業活動内容取得用のメソッドです
 * @param context　イベントコンテキストです
 * @throws ODataException  ODataService例外発生時に起こりうる例外
*/
public void onReadShopFloorItemAtOpActySerial(CdsReadEventContext context) throws ODataException, Exception {

    Messages messages = context.getMessages();

    try {
        log.info("Start onReadShopFloorItemAtOpActySerial");
        // 各種変数定義
        final HttpDestination httpDestination = DestinationAccessor.getDestination(destination).asHttp();

        // UXレイヤのパラメータを取得する
        // 取得言語
        String strLang = context.getParameterInfo().getQueryParameter("lang");
        setLanguage(strLang);

        // filter条件
        String strFilter = "";
        String strOpActyNtwkInstance = context.getParameterInfo().getQueryParameter("OpActyNtwkInstance");  // ネットワークインスタンス
        String strOpActyNtwkElement = context.getParameterInfo().getQueryParameter("OpActyNtwkElement");    // ネットワークエレメント
        String strShopFloorItem = context.getParameterInfo().getQueryParameter("ShopFloorItem");            // ショップフローアイテム
        if (!StringUtils.isEmpty(strOpActyNtwkInstance) && !StringUtils.isEmpty(strOpActyNtwkElement) && !StringUtils.isEmpty(strShopFloorItem)) {
            strFilter = strFilter + "OpActyNtwkInstance eq " + strOpActyNtwkInstance + " and OpActyNtwkElement eq " + strOpActyNtwkElement + " and ShopFloorItem eq " + strShopFloorItem;
            log.info("OpActyNtwkInstance : {}, OpActyNtwkElement : {}, ShopFloorItem : {}", strOpActyNtwkInstance, strOpActyNtwkElement, strShopFloorItem);
        }
        
        // データ取得処理
        // 作業活動での製造現場明細(ShopFloorItemAtOpActy)の取得
        DefaultMPESFIEXECUTIONSRVService mpesfiexecutionsrvService = new DefaultMPESFIEXECUTIONSRVService();
        com.mycompany.vdm.namespaces.mpesfiexecutionsrv.ShopFloorItemAtOpActyFluentHelper ShopFloorItemAtOpActyFluentHelper = mpesfiexecutionsrvService.getAllC_ShopFloorItemAtOpActy();
        ShopFloorItemAtOpActyFluentHelper = ShopFloorItemAtOpActyFluentHelper.withQueryParameter("$inlinecount", "allpages");
        ShopFloorItemAtOpActyFluentHelper = ShopFloorItemAtOpActyFluentHelper.withHeader("Accept-Language", strLang);

        // filter条件
        if (!StringUtils.isEmpty(strFilter)) {
            ShopFloorItemAtOpActyFluentHelper.withQueryParameter("$filter", strFilter);
            log.info("$filter :{} ", strFilter);
        }

        // データを取得する
        final List<com.mycompany.vdm.namespaces.mpesfiexecutionsrv.ShopFloorItemAtOpActy> dataList = ShopFloorItemAtOpActyFluentHelper.executeRequest(httpDestination);

        // エラーメッセージの返却
        // 例外によるエラー処理は、try/catchで行う

        // 返却用変数の用意
        final List<ShopFloorItemAtOpActySerial> entitySet = new ArrayList<ShopFloorItemAtOpActySerial>();

        // 取得したデータを返却用変数に編集する
        dataList.forEach(data -> {
            ShopFloorItemAtOpActySerial entity = com.sap.cds.Struct.create(ShopFloorItemAtOpActySerial.class);
            
            entity.setOpActyNtwkElement(data.getOpActyNtwkElement());                       // ネットワークエレメント(要素番号)
            entity.setOpActyNtwkInstance(data.getOpActyNtwkInstance());                     // ネットワーク：インスタンス ID
            entity.setShopFloorItem(data.getShopFloorItem());                               // ショップフローアイテム（品目）
            entity.setSerialNumber(data.getSerialNumber());                                 // シリアル番号
            entity.setStatusAndActionSchemaStatus(data.getStatusAndActionSchemaStatus());   // シリアル番号ステータス
            entity.setOpActySFIGroupName(data.getOpActySFIGroupName());                     // シリアル番号グループ
            entity.setManufacturingOrder(data.getManufacturingOrder());                     // 指図
            entity.setManufacturingOrderOperation(data.getManufacturingOrderOperation());   // 作業
            entity.setMfgOrderOperationText(data.getMfgOrderOperationText());               // 作業テキスト (短)
            entity.setOpActyNtwkElementExternalID(data.getOpActyNtwkElementExternalID());   // 作業活動
            entity.setSASStatusName(data.getSASStatusName());                               // 作業活動ステータス名称
            entity.setMfgWorkInstructionContent(data.getMfgWorkInstructionContent());       // 作業指示コンテンツ
            
            entitySet.add(entity);
            
        });
        
        // データ出力処理
        //■実行結果の設定
        //Result result = selectedRows(entitySet).inlineCount(iInlineCount).result();
        Result result = selectedRows(entitySet).inlineCount(1).result();
        context.setResult(result);

    } catch(ODataServiceErrorException exception) {
        ODataServiceError odataError = exception.getOdataError();
        context.getMessages().error(odataError.getODataMessage());
        log.debug("end readInfomation method");
        throw new Exception(odataError.getODataMessage());
        // throw new ODataServiceErrorException(exception.getRequest(), (HttpResponse) odataError, odataError.getODataMessage(), exception, odataError);
    } catch(Exception exception) {
        context.getMessages().error(exception.getMessage());
        throw new Exception(exception.getMessage());
    } finally {
        log.debug("end readInfomation method");
    } 
}

//#endregion 作業活動内容（シリアル番号） 取得

//#region 作業活動内容（ロット管理品） 取得

@On(event = CqnService.EVENT_READ, entity = "cloud.sdk.capng.ProcgExecOperationActivityLot")
/**
 * onReadProcgExecOperationActivityLotは、作業活動内容取得用のメソッドです
 * @param context　イベントコンテキストです
 * @throws ODataException  ODataService例外発生時に起こりうる例外
*/
public void onReadProcgExecOperationActivityLot(CdsReadEventContext context) throws ODataException, Exception {

    Messages messages = context.getMessages();

    try {
        log.info("Start onReadProcgExecOperationActivityLot");
        // 各種変数定義
        final HttpDestination httpDestination = DestinationAccessor.getDestination(destination).asHttp();

        // UXレイヤのパラメータを取得する
        // 取得言語
        String strLang = context.getParameterInfo().getQueryParameter("lang");
        setLanguage(strLang);
        
        // filter条件
        String strFilter = "";
        String strOpActyNtwkInstance = context.getParameterInfo().getQueryParameter("OpActyNtwkInstance");  // ネットワークインスタンス
        String strOpActyNtwkElement = context.getParameterInfo().getQueryParameter("OpActyNtwkElement");    // ネットワークエレメント
        if (!StringUtils.isEmpty(strOpActyNtwkInstance) && !StringUtils.isEmpty(strOpActyNtwkElement)) {
            strFilter = strFilter + "OpActyNtwkInstance eq " + strOpActyNtwkInstance + " and OpActyNtwkElement eq " + strOpActyNtwkElement;
            log.info("OpActyNtwkInstance : {}, OpActyNtwkElement : {}", strOpActyNtwkInstance, strOpActyNtwkElement);
        }
        
        // データ取得処理
        // 作業活動での製造現場明細(ShopFloorItemAtOpActy)の取得
        DefaultMPEOAEXECUTIONSRVService mpeoaexecutionsrvService = new DefaultMPEOAEXECUTIONSRVService();
        com.mycompany.vdm.namespaces.mpeoaexecutionsrv.ProcgExecOperationActivityFluentHelper ProcgExecOperationActivityFluentHelper = mpeoaexecutionsrvService.getAllC_ProcgExecOperationActivity();
        ProcgExecOperationActivityFluentHelper = ProcgExecOperationActivityFluentHelper.withQueryParameter("$inlinecount", "allpages");
        ProcgExecOperationActivityFluentHelper = ProcgExecOperationActivityFluentHelper.withHeader("Accept-Language", strLang);

        // filter条件
        if (!StringUtils.isEmpty(strFilter)) {
            ProcgExecOperationActivityFluentHelper.withQueryParameter("$filter", strFilter);
            log.info("$filter :{} ", strFilter);
        }

        // データを取得する
        final List<com.mycompany.vdm.namespaces.mpeoaexecutionsrv.ProcgExecOperationActivity> dataList = ProcgExecOperationActivityFluentHelper.executeRequest(httpDestination);

        // エラーメッセージの返却
        // 例外によるエラー処理は、try/catchで行う

        // 返却用変数の用意
        final List<ProcgExecOperationActivityLot> entitySet = new ArrayList<ProcgExecOperationActivityLot>();

        // 取得したデータを返却用変数に編集する
        dataList.forEach(data -> {
            ProcgExecOperationActivityLot entity = com.sap.cds.Struct.create(ProcgExecOperationActivityLot.class);
            
            entity.setOpActyNtwkElement(data.getOpActyNtwkElement());                       // ネットワークエレメント(要素番号)
            entity.setOpActyNtwkInstance(data.getOpActyNtwkInstance());                     // ネットワーク：インスタンスID
            entity.setStatusAndActionSchemaStatus(data.getStatusAndActionSchemaStatus());   // 作業活動ステータス
            entity.setManufacturingOrder(data.getManufacturingOrder());                     // 指図
            entity.setManufacturingOrderOperation(data.getManufacturingOrderOperation());   // 作業
            entity.setMfgOrderOperationText(data.getMfgOrderOperationText());               // 作業テキスト (短)
            entity.setOpActyNtwkElementExternalID(data.getOpActyNtwkElementExternalID());   // 作業活動
            entity.setSASStatusName(data.getSASStatusName());                               // 作業活動ステータス名称
            entity.setMfgWorkInstructionContent(data.getMfgWorkInstructionContent());       // 作業指示コンテンツ
            
            entitySet.add(entity);
            
        });
        
        // データ出力処理
        //■実行結果の設定
        //Result result = selectedRows(entitySet).inlineCount(iInlineCount).result();
        Result result = selectedRows(entitySet).inlineCount(1).result();
        context.setResult(result);

    } catch(ODataServiceErrorException exception) {
        ODataServiceError odataError = exception.getOdataError();
        context.getMessages().error(odataError.getODataMessage());
        log.debug("end readInfomation method");
        throw new Exception(odataError.getODataMessage());
        // throw new ODataServiceErrorException(exception.getRequest(), (HttpResponse) odataError, odataError.getODataMessage(), exception, odataError);
    } catch(Exception exception) {
        context.getMessages().error(exception.getMessage());
        throw new Exception(exception.getMessage());
    } finally {
        log.debug("end readInfomation method");
    } 
}

//#endregion 作業活動内容（ロット管理品） 取得

//#region 作業開始 シリアル番号

    /**
     *<pre>
     * onCreateSerialWorkStartは、作業開始（シリアル番号）を行うイベントメソッドです
     * </pre>
     * @param context UXからのODataリクエストが入っています
     * @throws Exception 処理中に発生し得る例外
     */
    @On(event = {CqnService.EVENT_CREATE}, entity = "cloud.sdk.capng.SerialWorkStart")
    public void onCreateSerialWorkStart(CdsCreateEventContext context) throws ODataException, Exception {
        
        final Map<Object, Map<String, Object>> result = new HashMap<>();

        try {
            log.info("onCreateSerialWorkStart Start");
            Map<String, Object> recordIns = context.getCqn().entries().get(0);
            log.debug("OpActyNtwkInstance={}, OpActyNtwkElement={}, ShopFloorItem={}",recordIns.get("OpActyNtwkInstance"), recordIns.get("OpActyNtwkElement"), recordIns.get("ShopFloorItem"));
            SerialWorkStart data = com.sap.cds.Struct.create(SerialWorkStart.class);

            // 登録データ挿入
            data.setOpActyNtwkInstance(Integer.valueOf(recordIns.get("OpActyNtwkInstance").toString()));
            data.setOpActyNtwkElement(Integer.valueOf(recordIns.get("OpActyNtwkElement").toString()));
            data.setShopFloorItem(Long.valueOf(recordIns.get("ShopFloorItem").toString()));
            data.setSASStatusCategory(recordIns.get("SASStatusCategory").toString());

            // 登録処理を呼び出す
            // 成功時はブランク（""）が返却される（ODSの仕様）
            // エラー時はtry/catchで処理
            String s4Result = executeRequestSerial(data);

            // 戻り値設定
            result.put(data.getOpActyNtwkInstance(), data);
            result.put(data.getOpActyNtwkElement(), data);
            result.put(data.getShopFloorItem(), data);
            context.setResult(result.values());
            
        } catch (ODataServiceErrorException e) {
            ODataServiceError odataError = e.getOdataError();
            log.error("onCreateSerialWorkStart Message={}", odataError.getODataMessage());
            message.error(odataError.getODataMessage());
            message.throwIfError();
            throw new Exception(odataError.getODataMessage());
        } catch(Exception exception) {
            context.getMessages().error(exception.getMessage());
            throw new Exception(exception.getMessage());
        } finally {
            log.info("onCreateSerialWorkStart END");
        }
    }

    /**
     *<pre>
     * executeRequestSerialは、作業開始（シリアル番号）したメソッドです
     * </pre>
     * @param item DB登録値です。UXからのリクエスト値を格納してください
     * @return errorMessage 返却メッセージです。エラーがない場合、空白を返します
     * @throws Exception 処理中に発生し得る例外 ShopFloorItemAtOpActyExecutesfisactionFluentHelper
     */
    public String executeRequestSerial(SerialWorkStart item) throws ODataException {

        final HttpDestination httpDestination = DestinationAccessor.getDestination(destination).asHttp();
        
        DefaultMPESFIEXECUTIONSRVService service = new DefaultMPESFIEXECUTIONSRVService();
        String errorMessage = "";
        try {
            if(!item.getSASStatusCategory().equals("LaborOn")){
                // 初期値または一時停止の場合、開始処理
                // リクエスト作成
                com.mycompany.vdm.namespaces.mpesfiexecutionsrv.ShopFloorItemAtOpActyExecutesfisactionFluentHelper request = 
                service.shopFloorItemAtOpActyExecutesfisaction(item.getShopFloorItem(), item.getOpActyNtwkInstance(), item.getOpActyNtwkElement(), item.getSASStatusCategory(), 0, 0, "", "", "", "", false);
                // service.shopFloorItemAtOpActyExecutesfisaction(100 ,241, 3, "SAP_START", 0, 0, "", "", "", "", false);

                log.info("START S/4 OData");
                // OData送信：shopFloorItemAtOpActyExecutesfisaction
                com.mycompany.vdm.namespaces.mpesfiexecutionsrv.ShopFloorItemAtOpActy result = request.executeRequest(httpDestination);
                log.info("END S/4 OData");
            } else {
                // 処理中の場合、LaborOn処理
                log.info("START executeRequestSerialLaborOn");
                errorMessage = executeRequestSerialLaborOn(item, httpDestination);
                log.info("END executeRequestSerialLaborOn");
            }
            // 正常であれば空文字を返却
            return errorMessage;
        } catch(ODataServiceErrorException exception) {
            try {
                ODataServiceError odataError = exception.getOdataError();
                // レイバーオン処理分岐（errorかつ"code"＝"MPE_SAS_MSG/046"）
                if(odataError.getODataCode().equals("MPE_SAS_MSG/046")){
                    // LaborOn処理
                    log.info("START executeRequestSerialLaborOn");
                    errorMessage = executeRequestSerialLaborOn(item, httpDestination);
                    log.info("END executeRequestSerialLaborOn");
                    // 正常であれば空文字を返却
                    return errorMessage;
                } else {
                    // 異常処理：executeRequestLot
                    throw exception;
                }
            } catch (ODataServiceErrorException e) {
                // 異常処理：executeRequestLot
                ODataServiceError odataError = e.getOdataError();
                log.error("executeRequestSerial Message={}", odataError.getODataMessage());
                throw e;
            } catch(Exception e) {
                throw e;
            }
        } catch(Exception e) {
            throw e;
        }
    }

    /**
     *<pre>
     * executeRequestSerialLaborOnはLaborOn処理（シリアル番号）のメソッドです
     * </pre>
     * @param item DB登録値です。UXからのリクエスト値を格納してください
     * @return errorMessage 返却メッセージです。エラーがない場合、空白を返します
     * @throws ODataException 処理中に発生し得る例外
     */
    public String executeRequestSerialLaborOn(SerialWorkStart item, HttpDestination httpDestination) throws ODataServiceErrorException {
           
        DefaultMPESFIEXECUTIONSRVService service = new DefaultMPESFIEXECUTIONSRVService();
        String errorMessage = "";
        try {

            // リクエスト作成
            com.mycompany.vdm.namespaces.mpesfiexecutionsrv.ShopFloorItemAtOpActyLabor_trckgFluentHelper request = 
            service.shopFloorItemAtOpActyLabor_trckg(item.getShopFloorItem(), item.getOpActyNtwkInstance(), item.getOpActyNtwkElement(), "1", 0, "", "", "", "");
            // service.procgExecOperationActivityLabor_trckg(241, 3, "1", 0);

            log.info("START S/4 OData");
            com.mycompany.vdm.namespaces.mpesfiexecutionsrv.DummyFunctionImportResult result = request.executeRequest(httpDestination);
            log.info("END S/4 OData");

            result.getIsInvalid();

            // 正常であれば空文字を返却
            return errorMessage;
        } catch(ODataServiceErrorException e) {
            // テスト的に実行中はOKとする
            // 異常処理：executeRequestSerialLaborOn
            ODataServiceError odataError = e.getOdataError();
            if(odataError.getODataCode().equals("MPE_EXEC_CONF/059")){
                // "MPE_EXEC_CONF/059"はOKとする
                // 正常であれば空文字を返却
                return errorMessage;
            } else {
                // 異常処理：executeRequestLot
                log.error("executeRequestSerialLaborOn Message={}", odataError.getODataMessage());
                throw e;
            }
            // 異常処理：executeRequestSerialLaborOn
            // ODataServiceError odataError = e.getOdataError();
            // log.error("executeRequestSerialLaborOn Message={}", odataError.getODataMessage());
            // throw e;
        } catch(Exception e) {
            throw e;
        }
    }

//#endregion 作業開始 シリアル番号

//#region 作業開始（ロット管理品）

    /**
     *<pre>
     * onCreateLotWorkStartは、作業開始（ロット管理品）を行うイベントメソッドです
     * </pre>
     * @param context UXからのODataリクエストが入っています
     * @throws Exception 処理中に発生し得る例外
     */
    @On(event = {CqnService.EVENT_CREATE}, entity = "cloud.sdk.capng.LotWorkStart")
    public void onCreateLotWorkStart(CdsCreateEventContext context) throws ODataServiceErrorException, Exception {

        final Map<Object, Map<String, Object>> result = new HashMap<>();

        try {
            log.info("onCreateLotWorkStart Start");
            Map<String, Object> recordIns = context.getCqn().entries().get(0);
            log.debug("OpActyNtwkInstance={}, OpActyNtwkElement={}",recordIns.get("OpActyNtwkInstance"), recordIns.get("OpActyNtwkElement"));
            LotWorkStart data = com.sap.cds.Struct.create(LotWorkStart.class);

            // 登録データ挿入
            data.setOpActyNtwkInstance(Integer.valueOf(recordIns.get("OpActyNtwkInstance").toString()));
            data.setOpActyNtwkElement(Integer.valueOf(recordIns.get("OpActyNtwkElement").toString()));
            data.setSASStatusCategory(recordIns.get("SASStatusCategory").toString());

            // 登録処理を呼び出す
            // 成功時はブランク（""）が返却される（ODSの仕様）
            // エラー時はtry/catchで処理
            String s4Result = executeRequestLot(data);

            // 戻り値設定
            result.put(data.getOpActyNtwkInstance(), data);
            result.put(data.getOpActyNtwkElement(), data);
            context.setResult(result.values());
            
        } catch (ODataServiceErrorException e) {
            ODataServiceError odataError = e.getOdataError();
            log.error("onCreateLotWorkStart Message={}", odataError.getODataMessage());
            message.error(odataError.getODataMessage());
            message.throwIfError();
            throw new Exception(odataError.getODataMessage());
        } catch(Exception exception) {
            context.getMessages().error(exception.getMessage());
            throw new Exception(exception.getMessage());
        } finally {
            log.info("onCreateLotWorkStart END");
        }
    }
    
    /**
     *<pre>
     * executeRequestLotは、ロット管理品の作業開始メソッドです
     * </pre>
     * @return errorMessage 返却メッセージです。エラーがない場合、空白を返します
     * @throws ODataException 処理中に発生し得る例外
     */
    public String executeRequestLot(LotWorkStart item) throws ODataServiceErrorException, Exception {
           
        final HttpDestination httpDestination = DestinationAccessor.getDestination(destination).asHttp();
        
        ProcgExecOperationActivity data = null;

        DefaultMPEOAEXECUTIONSRVService service = new DefaultMPEOAEXECUTIONSRVService();
        String errorMessage = "";
        try {
            if(!item.getSASStatusCategory().equals("LaborOn")){
                // 初期値または一時停止の場合、開始処理
                // リクエスト作成
                com.mycompany.vdm.namespaces.mpeoaexecutionsrv.ProcgExecOperationActivityExecoaactionFluentHelper request = 
                    service.procgExecOperationActivityExecoaaction(item.getOpActyNtwkInstance(), item.getOpActyNtwkElement(), item.getSASStatusCategory(), 0, 0, "", "", "", "", false);
    
                log.info("START S/4 OData");
                // OData送信：C_ProcgExecOperationActivityExecoaaction
                com.mycompany.vdm.namespaces.mpeoaexecutionsrv.ProcgExecOperationActivity result = request.executeRequest(httpDestination);
                log.info("END S/4 OData");
            } else {
                // 処理中の場合、LaborOn処理
                log.info("START executeRequestLotLaborOn");
                errorMessage = executeRequestLotLaborOn(item, httpDestination);
                log.info("END executeRequestLotLaborOn");
            }
            // 正常であれば空文字を返却
            return errorMessage;
        } catch(ODataServiceErrorException exception) {
            try {
                ODataServiceError odataError = exception.getOdataError();
                // レイバーオン処理分岐（errorかつ"code"＝"MPE_SAS_MSG/046"）
                if(odataError.getODataCode().equals("MPE_SAS_MSG/046")){
                    // LaborOn処理
                    log.info("START executeRequestLotLaborOn");
                    errorMessage = executeRequestLotLaborOn(item, httpDestination);
                    log.info("END executeRequestLotLaborOn");
                    // 正常であれば空文字を返却
                    return errorMessage;
                } else {
                    // 異常処理：executeRequestLot
                    throw exception;
                }
            } catch (ODataServiceErrorException e) {
                // 異常処理：executeRequestLot
                ODataServiceError odataError = e.getOdataError();
                log.error("executeRequestLot Message={}", odataError.getODataMessage());
                throw e;
            }
        } catch(Exception e) {
            throw e;
        }
    }

    /**
     *<pre>
     * executeRequestLotLaborOnは、ロット管理品の作業開始を処理を定義したメソッドです
     * </pre>
     * @param item DB登録値です。UXからのリクエスト値を格納してください
     * @return errorMessage 返却メッセージです。エラーがない場合、空白を返します
     * @throws ODataException 処理中に発生し得る例外
     */
    public String executeRequestLotLaborOn(LotWorkStart item, HttpDestination httpDestination) throws ODataServiceErrorException, Exception {
        DefaultMPEOAEXECUTIONSRVService service = new DefaultMPEOAEXECUTIONSRVService();
        String errorMessage = "";
        try {

            // リクエスト作成
            com.mycompany.vdm.namespaces.mpeoaexecutionsrv.ProcgExecOperationActivityLabor_trckgFluentHelper request = 
            service.procgExecOperationActivityLabor_trckg(item.getOpActyNtwkInstance(), item.getOpActyNtwkElement(), "1", 0, "", "", "", "");
            // service.procgExecOperationActivityLabor_trckg(241, 3, "1", 0);

            log.info("START S/4 OData");
            com.mycompany.vdm.namespaces.mpeoaexecutionsrv.DummyFunctionImportResult result = request.executeRequest(httpDestination);
            log.info("END S/4 OData");

            result.getIsInvalid();

            // 正常であれば空文字を返却
            return errorMessage;
        } catch(ODataServiceErrorException e) {
            // テスト的に実行中はOKとする
            // 異常処理：executeRequestLotLaborOn
            ODataServiceError odataError = e.getOdataError();
            if(odataError.getODataCode().equals("MPE_EXEC_CONF/059")){
                // "MPE_EXEC_CONF/059"はOKとする
                // 正常であれば空文字を返却
                return errorMessage;
            } else {
                // 異常処理：executeRequestLot
                log.error("executeRequestLotLaborOn Message={}", odataError.getODataMessage());
                throw e;
            }
            // 異常処理：executeRequestLotLaborOn
            // ODataServiceError odataError = e.getOdataError();
            // log.error("executeRequestLotLaborOn Message={}", odataError.getODataMessage());
            // throw e;
        } catch(Exception e) {
            throw e;
        }
    }
//#endregion 作業開始（ロット管理品）

//#region メソッド

//#region 言語設定

    private void setLanguage(String lang) {
        Locale defLocale = new Locale(lang);
        LocaleAccessor.setLocaleFacade(() -> Collections.singletonList(defLocale));
        log.info("Locale:{}/{}", Locale.getDefault().getLanguage(), LocaleAccessor.getCurrentLocale().getLanguage());
    }
//#endregion 言語設定

//#endregion メソッド
}
