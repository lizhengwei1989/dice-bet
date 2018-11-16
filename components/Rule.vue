<template>
    <el-dialog
            :title="$t('Rule.title')"
            :visible.sync="ruleDialog.visible"
            width="5.8rem"
            custom-class="how-dialog">
        <p v-html="$t('Rule.p1')"></p>
        <p v-html="$t('Rule.p2')"></p>
        <p v-html="$t('Rule.p3')"></p>
        <p v-html="$t('Rule.p4')"></p>
        <p v-html="$t('Rule.p5')"></p>
        <p v-html="$t('Rule.p6')"></p>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="ruleDialog.visible = false">{{$t('Confirm')}}</el-button>
          </span>
    </el-dialog>
</template>

<script>
    export default {
        props:{
            ruleDialog: {
                type: Object,
                default: {}
            }
        },
        name: "Rule"
    }
</script>

<style scoped>

</style>