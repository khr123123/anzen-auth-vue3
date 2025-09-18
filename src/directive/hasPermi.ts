import type { Directive, DirectiveBinding } from 'vue';
import { useUserStore } from '@/store/userStore';

const allPermission = '*:*:*';

const permissionDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;

    const userStore = useUserStore();
    const permissions: string[] = userStore.user?.permissions || [];

    if (value && Array.isArray(value) && value.length > 0) {
      const permissionFlag: string[] = value;

      const hasPermissions = permissions.some(
        permission => permission === allPermission || permissionFlag.includes(permission)
      );

      if (!hasPermissions) {
        el.parentNode?.removeChild(el);
      }
    } else {
      throw new Error('请设置操作权限标签值，例如 v-permission="[\'sys:user:add\']"');
    }
  }
};

export default permissionDirective;
