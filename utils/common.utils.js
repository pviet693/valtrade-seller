import Swal from 'sweetalert2';
import Moment from "moment";

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export const Toast = (message, type, timer = 1500) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: timer,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
    })

    return Toast.fire({
        icon: type,
        title: message
    })
}

export const ConfirmDialog = (title, text) => {
    const swal = Swal.mixin({
        title: title,
        text: text,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        customClass: {
            confirmButton: 'btn btn-swal-confirm',
            cancelButton: 'btn btn-swal-cancel',
            header: 'swal-header',
            title: 'swal-title',
            content: 'swal-content',
        },
        buttonsStyling: false
    })

    return swal.fire({})
}

export function formatTimeChat(date) {
    return Moment(new Date(date)).format("DD/MM/yyyy HH:mm:ss A");
}

//
export const KeyEncrypt = "2CE59986EC4F959F77E3EFD967B00FF689C469EC1013A561";

// api ghn
export const tokenGHN = "c76acf0e-9a1d-11eb-8be2-c21e19fc6803";

export const ghnShopId = "78801"

// api ghtk
export const tokenGHTK = "9411aDE81fE602c4f3bE48Cd043f0D5c09893254"

export const ghtkShopName = "S19125017 - Valtrade"