public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> searchAccounts(String accountName) {
        String accountNameLike = '%' + accountName + '%';
        return AccountDAO.searchAccountByName(accountNameLike);
    }

    @AuraEnabled
    public static void deleteAccount(Id accountId) {
        try{
            Account deleteAcc = AccountDAO.deleteAccountById(accountId);
            Database.delete(deleteAcc, true);
        }
        catch(Exception e){
            e.getMessage();
        }
    }

    @AuraEnabled
    public static void updateAccount(Id accountId) {
        try{
            Account updateAcc = AccountDAO.searchAccountById(accountId);
            Account acc = new Account(
                Name = updateAcc.Name,
                Type = updateAcc.Type
            );
            Database.update(acc, true);
        }
        catch(Exception e){
            e.getMessage();
        }
    }
}