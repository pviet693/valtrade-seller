import { Dropdown } from 'primereact/dropdown';

function StatusFilter(props) {
    const {
        value,
        onChange,
        options
    } = props;

    const itemTemplate = (option) => {
        return (
            <div className="d-flex align-items-center w-100">
                {
                    option.value === "APPROVED" ?
                        <div className="status status--approved">Đã phê duyệt</div>
                        : (
                            option.value === "REJECTED" ?
                                <div className="status status--rejected">Đã từ chối</div>
                                : option.value === "PENDING" ?
                                    <div className="status status--pending">Chờ phê duyệt</div>
                                    :
                                    <div className="status status--all">Tất cả</div>
                        )
                }
            </div>
        );
    }

    return (
        <Dropdown
            value={value}
            id="pr_id_1"
            options={options} filter
            itemTemplate={itemTemplate}
            onChange={(event) => onChange(event)}
            placeholder="Tất cả"
            className="p-column-filter p-dropdown-status"
            optionValue="value"
            optionLabel="name"
        />
    )
}

export default StatusFilter;