import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import LoginView from '@/views/LoginView.vue';
import UtilityService from '@/services/UtilityService';
import MyGlobal from '../../__tests__/_Globals.spec';

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/services/UtilityService');
UtilityService.Alert = vi.fn();
UtilityService.Confirm = vi.fn().mockResolvedValue({ isConfirmed: true });

describe('LoginView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('當 渲染時 會 載入FB與Google的SDK', async () => {
    mount(LoginView, {
      global: MyGlobal,
    });

    const googleScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    expect(googleScript).not.toBeNull();

    const fbScript = document.querySelector('script[src="https://connect.facebook.net/en_US/sdk.js"]');
    expect(fbScript).not.toBeNull();
  });

  it('當 點選開始使用時沒有Google名稱 會 提示', async () => {
    const wrapper = mount(LoginView, {
      global: MyGlobal,
    });
    (wrapper.vm as unknown as { User: { FBName: string; GoogleName: string } }).User = { FBName: '', GoogleName: '' };

    (
      wrapper.vm as unknown as {
        StartToUse: () => void;
      }
    ).StartToUse();

    expect(UtilityService.Alert).toHaveBeenCalledWith('請先登入Google帳號', 'error');
  });

  it('當 點選開始使用時沒有Facebook名稱 會 提示', async () => {
    const wrapper = mount(LoginView, {
      global: MyGlobal,
    });

    (wrapper.vm as unknown as { User: { FBName: string; GoogleName: string } }).User = { FBName: '', GoogleName: 'fakeGoogleName' };

    (
      wrapper.vm as unknown as {
        StartToUse: () => void;
      }
    ).StartToUse();

    expect(UtilityService.Alert).toHaveBeenCalledWith('請先綁定Facebook帳號', 'error');
  });
});
