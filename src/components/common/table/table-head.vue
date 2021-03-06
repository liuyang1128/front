<template>
    <div>
    <div id="expect" style="width:1px;background-color: red;height:10px;position:absolute;top:0;left:0;display:none;"></div>
    <table cellspacing="0" cellpadding="0" border="0" :style="styles">
        <colgroup>
            <col v-for="(column, index) in columns" :width="setCellWidth(column, index, true)">
        </colgroup>
        <thead>
            <tr>
                <th v-for="(column, index) in columns" :class="alignCls(column)" @mousemove="mousemoveHandler" @mousedown="mousedownHandler($event,index)" @mouseleave="mouseleaveHandler">
                    <div :class="cellClasses(column)">
                        <template v-if="column.type === 'expand'"></template>
                        <template v-else-if="column.type === 'selection'"><Checkbox :value="isSelectAll" @on-change="selectAll"></Checkbox></template>
                        <template v-else>
                            <span v-html="renderHeader(column, index)"></span>
                            <span :class="[prefixCls + '-sort']" v-if="column.sortable">
                                <i class="ivu-icon ivu-icon-arrow-up-b" :class="{on: column._sortType === 'asc'}" @click="handleSort(index, 'asc')"></i>
                                <i class="ivu-icon ivu-icon-arrow-down-b" :class="{on: column._sortType === 'desc'}" @click="handleSort(index, 'desc')"></i>
                            </span>
                            <Poptip
                                v-if="isPopperShow(column)"
                                v-model="column._filterVisible"
                                placement="bottom"
                                @on-popper-hide="handleFilterHide(index)">
                                <span :class="[prefixCls + '-filter']">
                                    <i class="ivu-icon ivu-icon-funnel" :class="{on: column._isFiltered}"></i>
                                </span>
                                <div slot="content" :class="[prefixCls + '-filter-list']" v-if="column._filterMultiple">
                                    <div :class="[prefixCls + '-filter-list-item']">
                                        <checkbox-group v-model="column._filterChecked">
                                            <checkbox v-for="item in column.filters" :key="item" :label="item.value">{{ item.label }}</checkbox>
                                        </checkbox-group>
                                    </div>
                                    <div :class="[prefixCls + '-filter-footer']">
                                        <i-button type="text" size="small" :disabled="!column._filterChecked.length" @click.native="handleFilter(index)">{{ t('i.table.confirmFilter') }}</i-button>
                                        <i-button type="text" size="small" @click.native="handleReset(index)">{{ t('i.table.resetFilter') }}</i-button>
                                    </div>
                                </div>
                                <div slot="content" :class="[prefixCls + '-filter-list']" v-else>
                                    <ul :class="[prefixCls + '-filter-list-single']">
                                        <li
                                            :class="itemAllClasses(column)"
                                            @click="handleReset(index)">{{ t('i.table.clearFilter') }}</li>
                                        <li
                                            :class="itemClasses(column, item)"
                                            v-for="item in column.filters"
                                            @click="handleSelect(index, item.value)">{{ item.label }}</li>
                                    </ul>
                                </div>
                            </Poptip>
                        </template>
                    </div>
                </th>
            </tr>
        </thead>
    </table>
    </div>
