document.addEventListener('alpine:init', () => {
        Alpine.data('products', () => ({
            items: [
                { id: 1, name: 'Robusta Sidikalang', img: 'img/menu/products/1.jpg', price: 20000 },
                { id: 2, name: 'Arabica Gayo', img: 'img/menu/products/2.jpg', price: 25000 },
                { id: 3, name: 'Wine', img: 'img/menu/products/3.jpg', price: 30000 },
                { id: 4, name: 'Blend Robusta Sidikalang', img: 'img/menu/products/4.jpg', price: 35000 },
                { id: 5, name: 'Robusta Gayo', img: 'img/menu/products/5.jpg', price: 20000 },
              ],
        }));

        Alpine.store('cart',{
            items: [],
            total: 0,
            quantity: 0,
            add(newItem){
                // cek apakah ada barang yang sama di cart
                const cartItem = this.items.find((item) => item.id === newItem.id);

                // jika belum ada/barang nya kosong
                if(!cartItem){
                    this.items.push({...newItem, quantity: 1, total: newItem.price});
                    this.quantity++;
                    this.total += newItem.price;

                }else {
                    //jika barang sudah ada, cek apakah barangnya sama atau beda
                    this.items = this.items.map((item) => {
                    // jika barangnya beda
                    if(item.id !== newItem.id) {
                        return item;
                    }else {
                        //jika barang udah ada, tambah quantity dan total
                        item.quantity++;
                        item.total = item.price * item.quantity;
                        this.quantity++;
                        this.total += item.price;
                        return item;
                    }
                    });
                }

            },
            remove(id){
                // ambil item yang mau dihapus berdaasarkan id
             const cartItem = this.items.find((item) => item.id === id);   

             // jika item lebih dari 1
                if(cartItem.quantity > 1){
                    // cari 1 1
                    this.items = this.items.map((item) => {
                        // jika bukan barang yang di klik
                        if(item.id !== id) {
                            return item;
                        }else {
                            item.quantity--;
                            item.total = item.price * item.quantity;
                            this.quantity--;
                            this.total -= item.price;
                            return item;
                        }
                    });
                } else if (cartItem.quantity === 1) {
                    // jika barangya sisa 1
                    this.items = this.items.filter((item) => item.id !== id);
                    this.quantity--;
                    this.total -= cartItem.price;
                }
            },
        });
    });


    // Form validation
    const checkoutButton = document.querySelector('#checkout-button');
    checkoutButton.disabled = true;

    const form = document.querySelector('#checkoutForm');
    form.addEventListener('keyup', function(){
        for(let i = 0;  i < form.elements.length; i++){
            if(form.elements[i].value.length !== 0) {
                checkoutButton.classList.remove('disabled');
                checkoutButton.classList.add('disabled');
            } else {
                return false;
            }
        }
        checkoutButton.disabled = false;
        checkoutButton.classList.remove('disabled');
    });

    // kirim data ketika tombol checkout di submit
    checkoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const data = new URLSearchParams(formData);
        const objData = Object.fromEntries(data);
        const message = formatMessage(objData);
            window.open(`https://wa.me/6285761467073?text=` + encodeURIComponent(message));
        });
    
        // format pesan ke whatsapp
        const formatMessage = (obj) => {
            return `Data Customer
    Nama: ${obj.name}
    Email: ${obj.email}
    No HP: ${obj.phone}
    Data Pesanan
    ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)})\n`).join('')}
    TOTAL: ${rupiah(obj.total)}
    Terima Kasih Sudah berbelanja di toko kami!`;
        };

// konversi rupiah
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
         style: 'currency', 
         currency: 'IDR', 
         minimumFractionDigits: 0,
        }).format(number);
};
