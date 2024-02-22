const { createApp } = Vue;

const url = 'https://vue3-course-api.hexschool.io';
const myPath = 'ttmtest';

const cartModal = {
    props:['tempProduct', 'addProductToCart'],
    data(){
        return{
            productModal: null,
            qty: 1,
        };
    },
    methods:{
        open(){
            this.productModal.show();
        },
        close(){
            this.productModal.hide();
        }
    },
    watch:{
        tempProduct(){
            this.qty = 1;
        }
    },
    template: '#userProductModal',
    mounted(){
        this.productModal = new bootstrap.Modal(this.$refs.modal);
    }
}

const app = createApp({
    data(){
        return{
            products:[],
            tempProduct: {},
            status:{
                addCartLoading:'',
                cartQtyLoading:'',
            },
            carts:{},
            form: {
                user: {
                  name: '',
                  email: '',
                  tel: '',
                  address: '',
                },
                message: '',
            },
        }
    },
    methods:{
        getProducts(){
            axios.get(`${url}/v2/api/${myPath}/products/all`)
            .then((res) => {
                this.products = res.data.products;
            })
            .catch((err) => {
                alert(err.response.data.message);
            })
        },
        openModal(product){
            this.tempProduct = product;
            this.$refs.cartModal.open();
        },
        addProductToCart(product_id,qty = 1){
            const order = {
                product_id,
                qty,
            };
            this.status.addCartLoading = product_id;
            axios.post(`${url}/v2/api/${myPath}/cart`, { data: order })
            .then((res) => {
                this.status.addCartLoading = '';
                this.$refs.cartModal.close();
                this.getCart();
            })
            .catch((err) => {
                alert(err.response.data.message);
            })
        },
        getCart(){
            axios.get(`${url}/v2/api/${myPath}/cart`)
            .then((res) => {
                this.carts = res.data.data
            })
            .catch((err) => {
                alert(err.response.data.message);
            })
        },
        changeCartQty(item, qty = 1){
            const order = {
                product_id: item.product_id,
                qty,
            };
            this.status.cartQtyLoading = item.id;
            axios.put(`${url}/v2/api/${myPath}/cart/${item.id}`, { data: order })
            .then((res) => {
                this.getCart();
                this.status.cartQtyLoading = '';
            })
            .catch((err) => {
                alert(err.response.data.message);
            })
        },
        deleteCart(item){
            axios.delete(`${url}/v2/api/${myPath}/cart/${item.id}`)
            .then((res) => {
                this.getCart();
            })
            .catch((err) => {
                alert(err.response.data.message);
            })
        },
        deleteAllCart(){
            axios.delete(`${url}/v2/api/${myPath}/carts`)
            .then((res) => {
                this.getCart();
            })
            .catch((err) => {
                alert(err.response.data.message);
            })
        },
        createOrder(){
            const order = this.form;
            axios.post(`${url}/v2/api/${myPath}/order`,{ data: order })
            .then((res) => {
                alert(res.data.message);
                this.$refs.form.resetForm();
                this.form.message='',
                this.getCart();
            })
            .catch((err) => {
                alert(err.response.data.message);
            })
        }
    },
    components:{
        cartModal,
    },
    mounted(){
        this.getProducts();
        this.getCart();
    }
})

Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
  });
// index.js
VeeValidateI18n.loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.12.4/dist/locale/zh_TW.json');

VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true,
});
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app')