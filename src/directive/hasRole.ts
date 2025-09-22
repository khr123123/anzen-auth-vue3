import type { Directive, DirectiveBinding } from 'vue';
import { useUserStore } from '@/store/userStore';

const superAdmin = 'admin';

const roleDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;

    const userStore = useUserStore();
    const roles: string[] = userStore.userInfo?.roles || [];

    if (value && Array.isArray(value) && value.length > 0) {
      const roleFlag: string[] = value;

      const hasRole = roles.some(role => role === superAdmin || roleFlag.includes(role));

      if (!hasRole) {
        el.parentNode?.removeChild(el);
      }
    } else {
      throw new Error('请设置角色权限标签值，例如 v-role="[\'admin\', \'editor\']"');
    }
  }
};

export default roleDirective;
