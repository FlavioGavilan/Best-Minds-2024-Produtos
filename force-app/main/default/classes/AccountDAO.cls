public with sharing class AccountDAO {
    public static List<Account> searchAccountByName(String accountName) {
        return [SELECT Id, Name, Type 
                FROM Account 
                WHERE Name 
                LIKE :accountName
                WITH Security_Enforced];
    }

    public static Account deleteAccountById(Id accountId){
        return [SELECT Id FROM Account WHERE Id =: accountId WITH Security_Enforced];
    }

    public static Account searchAccountById(Id accountId){
        return [SELECT Id, Name, Type 
                FROM Account 
                WHERE Id =: accountId 
                WITH Security_Enforced];
    }
}