import {Component, Vue, Watch} from 'vue-facing-decorator';
import apiClient from '../../http-common';

@Component({
    name: 'product-view'
})
export default class Product extends Vue {
    modalShow: boolean = false;
    items: Array<any> = [];
    sortBy: string | null = null;
    sortDesc: boolean = false;
    filterKeyword: string = '';
    pageSize: number = 5;
    currentPage: number = 1;
    isAddProductModalVisible: boolean = false;
    finishing_ops: Record<string, string>[] = [
        {text: 'Glossy', value: 'Glossy'},
        {text: 'Matt', value: 'Glossy'}
    ];
    size_ops: Record<string, string>[] = [
        {text: '60X120', value: '60X120'},
        {text: '120X120', value: '120X120'}
    ];
    newProduct: {
        isActive: boolean;
        isArchived: boolean;
        productionNo: string;
        sampleNo: string;
        finishing: string;
        surface: string;
        face: string;
        size: string;
        folderId: string;
    } = {
        isActive: false,
        isArchived: false,
        productionNo: '',
        sampleNo: '',
        finishing: '',
        surface: '',
        face: '',
        size: '',
        folderId: ''
    };

    get filteredItems() {
        let filtered = this.items;
        if (this.filterKeyword) {
            const keyword = this.filterKeyword.toLowerCase();
            filtered = filtered.filter((item: any) => {
                return Object.values(item).some((value: any) => {
                    return (
                        typeof value === 'string' &&
                        value.toLowerCase().includes(keyword)
                    );
                });
            });
        }
        return this.sortItems(filtered);
    }

    open() {
        this.modalShow = true;
    }
    get totalPages() {
        return Math.ceil(this.filteredItems.length / this.pageSize);
    }

    openAddProductModal() {
        this.isAddProductModalVisible = true;
    }

    async addNewProduct() {
        try {
            await apiClient.post('/product', {...this.newProduct});
            // If successful, fetch updated data
            this.loadData();
        } catch (error) {
            console.error('Error adding new product:', error);
        }
    }

    async loadData() {
        try {
            const response = await apiClient.get('/product/all');
            this.items = response.data?.data.result;
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    sortByColumn(column: string) {
        if (column === this.sortBy) {
            this.sortDesc = !this.sortDesc;
        } else {
            this.sortBy = column;
            this.sortDesc = false;
        }
    }

    sortItems(items: any[]) {
        if (!this.sortBy) {
            return items;
        }
        return items.slice().sort((a, b) => {
            const modifier = this.sortDesc ? -1 : 1;
            if (a[this.sortBy] < b[this.sortBy]) return -1 * modifier;
            if (a[this.sortBy] > b[this.sortBy]) return 1 * modifier;
            return 0;
        });
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    gotoPage(page: number) {
        this.currentPage = page;
    }

    @Watch('currentPage')
    onPageChange() {
        // Optionally, you can perform actions when currentPage changes
    }

    mounted() {
        this.loadData();
    }
}
