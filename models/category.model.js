export class CategoryItemModel {
    constructor() {
        this.id = "";
        this.name = "";
    }
}

export const ListProperties = [
    { name: "Model", key: "model" },
    { name: "Bộ nhớ", key: "storage" },
    { name: "Mạng", key: "network" },
    { name: "Khe cắm sim", key: "simSlot" },
    { name: "Thấm nước", key: "waterproof" },
    { name: "Kích thước màn hình", key: "sizeScreen" },
    { name: "Hệ điều hành", key: "operation" },
    { name: "Ram", key: "ram" },
    { name: "Camera trước", key: "frontCamera" },
    { name: "Camera sau", key: "rearCamera" },
    { name: "GPS", key: "gps" },
    { name: "Bluetooth", key: "bluetooth" },
    { name: "Pin", key: "pin" },
    { name: "NFC", key: "nfc" },
    { name: "Micro Usb", key: "microUsb" },
    { name: "Màu sắc", key: "colorList" },
    { name: "Chất liệu", key: "material" },
    { name: "Chức năng sản phẩm", key: "functionProduct" },
    { name: "Cổng kết nối", key: "listPort" },
    { name: "Xuất xứ", key: "origin" },
    { name: "Tay áo", key: "sleeve" },
    { name: "Kiểu dáng áo sơ mi", key: "shirtDesigns" },
    { name: "Cổ áo", key: "collar" },
    { name: "Túi áo", key: "pocket" },
    { name: "Ống quần", key: "legs" },
    { name: "Chiều dài ống", key: "pantsLength" },
    { name: "Loại quần", key: "pantsType" },
    { name: "Độ tuổi phù hợp", key: "suitableAge" },
    { name: "Hạn sử dụng", key: "expireDay" },
    { name: "Kiểu dáng", key: "style" },
    { name: "Họa tiết", key: "vignette" },
    { name: "Giới tính", key: "sex" },
    { name: "Kiểu mặt đồng hồ", key: "dialType" },
    { name: "Kiểu khóa", key: "lockType" },
    { name: "Chất liệu viền ngoài", key: "outlineMaterial" },
    { name: "Công suất", key: "wattage" },
    { name: "Chứng chỉ pvc", key: "certificatePvc" },
    { name: "Chứng chỉ PB", key: "certificatePb" },
    { name: "Chứng chỉ Bpa", key: "certificateBpa" },
]

export const ListPropertiesDefault = [
    { name: "Tên sản phẩm", key: "name" },
    { name: "Giá ban đầu", key: "oldPrice" },
    { name: "Giá hiện tại", key: "price" },
    { name: "SKU", key: "sku" },
    { name: "Số lượng sản phẩm", key: "countProduct" },
    { name: "Lưu ý", key: "note" },
    { name: "Thời gian bảo hành còn lại", key: "restWarrantyTime" },
]

export class PropertyDefault {
    constructor() {
        this.name = "";
        this.description = "";
        this.categoryId = "";
        this.price = 0;
        this.oldPrice = 0;
        this.sku = "";
        this.countProduct = 0;
        this.note = "";
        this.brand = "";
        this.restWarrantyTime = 0;
        this.width = 0;
        this.weight = 0;
        this.length = 0;
        this.height = 0;
    }
}

export class PropertyDefaultAuction {
    constructor() {
        this.name = "";
        this.description = "";
        this.categoryId = "";
        this.price = 0;
        this.oldPrice = 0;
        this.sku = "";
        this.countProduct = 0;
        this.note = "";
        this.brand = "";
        this.restWarrantyTime = 0;
        this.width = 0;
        this.weight = 0;
        this.length = 0;
        this.height = 0;
        this.countDown = 0;
    }
}