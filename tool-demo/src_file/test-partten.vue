exports = module.exports = require("../../../../node_modules/css-loader/lib/css-base.js")();
// imports


// module
exports.push([module.id, "
    .siteList .text-base-wrap {
        width: 450px;
    }
", "", {"version":3,"sources":["/./src/views/page/cmdb/siteList.vue.style"],"names":[],"mappings":";IAYA;QACA,aAAA;KACA","file":"siteList.vue","sourcesContent":["<!--
    @修改人：黎柏祺
    @修改时间：2018-04-10
    @修改描述：增加站点类型查询
    @版本:v1.0.15
    ------
    @负责人: 谢汉
    @创建时间: 2018-01-18
    @版本:v1.0.12
    @描述: 站点列表页
    -->
<style>
    .siteList .text-base-wrap {
        width: 450px;
    }
</style>
<template>
    <div class="siteList content-wrap">
        <div class="mb10">
            <button class="btn btn-primary mr10" type="button" slot="add" @click="e_addShow" v-text="i18n.add" v-g-rac="getRac('siteList_add')"></button>
        </div>
        <uk-table v-ref:site-list :config.sync="tableData" :searchvalue.sync="searchvalue" :dictionary="tabledictionary">


        </uk-table>

        <g-table-detail v-ref:table-detail :data="tableDetailData" :parton="tableDetailParton" :parton-lang="tableDetailPartonLang" ></g-table-detail>
        <uk-dialog v-ref:update-dialog size="3">
            
            <span slot="title" v-text="dialogTitle"></span>
            <div slot="content">
                <uk-form v-ref:update-site-form>
                    <div class="mb20" v-if="editType == 'EDIT'">
                        <uk-label classes="form-control-label" :label="i18n.list.id" v-if="i18n.list"></uk-label>
                        <g-input-read-only name="id" :value="editId"></g-input-read-only>
                    </div>
                    <div class="mb20">
                        <uk-label classes="form-control-label" :label="i18n.list.name" v-if="i18n.list"></uk-label>
                        <g-input-no-empty name="name"></g-input-no-empty>
                    </div>
                    <div class="mb20">
                        <uk-label classes="form-control-label" :label="i18n.list.siteCode" v-if="i18n.list"></uk-label>
                        <g-input-no-empty name="siteCode"></g-input-no-empty>
                    </div>
                    <div class="mb20">
                        <uk-label classes="form-control-label" :label="i18n.list.siteType" v-if="i18n.list"></uk-label>
                        <g-select name="siteType" :_list="select_type"></g-select>
                    </div>
                    <div class="mb20">
                        <uk-label classes="form-control-label" :label="i18n.list.network" v-if="i18n.list"></uk-label>
                        <g-input-no-empty name="network"></g-input-no-empty>
                    </div>
                    <div class="mb20">
                        <uk-label classes="form-control-label" :label="i18n.list.bandWidth" v-if="i18n.list"></uk-label>
                        <g-input-no-empty name="bandWidth"></g-input-no-empty>
                    </div>
                    <div class="mb20">
                        <uk-label classes="form-control-label" :label="i18n.list.contact" v-if="i18n.list"></uk-label>
                        <g-input-no-empty name="contact"></g-input-no-empty>
                    </div>
                    <div class="mb20">
                        <uk-label classes="form-control-label" :label="i18n.list.phone" v-if="i18n.list"></uk-label>
                        <g-input-no-empty name="phone"></g-input-no-empty>
                    </div>
                    <div class="mb20">
                        <uk-label classes="form-control-label" :label="i18n.list.address" v-if="i18n.list"></uk-label>
                        <g-input-no-empty name="address"></g-input-no-empty>
                    </div>
                    <div class="mb20">
                        <uk-label classes="form-control-label" :label="i18n.list.accessId" v-if="i18n.list"></uk-label>
                        <g-input-password name="accessId"></g-input-password>
                    </div>
                    <div class="mb20">
                        <uk-label classes="form-control-label" :label="i18n.list.secretKey" v-if="i18n.list"></uk-label>
                        <g-input-password name="secretKey"></g-input-password>
                    </div>
                    <div class="mb20">
                        <uk-label classes="form-control-label" :label="i18n.list.ec2endpoint" v-if="i18n.list"></uk-label>
                        <g-input-password name="ec2endpoint"></g-input-password>
                    </div>
                    <div class="mb20">
                        <uk-label classes="form-control-label" :label="i18n.list.ipAddrSegment" v-if="i18n.list"></uk-label>
                        <g-input-no-empty name="ipAddrSegment"></g-input-no-empty>
                    </div>
                    <div class="mb20">
                        <uk-label classes="form-control-label" :label="i18n.list.remarks" v-if="i18n.list"></uk-label>
                        <div class="ilb text-base--dialog">
                            <uk-text-base name="remarks" ischeck="true"></uk-text-base>
                        </div>
                    </div>
                </uk-form>
            </div>
            <button type="button" slot="button"  class="btn btn-primary" @click.stop='e_updateSave'
                    v-text="i18n.save"></button>
        </uk-dialog>
    </div>
</template>
<script type="text/javascript">
    import lan from '../../../libs/base/lanLoader'
    import { util } from '../../../libs/base/util'
    import SiteController from '../../biz/ops/cmdb/siteBiz'
    import tableBtn from '../../components/table/delete-amend-check.vue'
    import DictionaryBiz from '../../biz/dictionaryBiz'

    const EDIT_TYPE = {
        ADD: 'ADD',
        EDIT: 'EDIT'
    };

    export default {
        components: {
            gTableSearch: require('../../../components/table/table-search.vue'),
            gTableDetail: require('../../../components/table/table-detail-extend.vue'),
            gInputNoEmpty: require('../../../components/input/input-noempty.vue'),
            gInputPassword: require('../../components/input/input-password-extend.vue'),
            gInputReadOnly: require('../../../components/input/input-readonly.vue'),
            gSelect: require('../../components/select.vue')
        },
        data () {
            const that = this;
            return {
                i18n: {},
                dialogTitle: '',
                editType: '',
                editId: '',
                tableData: {
                    ajaxOption: {
                        url: window.SystemGlobe.url.cmdb.siteList,
                        method: 'get',
                        pageSize: 5,
                        perPage: 10,
                        currPage: 1,
                        json: false
                    },
                    parton: ['name', 'siteCode', 'address', 'network', 'bandWidth', 'contact', 'phone', 'siteListOperate'],
                    component: {
                        siteListOperate: tableBtn
                    },
                    afterFilter(d) {
                        setTimeout(() => {
                            that.$broadcast('getData', {
                                title: that.title,
                                deleteCode: 'siteList_delete',
                                amendCode: 'siteList_amend',
                                checkCode: 'siteList_check'
                            });
                        }, 100);
                        return d;
                    },
                    lanKey: 'v_siteList',
                    multiSelect: false,
                    showSort: false,
                    showIndex: false,
                    showSelect: false,
                    showOperate: false,
                    customerCol: false,
                    beforeFilterReplaceOldList: true
                },
                selectvalue: '',
                // 表格字典
                tabledictionary: null,
                searchvalue: {},
                select_type:{},     
                tableDetailData: {},
                tableDetailParton: ['id', 'name', 'address', 'siteType', 'ipAddrSegment', 'network', 'bandWidth', 'contact', 'operator', 'phone', 'remarks'],
                tableDetailPartonLang: {},
                title: 'siteList' 
            }
        },
        watch: {
            'select_type': function (newValue) {
                if (this.tabledictionary === null) {
                    this.tabledictionary = {};
                }
                this.tabledictionary['siteType'] = newValue;
            },
        },
        events: {
            checkItem(d) {
                const rowData = { ...d };
                if (rowData.title === this.title) {
                    this.selectvalue = { ...rowData };
                    this.tableDetailData = this.selectvalue;
                    this.$refs.tableDetail.e_show();
                }
            },
            amendItem(d) {
                this.editType = EDIT_TYPE.EDIT;
                this.dialogTitle = this.i18n.update;
                const rowData = { ...d };
                if (rowData.title === this.title) {
                    this.selectvalue = { ...rowData };
                    const formData = this.selectvalue.primaryValue;
                    this.$refs.updateSiteForm.setData(formData);
                    this.editId = formData.id;
                    this.$refs.updateDialog.$emit('openDialog');
                }
            },
            deleteItem(d) {
                const rowData = { ...d };
                if (rowData.title === this.title) {
                    this.selectvalue = { ...rowData };

                    const id = this.selectvalue.primaryValue.id;
                    const that = this;
                    util.dialogTipsShow({
                        txt: this.i18n.deleteConfirm,
                        title: this.i18n.delete,
                        callBack: function () {
                            SiteController.deleteSite(id).then((data) => {
                                util.middleTipsShow({
                                    ico: 2,
                                    txt: that.i18n.success
                                });
                                setTimeout(() => {
                                    that.$refs.siteList.reflash({ currentPage: that.$refs.siteList.currPageBtn + 1 });
                                }, 600);
                            }).catch((err) => {
                                console.error('deleteSite network error', err);
                            });
                        }
                    });
                }
            }
        },
        methods: {
            init: function() {
                const that = this;
                lan.getLan('v_siteList').then(function (lanObj) {
                    that.i18n = lanObj;
                    that.tableDetailPartonLang = lanObj.list;
                    that.title = lanObj.siteList;
                });
                DictionaryBiz.searchDictionaryByCode('siteType').then((data) => {
                    that.select_type = data;
                });
            },
            resetForm() {
                this.$refs.updateSiteForm.setData({
                    address: '',
                    bandWidth: '',
                    contact: '',
                    ipAddrSegment: '',
                    name: '',
                    siteCode: '',
                    network: '',
                    phone: '',
                    accessId: '',
                    secretKey: '',
                    ec2endpoint: '',
                    remarks: '',
                    siteType: ''
                })
            },
            add(data) {
                const that = this;
                delete data.id;
                SiteController.addSite(data).then((res) => {
                    that.$refs.updateDialog.$emit('closeDialog');
                    that.resetForm();
                    util.middleTipsShow({
                        ico: 2,
                        txt: that.i18n.success
                    });
                    setTimeout(() => {
                        that.$refs.siteList.reflash({ currentPage: that.$refs.siteList.currPageBtn + 1 });
                    }, 600);
                }).catch((err) => {
                    console.error('addSite network error', err);
                });
            },
            update(data) {
                const that = this;
                SiteController.updateSite(data).then((res) => {
                    that.$refs.updateDialog.$emit('closeDialog');
                    that.resetForm();
                    util.middleTipsShow({
                        ico: 2,
                        txt: that.i18n.success
                    });
                    setTimeout(() => {
                        that.$refs.siteList.reflash({ currentPage: that.$refs.siteList.currPageBtn + 1 });
                    }, 600);
                }).catch((err) => {
                    console.error('updateSite network error', err);
                });
            },
            e_addShow() {
                this.editType = EDIT_TYPE.ADD;
                this.dialogTitle = this.i18n.add;
                this.resetForm();
                this.editId = '';
                this.$refs.updateDialog.$emit('openDialog');
            },
            e_updateSave() {
                const that = this,
                check = this.$refs.updateSiteForm.getData();
                if (check.ischeck) {
                    if (this.editType === EDIT_TYPE.EDIT) {
                        that.update(check.data);
                    } else {
                        that.add(check.data);
                    }
                }
            }
        },
        ready() {
            this.init();
            window.$$routeList.siteList = this;
        }
    }
</script>"],"sourceRoot":"webpack://"}]);

// exports



//////////////////
// WEBPACK FOOTER
// ./~/css-loader?sourceMap!./~/vue-loader/lib/style-rewriter.js?id=_v-0da77690&file=siteList.vue!./~/vue-loader/lib/selector.js?type=style&index=0!./src/views/page/cmdb/siteList.vue
// module id = 1036
// module chunks = 20