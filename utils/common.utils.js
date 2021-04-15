import Swal from 'sweetalert2';

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