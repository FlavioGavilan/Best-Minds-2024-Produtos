import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import insertAccountApex from '@salesforce/apex/SearchAccountController.insertAccount';
import searchAccountApex from '@salesforce/apex/SearchAccountController.searchAccountByName';

export default class SeachAccountPersonalized extends LightningElement {
    @track accountName;
    @track accountType;
    @track search;
    @track searchAccName;
    @track data;
    @track isModalOpen = false;

    accountTypesDefault = [
        {label:'Prospect', value:'Prospect'},
        {label:'Customer - Direct', value:'Customer - Direct'},
        {label:'Customer - Channel', value:'Customer - Channel'},
        {label:'Channel Partner / Reseller', value:'Channel Partner / Reseller'},
        {label:'Installation Partner', value:'Installation Partner'},
        {label:'Technology Partner', value:'Technology Partner'},
        {label:'Other', value:'Other'}
    ];

    handleChange(event){
        const label = event.target.label;

        switch(label){
            case 'AccountName':
                this.accountName = event.target.value;
                break;
            case 'AccountType':
                this.accountType = event.target.value;
                break;
            case 'BuscaAccount':
                this.searchAccName = event.target.value;
                break;
        }
    }

    saveValues(){
        const accountObj = {
            nameValue : this.accountName,
            typeValue : this.accountType
        };
        const accountJSON = JSON.stringify(accountObj);

        insertAccountApex({accountValues : accountJSON})
            .then(result => {
                this.showToast(
                    'Sucesso',
                    `Mensagem : ${result}`,
                    'success',
                    'pester'
                );
                this.cleanFields();
            }).catch(error => {
                this.showToast(
                    'Erro',
                    `Mensagem : ${error}`,
                    'error',
                    'pester'
                );
            })
    }

    searchAccountByName(){
        let accountName = this.searchAccName;
        searchAccountApex({ accName : accountName })
            .then(result => {
                this.isModalOpen = true;
                this.data = result;
                this.showToast(
                    'Sucesso',
                    `Mensagem : ${result}`,
                    'success',
                    'pester'
                );
            }).catch(error => {
                this.showToast(
                    'Erro',
                    `Mensagem : ${error}`,
                    'error',
                    'pester'
                );
            });
    }

    closeModal() {
        this.isModalOpen = false;
    }

    showToast = (titulo, mensagem, variante, modo) => {
        const toastEvent = new ShowToastEvent({
            title: titulo,
            message: mensagem,
            variant: variante, // Pode ser 'success', 'warning', 'error' ou 'info'
            mode: modo
        });
        this.dispatchEvent(toastEvent);
    }

    cleanFields(){
        this.accountName = null;
        this.accountType = 'Prospect';
        this.search = null;
    }
}