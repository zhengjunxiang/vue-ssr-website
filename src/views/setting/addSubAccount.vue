<template>
  <div>
    <h3 class="h1">{{$t('setting.addSub')}}</h3>
    <div class="content-box">
      <Form ref="formAdd" :model="formAdd" :rules="ruleAdd" @submit.native.prevent>
        <FormItem prop="userId">
          <Input v-model="formAdd.userId" :placeholder="$t('setting.warning02')" size="large" />
        </FormItem>
      </Form>
      <p style="color:#6d6d6d; font-size:16px;">{{$t('setting.warning01')}}</p>
    </div>
    <div class="btns-box">
      <Button type="primary" class="btn-com" @click="handleSubmitAdd" :loading="addLoading">{{$t('common.create')}}</Button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'addSubAccount',
  props:['modalAdd'],
  data () {
    const validateScript = (rule, value, callback) => {
      if (value === '') callback(new Error(this.$t('warn.plInp')));
      if (this.$U.mapUserId(value)) callback(new Error(this.$t('warn.invalidCH')));
      if (this.$U.getByteLen(value) >= 64) callback(new Error(this.$t('warn.CHLength')));
      else callback();
    };
    return { 
      addLoading: false,
      formAdd: { userId: '' },
      ruleAdd: {
        userId: [
          { required: true, message: this.$t('warn.plInp'), trigger: 'blur' },
          { validator: validateScript, trigger: 'change' },
        ],
      },
    }
  },
  methods: {
    handleSubmitAdd() {
      this.$refs['formAdd'].validate(async valid => {
        if (valid) {
          try {
            const {userId} = this.formAdd;
            this.addLoading = true;
            await this.$store.dispatch('setAccountAdd', {userId});
            this.$Message.success(this.$t('success.addSubAccount'))
            this.addLoading = false;
            this.formAdd.userId = '';
            this.$emit('cd')
          } catch (e) {
            if (e.isCodeError !== true) this.$Message.error(this.$t('error.addSubAccount'));
            console.log('e', e);
            this.addLoading = this.modalAdd = false;
            this.$emit('cd')
          }
        } else this.$Message.error(this.$t('valid.validError'));
      })
    },
  }
}
</script>
<style lang='less'>
@import './index.less';
@import './index-m.less';
</style>