import { LightningElement, track, wire } from 'lwc';
import searchAccountsApex from '@salesforce/apex/AccountController.searchAccounts';
import deleteAccountApex from '@salesforce/apex/AccountController.deleteAccount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    { label: 'Nome', fieldName: 'Name' },
    { label: 'Tipo', fieldName: 'Type' },
    // Adicione outras colunas que deseja exibir
];
const actions = [
    { label: 'Editar', name: 'edit' },
    { label: 'Excluir', name: 'delete' }
];
export default class BuscaAccount extends LightningElement {
    @track searchTerm = '';
    @track accounts;
    @track columns = columns;

    handleInputChange(event) {
        this.searchTerm = event.target.value;
    }

    searchAccounts() {
        searchAccountsApex({ accountName: this.searchTerm })
            .then(result => {
                this.accounts = result;
                this.showToast(
                    'Sucesso',
                    'Busca realizada com Sucesso.',
                    'success'
                );
            })
            .catch(error => {
                this.showToast(
                    'Erro',
                    'Algo deu errado.' + error,
                    'error'
                );
            });
    }

    handleRowActions(event) {
        const action = event.detail.action;
        const row = event.detail.row;

        switch (action.name) {
            case 'edit':
                // Implementar lógica de edição
                break;
            case 'delete':
                this.deleteAccount(row.Id);
                break;
            default:
                break;
        }
    }

    deleteAccount(accountId) {
        deleteAccountApex({ accountId: accountId })
            .then(() => {
                // Atualizar a lista após a exclusão
                this.searchAccounts();
                this.showToast(
                    'Sucesso',
                    'Registro Apagado com Sucesso.',
                    'success'
                );
            })
            .catch(error => {
                this.showToast(
                    'Erro',
                    'Algo deu errado.' + error,
                    'error'
                );
            });
    }

    showToast = (titulo, mensagem, variante) => {
        const toastEvent = new ShowToastEvent({
            title: titulo,
            message: mensagem,
            variant: variante, // Pode ser 'success', 'warning', 'error' ou 'info'
        });
        this.dispatchEvent(toastEvent);
    }
}