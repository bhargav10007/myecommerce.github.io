import{writable,readable,derived,get}from"svelte/store";import{LexoRank}from"lexorank";import{tablesome_format,tablesome_isValid,tablesome_PHPDate}from"./../../src/wrapper/date-fns";class RowStore{changedRecords;lastStateRecordID;constructor(e,t){this.changedRecords=writable([]),this.storeHouse=t,this.lastStateRecordID=writable(e.lastStateRecordID||1)}set(e){this.changedRecords.set(e)}get(){return get(this.changedRecords)}addRowOnly(e){e=parseInt(e);let t=this._getEmptyRowNew(e),o=get(this.changedRecords);t.content=this.__getEmptyRowContent(),o.splice(e+1,0,t),this.changedRecords.set(o)}deleteRow(e){this.recordDelete(e);const t=this.getRowStoreContent();t.splice(e,1),this.rows.set(t)}recordDraggedOnly(e,t,o){let r,s;const n=this.storeHouse.getRowStoreContent();if(null!=e&&null!=t){const a=LexoRank.parse(n[e].rank_order),d=LexoRank.parse(n[t].rank_order);s=t-1,s=o>s?t:s,r=a.between(d).toString()}else if(null==e){s=t<=0?t:t-1,r=LexoRank.parse(n[t].rank_order).genPrev().toString()}else if(null==t){s=e+1,r=LexoRank.parse(n[e].rank_order).genNext().toString()}if(o!=s){let e=n[o];e.rank_order=r,this.updateRecordOnly(e)}}duplicateRowOnly(e){const t=get(this.changedRecords),o=get(this.storeHouse.columnStore.columns);e=parseInt(e);const r=this._getEmptyRow(e),s=this.storeHouse.getRowStoreContent();let n=JSON.parse(JSON.stringify(s[e].content));r.content=[],r.status="duplicated",r.originalStateRecordID=s[e].stateRecordID;for(let e=0;e<o.length;e++){o[e].status;if("deleted"!=o[e].status)if(-1!=n.findIndex((t=>t.column_id==o[e].id))){let t=n.find((t=>t.column_id==o[e].id))||{};r.content.push(t)}else if(this.doesSourceCellExist(n,o[e],o)){let t=this.getSourceCell(n,o[e],o);r.content.push(t)}}t.push(r),this.changedRecords.set(t)}getSourceCell(e,t,o){let r=t.sourceId?t.sourceId:-1;return e.find((e=>e.column_id==r))}doesSourceCellExist(e,t,o){let r=!1;if("duplicated"==t.status){let e=t.sourceId?t.sourceId:-1;r=-1!=o.findIndex((t=>t.id==e))}return r}deleteRowOnly(e){const t=this.storeHouse.getRowStoreContent();let o=Object.assign({},t[e]);const r=get(this.changedRecords);let s=!1;for(let e=0;e<r.length;e++){const t=r[e];if(t.stateRecordID==o.stateRecordID){t.status="deleted",s=!0;break}}0==s&&(o.status="deleted",r.push(o)),this.changedRecords.set(r)}_getEmptyRow(e){this.lastStateRecordID.update((e=>e+1));const t=this.storeHouse.getRowStoreContent(),o=t.length,r=t[e].rank_order,s=e+1;let n="";if(o==s)n=LexoRank.parse(r).genNext().toString();else{const e=LexoRank.parse(r),o=LexoRank.parse(t[s].rank_order);n=e.between(o).toString()}return{record_id:0,stateRecordID:get(this.lastStateRecordID),content:[],rank_order:n,created_at:tablesome_PHPDate(),updated_at:tablesome_PHPDate()}}__getEmptyRowContent(){let e=[],t=get(this.storeHouse.columnStore.columns);for(let o=0;o<t.length;o++)e.push({value:"",html:"",column_id:t[o].id});return e}_getEmptyRowNew(e){this.lastStateRecordID.update((e=>e+1));const t=this.storeHouse.getRowStoreContent(),o=t.length,r=t[e].rank_order,s=e+1;let n="";if(o==s)n=LexoRank.parse(r).genNext().toString();else{const e=LexoRank.parse(r),o=LexoRank.parse(t[s].rank_order);n=e.between(o).toString()}return{record_id:0,stateRecordID:get(this.lastStateRecordID),content:[],rank_order:n,created_at:tablesome_PHPDate(),updated_at:tablesome_PHPDate()}}updateRecordOnly(e){let t=this.getRecordIndexFromChangedRecords(e.stateRecordID),o=t>-1,r=get(this.changedRecords);return o?r[t]=e:r.push(Object.assign({},e)),this.changedRecords.set(r),e}getRecordIndexFromChangedRecords(e){return get(this.changedRecords).findIndex((t=>t.stateRecordID==e))}}export default RowStore;