</template>
<script>
    // import CheckboxGroup from 'iview/src/components/checkbox/checkbox-group.vue';
    // import Checkbox from 'iview/src/components/checkbox/checkbox.vue';
    // import Poptip from 'iview/src/components/poptip/poptip.vue';
    // import iButton from 'iview/src/components/button/button.vue';
    import Mixin from './mixin';
    import Locale from './mixins/locale.js';

    export default {
        name: 'TableHead',
        data(){
            return {
                isDragging : false,
            }
        },
        mixins: [ Mixin, Locale ],
        // components: { CheckboxGroup, Checkbox, Poptip, iButton },
        props: {
            prefixCls: String,
            styleObject: Object,
            columns: Array,
            objData: Object,
            data: Array,    // rebuildData
            columnsWidth: Object,
            draggable: {
                type:Boolean,
                default:false
            },
            fixed: {
                type: [Boolean, String],
                default: false
            }
        },
        computed: {
            styles () {
                const style = Object.assign({}, this.styleObject);
                const width = this.$parent.bodyHeight === 0 ? parseInt(this.styleObject.width) : parseInt(this.styleObject.width) + this.$parent.scrollBarWidth;
                style.width = `${width}px`;
                return style;
            },
            isSelectAll () {
                let isSelectAll = true;
                if (!this.data.length) isSelectAll = false;
                for (let i = 0; i < this.data.length; i++) {
                    if (!this.objData[this.data[i]._index]._isChecked && !this.objData[this.data[i]._index]._isDisabled) {
                        isSelectAll = false;
                        break;
                    }
                }

                return isSelectAll;
            }
        },
        methods: {
            mousemoveHandler(e){
                if (!this.draggable) {return}
                const bodyStyle = document.body.style;
                let target = e.target;
                while (target && target.tagName !== 'TH') {
                    target = target.parentNode;
                }
                if (target) {
                    let rect = target.getBoundingClientRect();
                    if (rect.width > 12 && rect.right - e.pageX < 10) {
                      bodyStyle.cursor = 'col-resize';
                      this.isDragging = true;
                    } else {
                      bodyStyle.cursor = '';
                      this.isDragging = false;
                    }
                }else{
                    bodyStyle.cursor = '';
                    this.isDragging = false;
                }
            },
            mouseleaveHandler(){
                document.body.style.cursor = '';
            },
            mousedownHandler(e,index){
                if (!this.draggable || !this.isDragging) {return}
                const table = this.$parent.$el;
                // document.onselectstart = function() { return false; };
                // document.ondragstart = function() { return false; };
                var target = e.target;
                while (target && target.tagName !== 'TH') {
                    target = target.parentNode;
                }
                target.onselectstart = function() { return false; };
                target.ondragstart = function() { return false; };
                let startX = e.pageX;
                let columns = this.columns;
                let columnsWidth = this.columnsWidth;

                let leftColWidth = columns[index].width?columns[index].width:columnsWidth[index].width;
                let rightColWidth = columns[index+1].width?columns[index+1].width:columnsWidth[index+1].width;
                let rect = target && target.getBoundingClientRect();
                let x = table.getBoundingClientRect().left;

                let minX = rect.left - x;
                let maxX = rect.right + rightColWidth - x;

                const handleMouseMove = (event) => {
                    let borderLeft = event.pageX - x;

                    if (borderLeft<minX+30) {
                        borderLeft = minX+30
                    }
                    // if (borderLeft>maxX-50) {
                    //     borderLeft = maxX-50;
                    // }
                    document.body.style.cursor = 'col-resize';
                    this.$emit('emitDrag' , borderLeft);
                    document.querySelector("#expect").style.left = borderLeft+'px';
                    let H = document.querySelector(".ivu-table-wrapper").offsetHeight;
                    document.querySelector("#expect").style.height = H+'px';
                    document.querySelector("#expect").style.display = 'block';
                };
                const handleMouseUp = (event)=>{

                    let deltaX = event.pageX - startX;

                    if (deltaX<0 && deltaX < -leftColWidth+30) {
                        deltaX = -leftColWidth+30;
                    }
                    // if (deltaX>0 && deltaX > rightColWidth-50) {
                    //     deltaX = rightColWidth -50;
                    // }
                    this.$emit('emitDrag' , false , deltaX , index);
                    document.querySelector("#expect").style.display = "none";
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                    target.onselectstart = function() {};
                    target.ondragstart = function() {};
                }
                
                document.addEventListener('mousemove' , handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            },
            cellClasses (column) {
                return [
                    `${this.prefixCls}-cell`,
                    {
                        [`${this.prefixCls}-hidden`]: !this.fixed && column.fixed && (column.fixed === 'left' || column.fixed === 'right')
                    }
                ];
            },
            itemClasses (column, item) {
                return [
                    `${this.prefixCls}-filter-select-item`,
                    {
                        [`${this.prefixCls}-filter-select-item-selected`]: column._filterChecked[0] === item.value
                    }
                ];
            },
            itemAllClasses (column) {
                return [
                    `${this.prefixCls}-filter-select-item`,
                    {
                        [`${this.prefixCls}-filter-select-item-selected`]: !column._filterChecked.length
                    }
                ];
            },
            renderHeader (column, $index) {
                if ('renderHeader' in this.columns[$index]) {
                    return this.columns[$index].renderHeader(column, $index);
                } else {
                    return column.title || '#';
                }
            },
            selectAll () {
                const status = !this.isSelectAll;
                this.$parent.selectAll(status);
            },
            handleSort (index, type) {
                if (this.columns[index]._sortType === type) {
                    type = 'normal';
                }
                this.$parent.handleSort(index, type);
            },
            handleFilter (index) {
                this.$parent.handleFilter(index);
            },
            handleSelect (index, value) {
                this.$parent.handleFilterSelect(index, value);
            },
            handleReset (index) {
                this.$parent.handleFilterReset(index);
            },
            handleFilterHide (index) {
                this.$parent.handleFilterHide(index);
            }
        }
    };
</script>
