import { LightningElement, wire } from 'lwc';
import getProducts from '@salesforce/apex/ProdutoController.getProductsFiltered';
import createProduct from '@salesforce/apex/ProdutoController.createProduct';
import updateProduct from '@salesforce/apex/ProdutoController.updateProduct';
import deleteProduct from '@salesforce/apex/ProdutoController.deleteProduct';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class BestMindsProdutos extends LightningElement {
    productName = '';
    productCode = '';
    productDescription = '';
    productPrice = 0;
    searchKey = '';
    editMode = false;
    productIdToUpdate = null;

    @wire(getProducts)
    products;

    get filteredProducts() {
        if (this.searchKey) {
            return this.products.data.filter(product =>
                product.Nome_do_Produto__c.toLowerCase().includes(this.searchKey.toLowerCase())
            );
        }
        return this.products.data;
    }

    handleNameChange(event) {
        this.productName = event.target.value;
    }

    handleCodeChange(event) {
        this.productCode = event.target.value;
    }

    handleDescriptionChange(event) {
        this.productDescription = event.target.value;
    }

    handlePriceChange(event) {
        this.productPrice = event.target.value;
    }

    handleSearchKeyChange(event) {
        this.searchKey = event.target.value;
    }

    saveProduct() {
        createProduct({
            name: this.productName,
            code: this.productCode,
            description: this.productDescription,
            price: this.productPrice
        })
            .then(() => {
                this.clearFields();
                this.showToastMessage(
                    'Sucesso', 
                    'Produto Cadastrado/Atualizado com sucesso', 
                    'success'
                );
            })
            .catch(error => {
                this.showToastMessage(
                    'Erro', 
                    'Algo saiu errado. ' + error, 
                    'error'
                );
            });
    }

    searchProducts() {
        getProductsFiltered({ searchKey: this.searchKey })
            .then(result => {
                this.products = result;
                this.showToastMessage(
                    'Sucesso', 
                    'Busca realizada com sucesso', 
                    'success'
                );
            })
            .catch(error => {
                this.showToastMessage(
                    'Erro', 
                    'Algo saiu errado. ' + error, 
                    'error'
                );
            });
    }

    updateProduct() {
        updateProduct({
            productId: this.productIdToUpdate,
            name: this.productName,
            code: this.productCode,
            description: this.productDescription,
            price: this.productPrice
        })
            .then(() => {
                this.clearFields();
                this.editMode = false;
            })
            .catch(error => {
                this.showToastMessage(
                    'Erro', 
                    'Algo saiu errado. ' + error, 
                    'error'
                );
            });
    }

    editProduct(event) {
        this.editMode = true;
        const selectedProduct = event.target.value;
        this.productIdToUpdate = selectedProduct.Id;
        this.productName = selectedProduct.Nome_do_Produto__c;
        this.productCode = selectedProduct.Codigo_do_Produto__c;
        this.productDescription = selectedProduct.Descricao_do_Produto__c;
        this.productPrice = selectedProduct.Preco_do_Produto__c;
    }

    deleteProduct(event) {
        const productId = event.target.value;
        deleteProduct({ productId })
            .then(() => {
                this.refreshProductList();
                this.showToastMessage(
                    'Sucesso', 
                    'Produto Excluido com Sucesso', 
                    'success'
                );
            })
            .catch(error => {
                this.showToastMessage(
                    'Erro', 
                    'Algo saiu errado. ' + error, 
                    'error'
                );
            });
    }

    refreshProductList() {
        getProducts()
            .then(result => {
                this.products = result;
                this.searchProducts();
            })
            .catch(error => {
                this.showToastMessage(
                    'Erro', 
                    'Algo saiu errado. ' + error, 
                    'error'
                );
            });
    }

    clearFields() {
        this.productName = '';
        this.productCode = '';
        this.productDescription = '';
        this.productPrice = 0;
        this.editMode = false;
        this.productIdToUpdate = null;
    }

    showToastMessage(titulo, mensagem, variante) {
        const evt = new ShowToastEvent({
            title: titulo,
            message: mensagem,
            variant: variante, // Pode ser 'success', 'warning', 'error' ou 'info'
        });
        this.dispatchEvent(evt);
    }
}