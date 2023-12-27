public with sharing class ProdutoDAO {
    public static List<Produto__c> getProdutosQuery(String searchKey, String valueBlank) {
        if (valueBlank.equals('isBlank')) {
            return [SELECT Id, Nome_do_Produto__c, Codigo_do_Produto__c, 
                            Descricao_do_Produto__c, Preco_do_Produto__c 
                    FROM Produto__c 
                    WHERE Nome_do_Produto__c 
                    LIKE :'%' + searchKey + '%'];
        } else if (valueBlank.equals('isNotBlank')){
            return [SELECT Id, Nome_do_Produto__c, Codigo_do_Produto__c, 
                        Descricao_do_Produto__c, Preco_do_Produto__c 
                    FROM Produto__c];
        }else{
            return NULL;
        }
    }
}