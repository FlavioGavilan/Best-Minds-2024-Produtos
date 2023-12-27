public with sharing class ProdutoController {
    @AuraEnabled(cacheable=true)
    public static List<Produto__c> getProductsFiltered(String searchKey) {
        if (String.isNotBlank(searchKey)) {
            return ProdutoDAO.getProdutosQuery(searchKey, 'isNotBlank');
        } else if(!String.isNotBlank(searchKey)){
            return ProdutoDAO.getProdutosQuery(searchKey, 'isBlank');
        }
        else {
            return NULL;
        }
    }

    @AuraEnabled
    public static void createProduct(String name, String code, String description, Decimal price) {
        Produto__c newProduct = new Produto__c(
            Nome_do_Produto__c = name,
            Codigo_do_Produto__c = code,
            Descricao_do_Produto__c = description,
            Preco_do_Produto__c = price
        );
        insert newProduct;
    }

    @AuraEnabled
    public static void updateProduct(String productId, String name, String code, String description, Decimal price) {
        Produto__c existingProduct = [SELECT Id FROM Produto__c WHERE Id = :productId];
        if(existingProduct != null) {
            existingProduct.Nome_do_Produto__c = name;
            existingProduct.Codigo_do_Produto__c = code;
            existingProduct.Descricao_do_Produto__c = description;
            existingProduct.Preco_do_Produto__c = price;
            update existingProduct;
        }
    }

    @AuraEnabled
    public static void deleteProduct(String productId) {
        Produto__c productToDelete = [SELECT Id FROM Produto__c WHERE Id = :productId LIMIT 1];
        if(productToDelete != null) {
            delete productToDelete;
        }
    }
}