public with sharing class SearchAccountController {
    private static final String MENSAGEM_SUCESSO = 'Registro criado com sucesso';
    private static final String MENSAGEM_ERRO    = 'Algo saiu errado. ';

    @AuraEnabled
    public static String insertAccount(String accountValues){
        try {
            Map<String, String> mapAccNameType = convertObjToValues((Map<String, Object>) JSON.deserializeUntyped(accountValues));

            Account acc = new Account();
            acc.Name    = mapAccNameType.get('nameValue');
            acc.Type    = mapAccNameType.get('typeValue');
            
            Database.insert(acc, true);
            return MENSAGEM_SUCESSO;

        } catch (Exception e) {
            return MENSAGEM_ERRO + e.getMessage();
        }
    }

    @AuraEnabled
    public static List<Account> searchAccountByName(String accName){
        if(String.isEmpty(accName)){ return null; }

        List<Account> listAccounts = AccountDAO.searchAccountByName(accName);
        if(listAccounts.size() <= 0){ return null; }
        return listAccounts;
    }

    private static Map<String, String> convertObjToValues(Map<String, Object> mapAccountLabelValues){
        Map<String, String> mapLabelValue = new Map<String, String>();
        
        for(String label : mapAccountLabelValues.keySet()){
            if(label.equals('nameValue') || label.equals('typeValue')){
                mapLabelValue.put(label, String.valueOf(mapAccountLabelValues.get(label)));
            }
        }
        return mapLabelValue;
    }
}