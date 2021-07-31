import { Button } from 'primereact/button';

function HeaderTable({ onRefresh }) {
    return (
        <Button icon="pi pi-refresh" onClick={onRefresh} />
    );
}

export default HeaderTable;